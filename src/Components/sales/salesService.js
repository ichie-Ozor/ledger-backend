import { Sales } from "../../models/salesModel.js";

export const createSalesService = async(data) => {
    const newSales = await Sales.create(data)
    return newSales
}

export const getSalesService = async() => {
    const sales = await Sales.find()
    return sales
}

export const getSalesByIdService = async(id) => {
    const sales = await Sales.findById(id)
    return sales
}

export const editSalesService = async(id, data) => {
    const updatedSales = await Sales.findByIdAndUpdate(id, data)
    return updatedSales
}

export const deleteSalesService = async(id) => {
    const deletedSales = await Sales.findByIdAndDelete(id)
    return deletedSales
}