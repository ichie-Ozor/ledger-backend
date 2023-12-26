import { createAccountService, accountExistService } from './authServices.js'
import { AuthModel } from "./authModel.js";

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
    console.log(accountExist)
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