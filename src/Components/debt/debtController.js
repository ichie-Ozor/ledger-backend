import {
    createDebtService, 
    editDebtService, 
    getDebtsByIdService, 
    getDebtsService, 
    getDebtsByDebtorIdService,
    deleteDebtService
} from './debtServices.js'
import APIError from '../../utils/customError.js';
import { createStockService } from '../stock/stockServices.js';

export const createDebt = async(req, res, next) => {
    console.log(req.body, "debt")
    const incomingData = req.body
    try {
    for (let i = 0; i < incomingData.length; i++){
        console.log(incomingData[i], "each debt")
        const {businessId, debtorId, description, category, qty, rate, date} = incomingData[i];
    if (!businessId || !debtorId || !description || !category || !qty || !rate || !date) {
        return next(APIError.badRequest('Please supply all the required fields!'))
    }
    let price = 1.2 * rate
    const stock_entry = {
        account : businessId,
        goods: description,
        category,
        qty,
        cost: rate,
        sellingPrice: price 
    }
    console.log(stock_entry, "stock entry")
    createStockService(stock_entry)
     const newDebt= await createDebtService(incomingData[i])
     res.status(201).json({
        success: true,
        message: 'Debt created successfully!',
        Debt: newDebt
     })
    }
   } catch (error) {
    next(APIError.customError(error.message))
   }
}

export const getDebts = async(req, res, next) => {
 try {
       const Debts = await getDebtsService()
       if (!Debts) {
       return next(APIError.notFound('No Debt found!'))
       }
       res.status(200).json({
           success: true,
           message: 'Debts retrieved successfully!',
           Debts
        })
 } catch (error) {
    next(APIError.customError(error.message))
 }
}

export const getDebtById = async(req, res, next) => {
    const {id} = req.body
    if (!id) {
        return next(APIError.badRequest('Debt ID is required'))
    }
    try {
        const findDebt= await getDebtsByIdService(id)
        if (!findDebt) {
            return next(APIError.notFound('Debtnot found!'))
        }
        res.status(200).json({
            success: true,
            message: 'Debt retrieved successfully!',
            Debt: findDebt
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}


export const getDebtsByDebtorId = async(req, res, next) => {
    const {debtorId} = req.params
    console.log(debtorId, "na me be this")
    if (!debtorId) {
        return next(APIError.badRequest('Debt ID is required'))
    }
    try {
        const findDebt = await getDebtsByDebtorIdService(debtorId)
        console.log(findDebt)
        if (!findDebt) {
            return next(APIError.notFound('Debt not found!'))
        }
        res.status(200).json({
            success: true,
            message: 'Debt retrieved successfully!',
            debts: findDebt
         })
    } catch (error) {
        console.log(error)
        next(APIError.customError(error.message))
    }
}

export const editDebt = async(req, res, next) => {
    const {id} = req.body
    if (!id) {
        return next(APIError.badRequest('Debt ID is required'))
    }
    try {
        const findDebt= await getDebtsByIdService(id)
        if (!findDebt) {
            return next(APIError.notFound('Debt not found!'))
        }
        const updatedDebt= await editDebtService(id, req.body)
        res.status(200).json({
            success: true,
            message: 'Debt updated successfully!',
            Debt: updatedDebt
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

export const deleteDebt= async(req, res, next) => {
    const {id} = req.body
    if (!id) {
        return next(APIError.badRequest('Debt ID is required'))
    }
    try {
        const findDebt= await getDebtsByIdService(id)
        if (!findDebt) {
            return next(APIError.notFound('Debtnot found!'))
        }
        const deletedDebt= await deleteDebtService(id, req.body)
        res.status(200).json({
            success: true,
            message: 'Debt deleted successfully!',
            Debt: deleteDebt
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}