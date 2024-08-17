const express = require('express')
const stockController = require('./stockController.js')
const { createStock, deleteStock, editStock, getStocks, getStockById } = stockController

const stockRouter = express.Router()

stockRouter.route('/').post(createStock).get(getStocks)
stockRouter.route('/:id').put(editStock).delete(deleteStock).get(getStockById)

module.exports = stockRouter