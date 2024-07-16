import express from 'express'
import {
    createDebtorBal,
    getDebtorBal,
    getDebtorBalById,
    getDebtorBalByDebtorId,
    editDebtorBal,
    deleteDebtorBal
} from './debtorBalController.js'

export const debtorBalRouter = express.Router()

debtorBalRouter.route('/').post(createDebtorBal).get(getDebtorBal)
debtorBalRouter.route('/:id').put(editDebtorBal).delete(deleteDebtorBal)
debtorBalRouter.route('/debtorTotal/:debtorId').get(getDebtorBalById)
debtorBalRouter.route('/:debtorId').get(getDebtorBalByDebtorId)