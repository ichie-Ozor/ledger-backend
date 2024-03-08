import { getAccountByEmail } from '../account/accountServices.js'


///////////////////SignIn

export const signInAccount = async(req, res) => {
    const { fullName, email, password } = req.body
    if(email == "" || password == ""){
     return res.json({
         status: "Failed",
         message: "Please enter your login credentials."
     })
    }
 
    const checkEmail = await getAccountByEmail(email)
    console.log(checkEmail.password, password,checkEmail)
    if(!checkEmail.verification){           //this helps us to make sure that the person has confirmed their email therefore avoiding invalid email address
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