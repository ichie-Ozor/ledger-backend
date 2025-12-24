const bcrypt = require("bcryptjs");
const JWT = require('jsonwebtoken');
const accountService = require('../account/accountServices.js');
const authService = require('./authServices.js');
const accountModel = require('../models/accountModel.js');

const { createAssessToken, createRefreshToken, verifyTokenService } = authService
const { getAccountByEmail, editAccountService } = accountService
const { AccountModel } = accountModel
///////////////////SignIn

const signInAccount = async (req, res) => {
    const { email, password } = req.body
    // if (email == "" || password == "") {
    //     return res.json({
    //         status: "Failed",
    //         message: "Please enter your login credentials."
    //     })
    // }

    const checkEmail = await getAccountByEmail(email)
    // console.log(checkEmail, "sing in detail")
    const { fullName, businessName, role, _id, verification, phoneNumber, approval } = checkEmail
    const userDetail = { fullName, businessName, role, _id, verification, email, phoneNumber, approval }
    const timer = Date.now() - approval

    if (!checkEmail) {
        return res.json({
            status: "Failed",
            code: 401,
            message: "This account does not exist, please register"
        })
    }
    if (role === "admin") {
        const assessToken = await createAssessToken(email)
        return res.json({
            status: "Success",
            message: "You have successfully signed in",
            userDetail,
            assessToken,
        })
    }
    const comparePassword = await bcrypt.compare(password, checkEmail.password)
    if (!comparePassword || email !== checkEmail.email) {
        return res.json({
            status: "Failed",
            code: 402,
            message: "You have entered an invalid email and password"
        })
    }
    //this throws error if the person have not made payment and as such is not verified i.e new account
    if (!verification || timer > 2592000000) {
        return res.json({
            status: "Failed",
            code: 900,
            message: "You need to make payment so as to verify your account"
        })
    }
    //this is if the person is an existing account but the subscription has expired i.e more than a month
    // this is for them to renew their subscription
    if (verification && timer > 2592000000) {
        const updateVerification = { ...checkEmail }
        updateVerification.verification = false
        await editAccountService(_id, updateVerification)
        return res.json({
            status: "Failed",
            code: 901,
            message: "You need to make payment to renew your subscription"
        })
    } else {
        const assessToken = await createAssessToken(email)
        res.json({
            status: "Success",
            message: "You have successfully signed in",
            userDetail,
            assessToken,
        })
    }
}

const verifyRefreshToken = (req, res) => {
    const { assessToken, refreshToken } = req.body

    const checkToken = verifyTokenService(assessToken)
    // const checkRefreshToken = verifyTokenService(refreshToken)
    const authToken = req.headers["authorization"];
    // console.log(authToken, "verifyRefreshToken")
    const token = authToken.split(" ")[1]
    const { email } = token
    // check if the token is expired, then check if the refresh token is still alive. if bothe are expired, return error
    checkToken ?
        createAssessToken(email) :
        res.status(403).json({
            success: false,
            message: "refreshToken is expired"
        })
    // if the refreshtoken is alive, create a new assesstoken
    // if the refreshtoken is dead, then send an error message so the client can log in again
}

// async function verify(req, res){
const verifyToken = async (req, res) => {
    // console.log(req.headers, req.headers["authorization"], "req.header here")
    try {
        // this verify the token from the frontend
        const authToken = req.headers["authorization"];
        const token = authToken?.split(" ")[1];
        if (!token && token.length < 10) {
            return res.status(403).json({
                message: "This token is invalid"
            })
        }
        const verifiedToken = await verifyTokenService(token)
        if (!verifiedToken) {
            return res.status(403).json({
                message: "token verification failed",
            })
        } else {
            const { accountEmail } = verifiedToken
            const userDetail = await AccountModel.find({ email: accountEmail })
            const assessToken = await createAssessToken(accountEmail)
            // const refreshToken = await createRefreshToken(accountEmail)
            return res.status(200).json({
                login: true,
                userDetail,
                assessToken,
                //   refreshToken
            })
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "There is something wrong with the token",
            err
        })
    }
}

module.exports = {
    signInAccount,
    verifyRefreshToken,
    verifyToken
}