import { 
    createAccountService, 
    accountExistService, 
    getAccountByEmail, 
    getAllAccountsService 
} from './accountServices.js'




///////////////////Create an account
export const createAccount = async(req, res) => {
    
    const { fullName, businessName, email, password } = req.body
    if(!fullName || !businessName || !email || !password){
        return res.json({
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

//////////////////get all Accounts
export const getAllAcountController = async(req, res) => {
    try{
       const allAccount = await getAllAccountsService()
       res.json({
        status: "Success",
        message: "All account fetched successfully",
        allAccount,
       })
    } catch(error){
        res.json({
            status: "Failed",
            message: "Internal server error"
        })
    }
}

////////////////////get An account by Email
export const getAccountByEmailController = async(req, res) => {
    const {email} = req.params
    console.log(req)
    if(email){
       const getAccount = await getAccountByEmail(email)
       res.json({
        status: "Success",
        message: `${email} retrieved successfully`,
        getAccount
       })
    } else {
       res.json({
        status: "Failed",
        message: "Sorry we could not get the account you seek"
       })
    }
}

