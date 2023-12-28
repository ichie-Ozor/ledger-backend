import { createAccountService, accountExistService, getAccountByEmail } from './authServices.js'
import { AuthModel } from "./authModel.js";
import bcrypt from 'bcryptjs'



///////////////////Create an account
export const createAccount = async(req, res) => {
    
    const { fullName, businessName, email, password } = req.body
    if(!fullName || !businessName || !email || !password){
        res.json({
            status: "Failed",
            message: "Incomplete credentials, Please complete the inputs"
        })
    } else if(!/^[a-zA-Z ]*$/.test(fullName)){
        res.json({
            status: "Failed",
            message: "Invalid name entered"
        })
    } else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: "Failed",
            message: "Invalid email entered"
        })
    } else if(password.length < 5){
        res.json({
            status: "Failed",
            message: "Password is too small"
        })
    }

    const accountExist = await accountExistService(email)
    console.log(accountExist, "this ")
    if(accountExist){
        return res.json({
            status: "Failed",
            message: "An account with this email already exist"
        })
    }
    const newUser = await createAccountService(req.body)
    if(newUser){
        res.json({
            status: "Success",
            message: `Account with the name ${newUser.fullName} has being created successfully`
          })
    } else(
        res.json({
            status: "Failed",
            message: "Account creation failed"
          })
    )  
}

///////////////////SignIn

export const signInAccount = async(req, res) => {
   const { fullName, email, password } = req.body
   if(fullName == "" || email == "" || password == ""){
    return res.json({
        status: "Failed",
        message: "Please enter your login credentials."
    })
   }

   const checkEmail = await getAccountByEmail(email)
//    console.log(checkEmail.password)
   if(!checkEmail.verification){
    return res.json({
        status: "Failed",
        message: "You are yet to verify your email, please do that so you can sign in"
    })
   } 
   const comparePassword = await bcrypt.compare(password, checkEmail.password)
   console.log(comparePassword)
   if(!comparePassword || email !== checkEmail.email){
    return res.json({
        status: "Failed",
        message: "You have entered an invalid email and password"
    })
   } else {
    res.json({
        status: "Success",
        message: "You have successfully signed in"
    })
   }
}