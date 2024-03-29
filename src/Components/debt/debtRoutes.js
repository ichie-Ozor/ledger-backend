import express from 'express'
import { createDebt, deleteDebt, editDebt, getDebtsByDebtorId, getDebts } from './debtController.js'

export const debtRouter = express.Router()

debtRouter.route('/').post(createDebt).get(getDebts)
debtRouter.route('/:id').put(editDebt).delete(deleteDebt)
debtRouter.route('/debtorId').get(getDebtsByDebtorId)