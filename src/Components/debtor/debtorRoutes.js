import express from 'express'
import { createDebtor, deleteDebtor, editDebtor, getDebtors } from './debtorController.js'

const debtorRouter = express.Router()

debtorRouter.route('/').post(createDebtor).get(getDebtors)
debtorRouter.route('/:id').put(editDebtor).delete(deleteDebtor)


export default debtorRouter;