import express from 'express'
import { createCreditor, deleteCreditor, editCreditor, getCreditors, getCreditorById } from './creditorController.js'

const creditorRouter = express.Router()

creditorRouter.route('/').post(createCreditor).get(getCreditors)
creditorRouter.route('/:id').get(getCreditorById).put(editCreditor).delete(deleteCreditor)

export default creditorRouter