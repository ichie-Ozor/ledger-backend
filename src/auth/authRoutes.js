import express from 'express'
import { 
    createAccount, 
    signInAccount, 
    getAllAcountController, 
    getAccountByEmailController 
} from './authController.js';

const authRoute = express.Router();

authRoute.route("/signup").post(createAccount)
authRoute.route("/signin").post(signInAccount)
authRoute.route("/getaccount").get(getAllAcountController)
authRoute.route("/getaccount/:email").get(getAccountByEmailController)


export default authRoute;
