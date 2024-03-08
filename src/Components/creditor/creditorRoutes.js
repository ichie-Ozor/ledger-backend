import express from 'express'
import { createCreditor, deleteCreditor, editCreditor, getCreditors, getCreditorById } from './creditorController.js'

export const creditorRouter = express.Router()

creditorRouter.route('/').post(createCreditor).get(getCreditors)
creditorRouter.route('/:id').put(editCreditor).delete(deleteCreditor).get(getCreditorById)

