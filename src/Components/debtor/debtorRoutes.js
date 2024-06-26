import express from 'express'
import { createDebtor, deleteDebtor, editDebtor, getDebtorById, getDebtors } from './debtorController.js'

export const debtorRouter = express.Router()

debtorRouter.route('/').post(createDebtor).get(getDebtors)
debtorRouter.route('/:id').get(getDebtorById)
debtorRouter.route('/:account/:password/:id').put(editDebtor).delete(deleteDebtor)

