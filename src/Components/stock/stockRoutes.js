const express = require('express')
const stockController = require('./stockController.js')
const { createStock, deleteStock, editStock, getStocks, getStockById } = stockController

const stockRouter = express.Router()

stockRouter.route('/').post(createStock).get(getStocks)
stockRouter.route('/:id/:password').put(editStock).delete(deleteStock)
stockRouter.route('/:id').get(getStockById)

module.exports = stockRouter