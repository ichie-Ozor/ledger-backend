import { AuthModel } from "./authModel.js";
import bycryptjs from 'bcryptjs'


////////////creating an account
export const createAccountService = async(body, res) => {
   const auth = new AuthModel(body)
   const salt = bycryptjs.genSaltSync(10)
   const hashedPassword = bycryptjs.hashSync(body.password, salt)
   auth.password = hashedPassword
   await auth
   .save()
   .then(result => {
      sendVerificationEmail(result, res)
   })
   .catch((error) => {
      console.log(error)
      res.json({
         status: "Failed",
         message: "email was Not sent!"
      })
   })
   return auth
}
////////////if the account exist
export const accountExistService = async(email) => {
   const findAccount = await AuthModel.findOne({email})
   if(!findAccount || !findAccount.email){
    return false 
   } else {
    return true
   }
}
/////////////get individual account
export const getAccountByEmail = async(email) => {
    const findAccount = await AuthModel({email})
    if (!findAccount || !findAccount.email){
      return false 
    } else {
      return true
    }
}




/////////////////////Email Verification/////////////////////////
const sendVerificationEmail = ({_id, email}, res) => {
   console.log("email sent successfully")
}