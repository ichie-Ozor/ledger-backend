const categoryService = require('./categoryService.js')
const APIError = require('../../utils/customError.js');

const {
    createCategoryService,
    editCategoryService,
    getCategoryByIdService,
    getCategoryService,
    deleteCategoryService
} = categoryService

const createCategory = async (req, res, next) => {
    const categoryItem = req.body;
    if (!categoryItem) {
        return next(APIError.badRequest('Please supply all the required fields!'))
    }
    try {
        const newCategory = await createCategoryService(req.body)
        res.status(201).json({
            success: true,
            message: 'Category created successfully!',
            category: newCategory
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

const getCategory = async (req, res, next) => {
    try {
        const categories = await getCategoryService()
        if (!categories) {
            return next(APIError.notFound('No category found!'))
        }
        res.status(200).json({
            success: true,
            message: 'Categorys retrieved successfully!',
            categories
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

const getCategoryById = async (req, res, next) => {
    const id = req.params.id
    if (!id) {
        return next(APIError.badRequest('Category ID is required'))
    }
    try {
        const findCategory = await getCategoryByIdService(id)
        if (!findCategory) {
            return next(APIError.notFound('Category not found!'))
        }
        res.status(200).json({
            success: true,
            message: 'Category retrieved successfully!',
            category: findCategory
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

const editCategory = async (req, res, next) => {
    const { id } = req.body
    if (!id) {
        return next(APIError.badRequest('Category ID are is required'))
    }
    try {
        const findCategory = await getCategoryByIdService(id)
        if (!findCategory) {
            return next(APIError.notFound('Category not found!'))
        }
        const updatedCategory = await editCategoryService(id, req.body)
        res.status(200).json({
            success: true,
            message: 'Category updated successfully!',
            category: updatedCategory
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

const deleteCategory = async (req, res, next) => {
    const { id } = req.params
    if (!id) {
        return next(APIError.badRequest('Category ID is required'))
    }
    try {
        const findCategory = await getCategoryByIdService(id)
        if (!findCategory) {
            return next(APIError.notFound('Category not found!'))
        }
        const deletedCategory = await deleteCategoryService(id, req.body)
        res.status(200).json({
            success: true,
            message: 'Category deleted successfully!',
            category: deleteCategory
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

module.exports = {
    createCategory,
    getCategory,
    getCategoryById,
    editCategory,
    deleteCategory
}