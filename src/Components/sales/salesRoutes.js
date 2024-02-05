import express from 'express'
import { createSales, deleteSales, editSales, getSales } from './salesController.js'

export const salesRouter = express.Router()

salesRouter.route('/').post(createSales).get(getSales)
salesRouter.route('/:id').put(editSales).delete(deleteSales)