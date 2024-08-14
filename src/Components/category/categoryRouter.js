const express = require('express');
const categoryController = require('./categoryController.js')


const { createCategory, deleteCategory, editCategory, getCategory, getCategoryById } = categoryController

const categoryRouter = express.Router()

categoryRouter.route('/').post(createCategory).get(getCategory)
categoryRouter.route('/:id').put(editCategory).delete(deleteCategory).get(getCategoryById)

module.exports = categoryRouter;