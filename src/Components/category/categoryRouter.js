import express from 'express'
import { createCategory, deleteCategory, editCategory, getcategory } from './categoryController'

const salesRouter = express.Router()

salesRouter.route('/').post(createCategory).get(getcategory)
            .route('/:id').put(editCategory).delete(deleteCategory)