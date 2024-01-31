import express from 'express'
import { createDebtor, deleteDebtor, editDebtor, getDebtors } from './creditController'

const creditorRouter = express.Router()

creditorRouter.route('/').post(createDebtor).get(getDebtors)
            .route('/:id').put(editDebtor).delete(deleteDebtor)
