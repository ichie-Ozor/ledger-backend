const express = require('express');
const creditorBalController = require('./creditorBalController.js');


const {
    createCreditorBal,
    getCreditorBal,
    getCreditorBalById,
    getCreditorBalByCreditorId,
    editCreditorBal,
    deleteCreditorBal
} = creditorBalController;

const creditorBalRouter = express.Router()

creditorBalRouter.route('/').post(createCreditorBal).get(getCreditorBal)
creditorBalRouter.route('/:id').put(editCreditorBal).delete(deleteCreditorBal)
creditorBalRouter.route('/:creditorId').get(getCreditorBalByCreditorId)
creditorBalRouter.route('/creditorTotal/:creditorId').get(getCreditorBalById)

module.exports = creditorBalRouter