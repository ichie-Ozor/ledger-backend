import express from 'express'
import { createCredit, deleteCredit, editCredit, getCreditByCreditorId, getCredits, getCreditById } from './creditController.js'

export const creditRouter = express.Router()

creditRouter.route('/').post(createCredit).get(getCredits)
// creditRouter.route('/:id').put(editCredit).delete(deleteCredit).get(getCreditById)
creditRouter.route('/:id').put(editCredit).delete(deleteCredit)
creditRouter.route('/:creditorId').get(getCreditByCreditorId)