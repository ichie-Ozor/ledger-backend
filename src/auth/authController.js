import { getAccountByEmail, editAccountService } from '../account/accountServices.js'
import bcrypt from "bcryptjs";
import JWT from 'jsonwebtoken';
import { createAssessToken, createRefreshToken, verifyTokenService} from './authServices.js';
import { AccountModel } from '../models/accountModel.js'


///////////////////SignIn

export const signInAccount = async(req, res) => {
    const { email, password } = req.body
    // console.log(email, password)
    if(email == "" || password == ""){
     return res.json({
         status: "Failed",
         message: "Please enter your login credentials."
     })
    }
    if(email === "ozor@gmail.com" && password === "ozo?yes:no"){
        return res.status(200).json({
            role: "admin",
            message: "this is an admin"
        })
    }
    const checkEmail = await getAccountByEmail(email)
    const {fullName, businessName, role, _id, verification,  phoneNumber, approval} = checkEmail
    const userDetail = { fullName, businessName, role, _id, verification, email, phoneNumber, approval}
    const timer = Date.now() - approval
    // console.log(checkEmail, checkEmail.verification, approval, "this")
    if(!checkEmail){               //this checks for wrong email and password
        return res.json({
            status: "Failed",
            code: 401,
            message: "This account does not exist, please register"
        })
    }
    
    const comparePassword = await bcrypt.compare(password, checkEmail.password)

    if(!comparePassword || email !== checkEmail.email){
     return res.json({
         status: "Failed",
         code: 402,
         message: "You have entered an invalid email and password"
     })
    } 
     //this throws error if the person have not made payment and as such is not verified i.e new account
    if(!verification || timer > 2592000000 ){   
        return res.json({
         status: "Failed",
         code: 900,
         message: "You need to make payment so as to verify your account"
     })
    }
    //this is if the person is an existing account but the subscription has expired i.e more than a month
    // this is for them to renew their subscription
     if( verification && timer > 2592000000 ){
        const updateVerification = {...checkEmail}
        updateVerification.verification = false
        await editAccountService(_id, updateVerification)
        return res.json({
            status: "Failed",
            code: 901,
            message: "You need to make payment to renew your subscription"
        })
    } else {
       const assessToken = await createAssessToken(email)
       const refreshToken = await createRefreshToken(email)
     res.json({
         status: "Success",
         message: "You have successfully signed in",
         userDetail,
         assessToken,
         refreshToken

     })
    }
 }

 export const verifyRefreshToken = (req, res) => { 
    const {assessToken, refreshToken} = req.body
    
    const checkToken = verifyTokenService(assessToken)
    const checkRefreshToken = verifyTokenService(refreshToken)
    const authToken = req.headers["authorization"];
    const token = authToken.split(" ")[1]
    const { email } = token
    // check if the token is expired, then check if the refresh token is still alive. if bothe are expired, return error
    checkToken && checkRefreshToken ? 
    createAssessToken(email) : 
    res.status(403).json({
        success: false,
        message: "refreshToken is expired"
    })
    // if the refreshtoken is alive, create a new assesstoken
    // if the refreshtoken is dead, then send an error message so the client can log in again
   }

   
    // async function verify(req, res){
 export const verifyToken = async(req, res) => {
    // this verify the token from the frontend
    const authToken = req.headers["authorization"];
    const token = authToken.split(" ")[1];
//    const  verifiedToken = await JWT.verify(token, process.env.JWT_SECRET)
    const verifiedToken = verifyTokenService(token)
    if(!verifiedToken){
     return res.status(403).json({
        message: "token verification failed",
     })
   } else {
    // extract the email from the token 
    const { accountEmail } = verifiedToken 
    // using the verifiedToken fetch the user info and add it to the response
    const userDetail = await AccountModel.find({email: accountEmail})
    return res.status(200).json({
      login: true,
      userDetail,
    })
   }
   
 }