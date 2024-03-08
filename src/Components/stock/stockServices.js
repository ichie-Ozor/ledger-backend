import { Stock } from "../../models/stockModel.js";

export const createStockService = async(data) => {
    const newStock = await Stock.create(data)
    return newStock
}

export const getStocksService = async() => {
    const stock = await Stock.find()
    return stock
}

export const getStocksByIdService = async(id) => {
    const stock = await Stock.findById(id)
    return stock
}

export const editStocksService = async(id, data) => {
    const updatedStock = await Stock.findByIdAndUpdate(id, data)
    return updatedStock
}

export const deleteStockService = async(id) => {
    const deletedStock = await Stock.findByIdAndDelete(id)
    return deletedStock
}