import express from 'express'
import { createAccount } from './authController.js';

const authRoute = express.Router();

authRoute.route("/signin").post(createAccount)


export default authRoute;
