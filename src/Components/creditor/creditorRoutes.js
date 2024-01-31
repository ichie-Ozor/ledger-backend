import express from 'express'
import { createCreditor, deleteCreditor, editCreditor, getCreditors } from './creditController'

const creditorRouter = express.Router()

creditorRouter.route('/').post(createCreditor).get(getCreditors)
            .route('/:id').put(editCreditor).delete(deleteCreditor)
