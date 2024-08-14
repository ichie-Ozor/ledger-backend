const express = require('express')
const { createCreditor, deleteCreditor, editCreditor, getCreditors, getCreditorById } = require('./creditorController.js')

const creditorRouter = express.Router()

creditorRouter.route('/').post(createCreditor).get(getCreditors)
creditorRouter.route('/:id').get(getCreditorById).put(editCreditor)
creditorRouter.route('/:account/:password/:id').delete(deleteCreditor)

module.exports = creditorRouter;