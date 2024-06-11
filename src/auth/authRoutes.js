import express from 'express'
import { signInAccount, verifyRefreshToken, verifyToken } from './authController.js'



const authRoute = express.Router();

authRoute.route("/signin").post(signInAccount)
authRoute.route("/verifyToken").post(verifyToken)
authRoute.route("/verifyRefreshToken").post(verifyRefreshToken)

export default authRoute;