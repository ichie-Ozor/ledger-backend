const express = require('express');
const debtorBalController = require('./debtorBalController.js')


const {
    createDebtorBal,
    getDebtorBal,
    getDebtorBalById,
    getDebtorBalByDebtorId,
    editDebtorBal,
    deleteDebtorBal
} = debtorBalController

const debtorBalRouter = express.Router()

debtorBalRouter.route('/').post(createDebtorBal).get(getDebtorBal)
debtorBalRouter.route('/:id').put(editDebtorBal).delete(deleteDebtorBal)
debtorBalRouter.route('/debtorTotal/:debtorId').get(getDebtorBalById)
debtorBalRouter.route('/:debtorId').get(getDebtorBalByDebtorId)

module.exports = debtorBalRouter;