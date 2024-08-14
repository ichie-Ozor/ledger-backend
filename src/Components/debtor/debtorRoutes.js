const express = require('express')
const { createDebtor, deleteDebtor, editDebtor, getDebtorById, getDebtors } = require('./debtorController.js')

const debtorRouter = express.Router()

debtorRouter.route('/').post(createDebtor).get(getDebtors)
debtorRouter.route('/:id').get(getDebtorById).put(editDebtor)
debtorRouter.route('/:account/:password/:id').delete(deleteDebtor)

module.exports = debtorRouter