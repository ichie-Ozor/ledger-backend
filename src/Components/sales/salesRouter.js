import express from 'express'
import { createSales, deleteSales, editSales, getSales } from './salesController'

const salesRouter = express.Router()

salesRouter.route('/').post(createSales).get(getSales)
salesRouter.route('/:id').put(editSales).delete(deleteSales)


export default salesRouter;