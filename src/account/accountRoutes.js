const express = require('express')
const accountController = require('./accountController.js')
const {
    createAccount,
    getAllAcountController,
    getAccountByEmailController,
    editAccount,
    forgetPassword,
    deleteAccount
} = accountController;

const accountRoute = express.Router();

accountRoute.route('/:id').put(editAccount).delete(deleteAccount)
accountRoute.route('/:email').post(forgetPassword)
accountRoute.route("/signup").post(createAccount)
accountRoute.route("/getaccount").get(getAllAcountController)
accountRoute.route("/getaccount/:email").get(getAccountByEmailController)


module.exports = accountRoute

