import JWT from 'jsonwebtoken'
import { 
    createAccountService, 
    accountExistService, 
    getAccountByEmail, 
    getAllAccountsService,
    getAccountById,
    editAccountService,
    deleteAccountService,
    encryptPasswordService 
} from './accountServices.js'
import { sendMail } from '../utils/sendMail.js'
import APIError from '../utils/customError.js'
import { VerificationModel } from "../models/verificationModel.js";
import bycryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid';
import { createAssessToken, createRefreshToken } from '../auth/authServices.js'




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
    if(accountExist){
        return res.json({
            status: "Failed",
            message: "An account with this email already exist"
        })
    }
    const newUser = await createAccountService(req.body)
    if(newUser){
        // /////////assess Tokem
        const assessToken = await createAssessToken(email)
        //////////////Refresh Token
        const refreshToken = await createRefreshToken(email)
        res.json({
            status: "Success",
            message: `Account with the name ${newUser.fullName} has being created successfully`,
            assessToken,
            refreshToken
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
    // console.log(req)
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

export const editAccount = async(req, res, next) => {
    const {id} = req.params
    // console.log(req.params, req.body)
    if(!id){
        return next(APIError.badRequest("update id required"))
    }
    try {
        const findAccount = await getAccountById(id)
        // console.log(findAccount, "see am")
        if(!findAccount){
            return next(APIError.notFound('Account not found'))
        }
        const updatedAccount = await editAccountService(id, req.body)
        res.status(200).json({
            success: true,
            message: "Account updated successfully",
            // Account: updatedAccount
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

export const forgetPassword = async(req, res, next) => {
    const {email} =req.params
    const {password} =req.body
    if(!email){
        return next(APIError.badRequest("Please a correct email required"))
    }
    try{
        const findAccount = await getAccountByEmail(email)
        if(!findAccount){
            return next(APIError.notFound("Account with this email is not found"))
        }
        
        const currentUrl = "http://localhost:8080/";
        const uniqueString = uuidv4() + findAccount._id
        const salt = bycryptjs.genSaltSync(10)
        const hashedUniquString = bycryptjs.hashSync(uniqueString, salt)
        
        const newPassword = await encryptPasswordService(password)
        let subject = "Verify your Email!";
        let text = `<p>An attempt is made to change your password. Are you the one? click this link</p>
                    <p>Press <a href=${currentUrl + "verification/"+ newPassword + "/" + findAccount._id + "/" + uniqueString}>here</a></p>
                    <b>This link will expire in 6 hours time</b>
                    <p>If you are not the one who initiated this change, please ignore it</p>`

        const newVerification = new VerificationModel({
            userId: findAccount._id,
            uniqueString: hashedUniquString,
            createdat: Date.now(),
            expiresAt: Date.now() + 21600000
        })
       console.log(newVerification, "new verification")
            await newVerification.save()
            await sendMail("simeon_mc2000@yahoo.com", subject, text)
            res.json({
                    status: "Pending",
                    message: "Verification email sent, please check your email"
            })
    }catch (error) {
        next(APIError.customError(error.message))
    }
}

export const deleteAccount = async(req, res, next) => {
    const {id} = req.body
    if(!id) {
        return next(APIError.badRequest('Account Id is required'))
    }
    try {
        const findAccount = await getAccountById(id)
        if(!findAccount) {
            return next(APIError.badRequest("Account not found"))
        }
        const deletedAccount = await deleteAccountService(id, req.body)
        res.status(200).json({
            success: true,
            message: "Account deleted successfully"
        })
    }catch (error) {
        next(APIError.customError(error.message))
    }
}