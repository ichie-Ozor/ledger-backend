import express from 'express'
import { createCategory, deleteCategory, editCategory, getCategory } from './categoryController.js'

export const categoryRouter = express.Router()

categoryRouter.route('/').post(createCategory).get(getCategory)
categoryRouter.route('/:id').put(editCategory).delete(deleteCategory)