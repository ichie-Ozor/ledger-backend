import {
    createStockService, 
    editStocksService, 
    getStocksByIdService, 
    getStocksService, 
    deleteStockService
} from './stockServices.js'
import APIError from '../../utils/customError.js';
import { AccountModel } from '../../models/accountModel.js';
import { Types } from "mongoose";
import { sendMail } from '../../utils/sendMail.js';

export const createStock = async(req, res, next) => {
    const incomingData = req.body
    const {account} = req.body
    console.log(req.body)
    try {
    for (let i = 0; i < incomingData.length; i++){
    const {account, goods, category, qty, cost, date, sellingPrice} = incomingData[i];
    console.log(req.body, account, goods)
    if (!account || !goods || !category || !qty || !cost || !sellingPrice) {
        return next(APIError.badRequest('Please supply all the required fields!'))
    }
    const total = qty * cost
   
     req.body.total = total
    }
     const newStock = await createStockService(req.body)
     const businessOwner = await AccountModel.find({_id: new Types.ObjectId(account)})
     const {email} = businessOwner[0]
     console.log(businessOwner, email, req.body, "bussiness owner")
     sendMail("simeon_mc2000@yahoo.com", req.body, "This is the stock")
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
    const {id} = req.params
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
        const updatedStock = await editStocksService(id, req.body)
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
            Stock: deletedStock
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}