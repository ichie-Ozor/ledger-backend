import express from 'express'
import { createDebtor, deleteDebtor, editDebtor, getDebtorById, getDebtors } from './debtorController.js'

export const debtorRouter = express.Router()

debtorRouter.route('/').post(createDebtor).get(getDebtors)
debtorRouter.route('/:id').put(editDebtor).delete(deleteDebtor).get(getDebtorById)
