import express from 'express'
import {
    createCreditorBal,
    getCreditorBal,
    getCreditorBalById,
    getCreditorBalByCreditorId,
    editCreditorBal,
    deleteCreditorBal
} from './creditorBalController.js';

export const creditorBalRouter = express.Router()

creditorBalRouter.route('/').post(createCreditorBal).get(getCreditorBal)
creditorBalRouter.route('/:id').put(editCreditorBal).delete(deleteCreditorBal).get(getCreditorBalById)
creditorBalRouter.route('/:creditorId').get(getCreditorBalByCreditorId)
