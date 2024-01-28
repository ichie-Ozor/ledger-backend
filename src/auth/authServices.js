import { AuthModel } from "./authModel.js";
import bycryptjs from 'bcryptjs'


////////////creating an account
export const createAccountService = async(body, res) => {
   const auth = new AuthModel(body)
   const salt = bycryptjs.genSaltSync(10)
   const hashedPassword = bycryptjs.hashSync(body.password, salt)
   auth.password = hashedPassword
   console.log(auth)
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

/////////////get All the accounts
export const getAllAccountsService = async() => {
   const allAccount = AuthModel.find()
   return allAccount
}


/////////////get individual account
export const getAccountByEmail = async(email) => {
    const findAccount = await AuthModel.findOne({email})
    if (!findAccount || !findAccount.email){
      return false 
    } else {
      return (true, findAccount)
    }
}

/////////////////////Email Verification/////////////////////////
const sendVerificationEmail = ({_id, email}, res) => {
   console.log("email sent successfully")
}