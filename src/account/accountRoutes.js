import express from 'express'
import { 
    createAccount, 
    getAllAcountController, 
    getAccountByEmailController,
    editAccount,
    forgetPassword,
    deleteAccount
} from './accountController.js';

export const accountRoute = express.Router();

accountRoute.route('/:id').put(editAccount).delete(deleteAccount)
accountRoute.route('/:email').post(forgetPassword)
accountRoute.route("/signup").post(createAccount)
accountRoute.route("/getaccount").get(getAllAcountController)
accountRoute.route("/getaccount/:email").get(getAccountByEmailController)



