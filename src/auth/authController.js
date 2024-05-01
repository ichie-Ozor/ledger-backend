import { getAccountByEmail, editAccountService } from '../account/accountServices.js'
import bcrypt from "bcryptjs";
import JWT from 'jsonwebtoken';


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
    const checkEmail = await getAccountByEmail(email)
    const {fullName, businessName, role, _id, verification,  phoneNumber, approval} = checkEmail
    const userDetail ={ fullName, businessName, role, _id, verification, email, phoneNumber, approval}
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
    if(!verification || timer > 2592000000 ){           //this helps us to make sure that the person has confirmed their email therefore avoiding invalid email address
        return res.json({
         status: "Failed",
         code: 900,
         message: "You need to make payment so as to verify your account"
     })
    }
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
        ///JWT token is created here
        const assessToken = await JWT.sign(
            { businessName },
            process.env.JWT_SECRET,
            {
                expiresIn: "15000s"
            }
        );
        //////////////Refresh Token
        const refreshToken = await JWT.sign(
            { businessName },
            process.env.REFRESH_SECRET,
            {
                expiresIn: "15000s"
            }
        );
     res.json({
         status: "Success",
         message: "You have successfully signed in",
         userDetail,
         assessToken,
         refreshToken

     })
    }
 }