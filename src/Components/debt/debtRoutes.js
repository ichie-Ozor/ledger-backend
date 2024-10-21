const express = require('express');
const debtController = require('./debtController.js');

const {
    createDebt,
    deleteDebt,
    editDebt,
    getDebtByDate,
    getDebtsByDebtorId,
    getDebts
} = debtController

const debtRouter = express.Router()

debtRouter.route('/').post(createDebt).get(getDebts)
debtRouter.route('/filter/:id').post(getDebtByDate)
debtRouter.route('/:id/:password').put(editDebt).delete(deleteDebt)
debtRouter.route('/:debtorId').get(getDebtsByDebtorId)

module.exports = debtRouter