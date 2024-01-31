import express from 'express'
import { createDebt, deleteDebt, editDebt, getDebts } from './debtController'

const debtorRouter = express.Router()

debtorRouter.route('/').post(createDebt).get(getDebts)
            .route('/:id').put(editDebt).delete(deleteDebt)