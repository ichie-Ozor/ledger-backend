import express from 'express'
import { createAccount, signInAccount } from './authController.js';

const authRoute = express.Router();

authRoute.route("/signup").post(createAccount)
authRoute.route("/signin").post(signInAccount)


export default authRoute;
