const express = require('express');
const authController = require('./authController.js')
const {
    signInAccount,
    verifyRefreshToken,
    verifyToken
} = authController



const authRoute = express.Router();

authRoute.route("/signin").post(signInAccount)
authRoute.route("/verifyToken").get(verifyToken)
authRoute.route("/verifyRefreshToken").post(verifyRefreshToken)

module.exports = authRoute;