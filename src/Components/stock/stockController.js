import {
    createStockService, 
    editStockService, 
    getStocksByIdService, 
    getStocksService, 
    deleteStockService
} from './stockServices.js'
import APIError from '../../utils/customError.js';

export const createStock = async(req, res, next) => {
    const {account, description, category, qty, rate, date} = req.body;
    if (!account || !description || !category || !qty || !rate || !date) {
        return next(APIError.badRequest('Please supply all the required fields!'))
    }
    const total = qty * rate
   try {
     req.body.total = total
     const newStock = await createStockService(req.body)
     res.status(201).json({
        success: true,
        message: 'Stock created successfully!',
        Stock: newStock
     })
   } catch (error) {
    next(APIError.customError(error.message))
   }
}

export const getStocks = async(req, res, next) => {
 try {
       const Stocks = await getStocksService()
       if (!Stocks) {
       return next(APIError.notFound('No Stock found!'))
       }
       res.status(200).json({
           success: true,
           message: 'Stocks retrieved successfully!',
           Stocks
        })
 } catch (error) {
    next(APIError.customError(error.message))
 }
}

export const getStockById = async(req, res, next) => {
    const {id} = req.body
    if (!id) {
        return next(APIError.badRequest('Stock ID is required'))
    }
    try {
        const findStock = await getStocksByIdService(id)
        if (!findStock) {
            return next(APIError.notFound('Stock not found!'))
        }
        res.status(200).json({
            success: true,
            message: 'Stock retrieved successfully!',
            Stock: findStock
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

export const editStock = async(req, res, next) => {
    const {id} = req.body
    if (!id) {
        return next(APIError.badRequest('Stock ID is required'))
    }
    try {
        const findStock = await getStocksByIdService(id)
        if (!findStock) {
            return next(APIError.notFound('Stock not found!'))
        }
        const updatedStock = await editStockService(id, req.body)
        res.status(200).json({
            success: true,
            message: 'Stock updated successfully!',
            Stock: updatedStock
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

export const deleteStock = async(req, res, next) => {
    const {id} = req.body
    if (!id) {
        return next(APIError.badRequest('Stock ID is required'))
    }
    try {
        const findStock = await getStocksByIdService(id)
        if (!findStock) {
            return next(APIError.notFound('Stock not found!'))
        }
        const deletedStock = await deleteStockService(id, req.body)
        res.status(200).json({
            success: true,
            message: 'Stock deleted successfully!',
            Stock: deleteStock
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}