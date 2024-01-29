import express from 'express'
import { createCreditor, deleteCreditor, editCreditor, getCreditors } from './creditorController.js'

const creditorRouter = express.Router()

creditorRouter.route('/').post(createCreditor).get(getCreditors)
creditorRouter.route('/:id').put(editCreditor).delete(deleteCreditor)


export default creditorRouter;