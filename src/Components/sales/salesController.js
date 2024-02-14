import {
    createSalesService, 
    editSalesService, 
    getSalesByIdService, 
    getSalesService, 
    deleteSalesService
} from './salesService.js'
import APIError from '../../utils/customError.js';

export const createSales = async(req, res, next) => {
    console.log(req.body, "here")
    const {account, description, category, qty, rate, date} = req.body;
    if (!account || !description || !category || !qty || !rate || !date) {
        return next(APIError.badRequest('Please supply all the required fields!'))
    }
    const total = qty * rate
   try {
     req.body.total = total
     const newSales = await createSalesService(req.body)
     res.status(201).json({
        success: true,
        message: 'Sales created successfully!',
        creditor: newSales
     })
   } catch (error) {
    next(APIError.customError(error.message))
   }
}

export const getSales = async(req, res, next) => {
 try {
       const creditors = await getSalesService()
       if (!creditors) {
       return next(APIError.notFound('No creditor found!'))
       }
       res.status(200).json({
           success: true,
           message: 'Saless retrieved successfully!',
           creditors
        })
 } catch (error) {
    next(APIError.customError(error.message))
 }
}

export const getSalesById = async(req, res, next) => {
    const {id} = req.body
    if (!id) {
        return next(APIError.badRequest('Sales ID is required'))
    }
    try {
        const findSales = await getSalesByIdService(id)
        if (!findSales) {
            return next(APIError.notFound('Sales not found!'))
        }
        res.status(200).json({
            success: true,
            message: 'Sales retrieved successfully!',
            creditor: findSales
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

export const editSales = async(req, res, next) => {
    const {id} = req.body
    if (!id) {
        return next(APIError.badRequest('Sales ID are is required'))
    }
    try {
        const findSales = await getSalesByIdService(id)
        if (!findSales) {
            return next(APIError.notFound('Sales not found!'))
        }
        const updatedSales = await editSalesService(id, req.body)
        res.status(200).json({
            success: true,
            message: 'Sales updated successfully!',
            creditor: updatedSales
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

export const deleteSales = async(req, res, next) => {
    const {id} = req.body
    if (!id) {
        return next(APIError.badRequest('Sales ID is required'))
    }
    try {
        const findSales = await getSalesByIdService(id)
        if (!findSales) {
            return next(APIError.notFound('Sales not found!'))
        }
        await deleteSalesService(id, req.body)
        res.status(200).json({
            success: true,
            message: 'Sales deleted successfully!',
            creditor: deleteSales
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}