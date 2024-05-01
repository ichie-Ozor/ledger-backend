import express from 'express'
import { createStock, deleteStock, editStock, getStocks, getStockById } from './stockController.js'

export const stockRouter = express.Router()

stockRouter.route('/').post(createStock).get(getStocks)
stockRouter.route('/:id').put(editStock).delete(deleteStock).get(getStockById)