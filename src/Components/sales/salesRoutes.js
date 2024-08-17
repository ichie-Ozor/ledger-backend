const express = require('express')
const salesController = require('./salesController.js')
const { createSales, deleteSales, editSales, getSales } = salesController

const salesRouter = express.Router()

salesRouter.route('/').post(createSales).get(getSales)
salesRouter.route('/:id').put(editSales).delete(deleteSales)

module.exports = salesRouter