import {
    createDebtService, 
    editDebtService, 
    getDebtsByIdService, 
    getDebtsByDebtorIdService,
    getDebtsService, 
    deleteDebtService
} from './debtServices.js'
import APIError from '../../utils/customError.js';

export const createDebt = async(req, res, next) => {
    const {account, description, category, qty, rate, date} = req.body;
    if (!account || !description || !category || !qty || !rate || !date) {
        return next(APIError.badRequest('Please supply all the required fields!'))
    }
    const total = qty * rate
   try {
     req.body.total = total
     const newDebt = await createDebtService(req.body)
     res.status(201).json({
        success: true,
        message: 'Debt created successfully!',
        Debt: newDebt
     })
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
        const findDebt = await getDebtsByIdService(id)
        if (!findDebt) {
            return next(APIError.notFound('Debt not found!'))
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

export const getDebtByDebtId = async(req, res, next) => {
    const {DebtId} = req.params
    if (!DebtId) {
        return next(APIError.badRequest('Debt ID is required'))
    }
    try {
        const findDebt = await getDebtsByDebtIdService(DebtId)
        if (!findDebt) {
            return next(APIError.notFound('Debt not found!'))
        }
        res.status(200).json({
            success: true,
            message: 'Debt retrieved successfully!',
            credits: findDebt
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}
export const getDebtByDebtorId = async(req, res, next) => {
    const {DebtorId} = req.params
    if (!DebtorId) {
        return next(APIError.badRequest('Debt ID is required'))
    }
    try {
        const findDebt = await getDebtsByDebtorIdService(DebtorId)
        if (!findDebt) {
            return next(APIError.notFound('Debt not found!'))
        }
        res.status(200).json({
            success: true,
            message: 'Debt retrieved successfully!',
            credits: findDebt
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

export const editDebt = async(req, res, next) => {
    const {id} = req.body
    if (!id) {
        return next(APIError.badRequest('Debt ID is required'))
    }
    try {
        const findDebt = await getDebtsByIdService(id)
        if (!findDebt) {
            return next(APIError.notFound('Debt not found!'))
        }
        const updatedDebt = await editDebtService(id, req.body)
        res.status(200).json({
            success: true,
            message: 'Debt updated successfully!',
            Debt: updatedDebt
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

export const deleteDebt = async(req, res, next) => {
    const {id} = req.body
    if (!id) {
        return next(APIError.badRequest('Debt ID is required'))
    }
    try {
        const findDebt = await getDebtsByIdService(id)
        if (!findDebt) {
            return next(APIError.notFound('Debt not found!'))
        }
        const deletedDebt = await deleteDebtService(id, req.body)
        res.status(200).json({
            success: true,
            message: 'Debt deleted successfully!',
            Debt: deleteDebt
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}