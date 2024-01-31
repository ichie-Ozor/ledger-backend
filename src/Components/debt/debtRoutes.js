import express from 'express'
import { createDebt, deleteDebt, editDebt, getDebts } from './creditController'

const creditorRouter = express.Router()

creditorRouter.route('/').post(createDebt).get(getDebts)
            .route('/:id').put(editDebt).delete(deleteDebt)