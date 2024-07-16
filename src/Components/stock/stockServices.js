import { Types } from "mongoose";
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
    const stock = await Stock.find({account: new Types.ObjectId(id)})
    return stock
}

export const findStockService = async (description, category, account) => {
    return await Stock.find({goods: description, category, account })
}


export const editStocksService = async(id, data) => {
    try{
        const updatedStock = await Stock.findByIdAndUpdate(
            {_id: id},
            {$set: data},
            {new: true}
        );
        console.log(updatedStock, "edit stock")
        return updatedStock
    } catch (error) {
        console.error('Error updating stock', error)
        throw error
    }
}

export const editStocksQtyService = async(id, value) => {
    try{
       const ID = {_id: id};
       const update = {$set: {qty: value}}
       const updatedQty = await Stock.findByIdAndUpdate(ID, update, {new: true})
       return updatedQty;
    } catch (error){
        console.error('Error updating field in stock', error)
        throw error
    }
}

export const deleteStockService = async(id) => {
    const deletedStock = await Stock.findByIdAndDelete(id)
    return deletedStock
}