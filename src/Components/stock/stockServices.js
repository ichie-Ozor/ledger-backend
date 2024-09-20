const { Types } = require("mongoose");
const Stock = require("../../models/stockModel.js");

const createStockService = async (data) => {
    const newStock = await Stock.create(data)
    return newStock
}

const getStocksService = async () => {
    const stock = await Stock.find()
    return stock
}

const getStocksByIdService = async (id) => {
    const stock = await Stock.find({ account: new Types.ObjectId(id) })
    console.log(id, stock, "lolololo")
    return stock
}

const findStockService = async (description, category, account) => {
    return await Stock.find({ goods: description, category, account })
}

const editStocksService = async (id, data) => {
    try {
        const updatedStock = await Stock.findByIdAndUpdate(
            { _id: id },
            { $set: data },
            { new: true }
        );
        return updatedStock
    } catch (error) {
        console.error('Error updating stock', error)
        throw error
    }
}

const editStocksQtyService = async (id, value) => {
    try {
        const ID = { _id: id };
        const update = { $set: { qty: value } }
        const updatedQty = await Stock.findByIdAndUpdate(ID, update, { new: true })
        return updatedQty;
    } catch (error) {
        console.error('Error updating field in stock', error)
        throw error
    }
}

const deleteStockService = async (id) => {
    const deletedStock = await Stock.findByIdAndDelete(id)
    return deletedStock
}

module.exports = {
    createStockService,
    getStocksService,
    getStocksByIdService,
    findStockService,
    editStocksService,
    editStocksQtyService,
    deleteStockService
}