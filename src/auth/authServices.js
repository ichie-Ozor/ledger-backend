// import { AuthModel } from "./authModel.js";
// import bycryptjs from 'bcryptjs'
import { AccountModel } from '../models/accountModel.js'
import JWT from 'jsonwebtoken';

// ////////////creating an account
// export const createAccountService = async(body, res) => {
//    const auth = new AuthModel(body)
//    const salt = bycryptjs.genSaltSync(10)
//    const hashedPassword = bycryptjs.hashSync(body.password, salt)
//    auth.password = hashedPassword
//    // console.log(auth)
//    await auth
//    .save()
//    .then(result => {
//       sendVerificationEmail(result, res)
//    })
//    .catch((error) => {
//       console.log(error)
//       res.json({
//          status: "Failed",
//          message: "email was Not sent!"
//       })
//    })
//    return auth
// }
// ////////////if the account exist
// export const accountExistService = async(email) => {
//    const findAccount = await AuthModel.findOne({email})
//    if(!findAccount || !findAccount.email){
//     return false 
//    } else {
//     return true
//    }
// }
// /////////////get individual account
// export const getAccountByEmail = async(email) => {
//     const findAccount = await AuthModel.findOne({email})
//     if (!findAccount || !findAccount.email){
//       return false 
//     } else {
//       return (true, findAccount)
//     }
// }




// /////////////////////Email Verification/////////////////////////
// const sendVerificationEmail = ({_id, email}, res) => {
//    console.log("email sent successfully")
// }

export const createAssessToken = async(accountEmail) => {
   // const userDetail = await AccountModel.find({email: accountEmail})
    ///JWT token is created here
    const assessToken = await JWT.sign(
      { accountEmail },
      process.env.JWT_SECRET,
      {
          expiresIn: "15m"
      }
  );
  return assessToken
}

export const createRefreshToken = async(accountEmail) => {
   //////////////Refresh Token
   const refreshToken = await JWT.sign(
      { accountEmail },
      process.env.REFRESH_SECRET,
      {
          expiresIn: "15m"
      }
  );
  return refreshToken
}

export const verifyTokenService = async(token) => {
   if(!token){
      return false
   } else {
      const decode = await JWT.verify(token, process.env.JWT_SECRET)
      // console.log(decode, "verifyTokenService")
      return decode
   }
}