import { Category } from "../../models/categoryModel.js";
import {Types} from "mongoose";

export const createCategoryService = async(data) => {
    const newCategory = await Category.create(data)
    return newCategory
}

export const getCategoryService = async() => {
    const category = await Category.find()
    return category
}

export const getCategoryByIdService = async(id) => {
    // const category = await Category.findById(id)
    const category = await Category.find({account: new Types.ObjectId(id)})
    // console.log(category, id)
    return category
}

export const editCategoryService = async(id, data) => {
    const updatedCategory = await Category.findByIdAndUpdate(id, data)
    return updatedCategory
}

export const deleteCategoryService = async(id) => {
    const deletedCategory = await Category.findByIdAndDelete(id)
    return deletedCategory
}