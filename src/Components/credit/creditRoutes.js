import express from 'express'
import { createCredit, deleteCredit, editCredit, getCredits } from './creditController'

const creditRouter = express.Router()

creditRouter.route('/').post(createCredit).get(getCredits)
creditRouter.route('/:id').put(editCredit).delete(deleteCredit)

export default creditRouter