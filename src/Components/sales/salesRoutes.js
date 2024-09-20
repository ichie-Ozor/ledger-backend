const express = require('express')
const salesController = require('./salesController.js')
const { createSales, deleteSales, editSales, getSales, getSalesById } = salesController

const salesRouter = express.Router()

salesRouter.route('/').post(createSales).get(getSales)
salesRouter.route('/:id/:password').put(editSales).delete(deleteSales)
salesRouter.route('/:id').get(getSalesById)
module.exports = salesRouter