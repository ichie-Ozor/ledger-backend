import { AuthModel } from "./authModel.js";
import bycryptjs from 'bcryptjs'


////////////creating an account
export const createAccountService = async(body) => {
   const auth = new AuthModel(body)
   const salt = bycryptjs.genSaltSync(10)
   const hashedPassword = bycryptjs.hashSync(body.password, salt)
   auth.password = hashedPassword
   await auth.save()
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
}