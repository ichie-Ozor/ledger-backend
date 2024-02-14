import { getAccountByEmail } from '../account/accountServices.js'
import bcrypt from "bcryptjs"


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
    // console.log(checkEmail, checkEmail.verification, "this")
    if(!checkEmail){               //this checks for wrong email and password
        return res.json({
            status: "Failed",
            message: "This account does not exist, please register"
        })
    }
    if(!checkEmail.verification ){           //this helps us to make sure that the person has confirmed their email therefore avoiding invalid email address
     return res.json({
         status: "Failed",
         message: "You are yet to verify your email, please do that so you can sign in"
     })
    } 
    const comparePassword = await bcrypt.compare(password, checkEmail.password)
    const {fullName, businessName, role, _id} = checkEmail
    const userDetail ={ fullName, businessName, role, _id}
    // console.log(comparePassword, "ok")
    if(!comparePassword || email !== checkEmail.email){
     return res.json({
         status: "Failed",
         message: "You have entered an invalid email and password"
     })
    } else {
     res.json({
         status: "Success",
         message: "You have successfully signed in",
         userDetail

     })
    }
 }