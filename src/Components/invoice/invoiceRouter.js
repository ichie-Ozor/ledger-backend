const express = require('express');
const invoiceController = require('./invoiceController.js');

const {
    createInvoice
} = invoiceController

const invoiceRouter = express.Router()

invoiceRouter.route('/').post(createInvoice)

module.exports = invoiceRouter;