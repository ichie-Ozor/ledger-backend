const express = require('express');
const creditController = require('./creditController.js')

const { createCredit, deleteCredit, getCreditByDate, editCredit, getCreditByCreditorId, getCredits, getCreditById } = creditController

const creditRouter = express.Router()

creditRouter.route('/').post(createCredit).get(getCredits)
creditRouter.route('/:id/:password').put(editCredit).delete(deleteCredit)
creditRouter.route('/filter/:id').post(getCreditByDate)
creditRouter.route('/:creditorId').get(getCreditByCreditorId)

module.exports = creditRouter;
