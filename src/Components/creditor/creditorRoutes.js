import express from 'express'
import { createCredit, deleteCredit, editCredit, getCredits } from './creditController'

const creditorRouter = express.Router()

creditorRouter.route('/').post(createCredit).get(getCredits)
            .route('/:id').put(editCredit).delete(deleteCredit)
