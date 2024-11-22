const JWT = require('jsonwebtoken')
const {
    createAccountService,
    accountExistService,
    getAccountByEmail,
    getAllAccountsService,
    getAccountById,
    editAccountService,
    deleteAccountService,
    encryptPasswordService
} = require('./accountServices.js')
const { sendMail } = require('../utils/sendMail.js');
const APIError = require('../utils/customError.js');
const { VerificationModel } = require("../models/verificationModel.js");
const bycryptjs = require('bcryptjs')
const { v4: uuidv4 } = require('uuid');
const { createAssessToken, createRefreshToken } = require('../auth/authServices.js')




///////////////////Create an account
const createAccount = async (req, res) => {
    console.log(req.body, "hhhhhhhhhh")
    const { fullName, businessName, email, address, password, phoneNumber } = req.body
    if (!fullName || !businessName || !email || !password) {
        return res.json({
            status: "Failed",
            message: "Incomplete credentials, Please complete the inputs"
        })
    } else if (!/^[a-zA-Z ]*$/.test(fullName)) {
        res.json({
            status: "Failed",
            message: "Invalid name entered"
        })
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: "Failed",
            message: "Invalid email entered"
        })
    } else if (password.length < 5) {
        res.json({
            status: "Failed",
            message: "Password is too small"
        })
    }
    const accountExist = await accountExistService(email)
    if (accountExist) {
        return res.json({
            status: "Failed",
            message: "An account with this email already exist"
        })
    }

    if (email === "simeon_mc2000@yahoo.com") {
        const adminRole = { ...req.body, role: "admin" }
        const newUser = await createAccountService(adminRole)
        const assessToken = await createAssessToken(email)
        const { approval } = newUser
        const userDetail = {
            id: newUser._id,
            businessName,
            email,
            address,
            phoneNumber,
            fullName,
            approval
        }
        return res.json({
            status: "Success",
            message: `Account with the name ${newUser.fullName} has being created successfully`,
            assessToken,
            userDetail
        })
    }
    if (email !== "simeon_mc2000@yahoo.com") {
        const newUser = await createAccountService(req.body)
        const assessToken = await createAssessToken(email)
        const { approval } = newUser
        const userDetail = {
            id: newUser._id,
            businessName,
            email,
            address,
            phoneNumber,
            fullName,
            approval

        }

        //////////////Refresh Token
        // const refreshToken = await createRefreshToken(email)
        return res.json({
            status: "Success",
            message: `Account with the name ${newUser.fullName} has being created successfully`,
            assessToken,
            userDetail
        })
    } else (
        res.json({
            status: "Failed",
            message: "Account creation failed"
        })
    )
}

//////////////////get all Accounts
const getAllAcountController = async (req, res) => {
    try {
        const allAccount = await getAllAccountsService()
        res.json({
            status: "Success",
            message: "All account fetched successfully",
            allAccount,
        })
    } catch (error) {
        res.json({
            status: "Failed",
            message: "Internal server error"
        })
    }
}

////////////////////get An account by Email
const getAccountByEmailController = async (req, res) => {
    const { email } = req.params
    // console.log(req)
    if (email) {
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

const editAccount = async (req, res, next) => {
    const { id } = req.params
    // console.log(req.params, req.body)
    if (!id) {
        return next(APIError.badRequest("update id required"))
    }
    try {
        const findAccount = await getAccountById(id)
        // console.log(findAccount, "see am")
        if (!findAccount) {
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

const forgetPassword = async (req, res, next) => {
    const { email } = req.params
    const { password } = req.body
    if (!email) {
        return next(APIError.badRequest("Please a correct email required"))
    }
    try {
        const findAccount = await getAccountByEmail(email)
        if (!findAccount) {
            return next(APIError.notFound("Account with this email is not found"))
        }

        const currentUrl = "http://localhost:8080/";
        // const currentUrl = "https://newledger-f7b180e5a9de.herokuapp.com"
        const uniqueString = uuidv4() + findAccount._id
        const salt = bycryptjs.genSaltSync(10)
        const hashedUniquString = bycryptjs.hashSync(uniqueString, salt)

        const newPassword = await encryptPasswordService(password)
        let subject = "Verify your Email!";
        let text = `<p>An attempt is made to change your password. Are you the one? click this link</p>
                    <p>Press <a href=${currentUrl + "verification/" + newPassword + "/" + findAccount._id + "/" + uniqueString}>here</a></p>
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
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

const deleteAccount = async (req, res, next) => {
    const { id } = req.body
    if (!id) {
        return next(APIError.badRequest('Account Id is required'))
    }
    try {
        const findAccount = await getAccountById(id)
        if (!findAccount) {
            return next(APIError.badRequest("Account not found"))
        }
        const deletedAccount = await deleteAccountService(id, req.body)
        res.status(200).json({
            success: true,
            message: "Account deleted successfully"
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

module.exports = {
    createAccount,
    getAllAcountController,
    getAccountByEmailController,
    editAccount,
    forgetPassword,
    deleteAccount
}