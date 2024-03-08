import express from 'express'
import { signInAccount } from './authController.js'



const authRoute = express.Router();

authRoute.route("/signin").post(signInAccount)

export default authRoute;