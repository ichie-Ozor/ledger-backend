const { Category } = require("../../models/categoryModel.js");
const { Types } = require("mongoose");

const createCategoryService = async (data) => {
    const newCategory = await Category.create(data)
    return newCategory
}

const getCategoryService = async () => {
    const category = await Category.find()
    return category
}

const getCategoryByIdService = async (id) => {
    // const category = await Category.findById(id)
    const category = await Category.find({ account: new Types.ObjectId(id) })
    // console.log(category, id)
    return category
}

const editCategoryService = async (id, data) => {
    const updatedCategory = await Category.findByIdAndUpdate(id, data)
    return updatedCategory
}

const deleteCategoryService = async (id) => {
    const deletedCategory = await Category.findByIdAndDelete(id)
    return deletedCategory
}

module.exports = {
    createCategoryService,
    getCategoryService,
    getCategoryByIdService,
    editCategoryService,
    deleteCategoryService
}