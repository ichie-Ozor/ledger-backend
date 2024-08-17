const Sales = require("../../models/salesModel.js");

const createSalesService = async (data) => {
    const newSales = await Sales.create(data)
    return newSales
}

const getSalesService = async () => {
    const sales = await Sales.find()
    return sales
}

const getSalesByIdService = async (id) => {
    const sales = await Sales.findById(id)
    return sales
}

const editSalesService = async (id, data) => {
    const updatedSales = await Sales.findByIdAndUpdate(id, data)
    return updatedSales
}

const deleteSalesService = async (id) => {
    const deletedSales = await Sales.findByIdAndDelete(id)
    return deletedSales
}

module.exports = {
    createSalesService,
    getSalesService,
    getSalesByIdService,
    editSalesService,
    deleteSalesService
}