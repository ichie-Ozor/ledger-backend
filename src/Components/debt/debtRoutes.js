import express from 'express'
import { createDebtor, deleteDebtor, editDebtor, getDebtors } from './debtController'

const debtorRouter = express.Router()

debtorRouter.route('/').post(createDebtor).get(getDebtors)
            .route('/:id').put(editDebtor).delete(deleteDebtor)