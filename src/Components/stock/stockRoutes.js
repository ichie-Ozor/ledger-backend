import express from 'express'
import { createStock, deleteStock, editStock, getStocks } from './salesController'

const salesRouter = express.Router()

salesRouter.route('/').post(createStock).get(getStocks)
            .route('/:id').put(editStock).delete(deleteStock)