import express from 'express'
import { createCredit, deleteCredit, editCredit, getCreditByCreditorId, getCredits } from './creditController.js'

export const creditorRouter = express.Router()

creditorRouter.route('/').post(createCredit).get(getCredits)
creditorRouter.route('/:id').put(editCredit).delete(deleteCredit)
