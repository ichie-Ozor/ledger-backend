import express from 'express'
import { 
    createAccount, 
    getAllAcountController, 
    getAccountByEmailController 
} from './accountController.js';

export const accountRoute = express.Router();

accountRoute.route("/signup").post(createAccount)
accountRoute.route("/getaccount").get(getAllAcountController)
accountRoute.route("/getaccount/:email").get(getAccountByEmailController)
