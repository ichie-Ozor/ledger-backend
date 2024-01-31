import express from 'express'
import { createSales, deleteSales, editSales, getSaless } from './salesController'

const salesRouter = express.Router()

salesRouter.route('/').post(createSales).get(getSaless)
            .route('/:id').put(editSales).delete(deleteSales)