import {
    createDebtService, 
    editDebtService, 
    getDebtsByIdService, 
    getDebtsService, 
    getDebtsByDebtorIdService,
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
     const newDebtor = await createDebtService(req.body)
     res.status(201).json({
        success: true,
        message: 'Debtor created successfully!',
        Debtor: newDebtor
     })
   } catch (error) {
    next(APIError.customError(error.message))
   }
}

export const getDebts = async(req, res, next) => {
 try {
       const Debtors = await getDebtsService()
       if (!Debtors) {
       return next(APIError.notFound('No Debtor found!'))
       }
       res.status(200).json({
           success: true,
           message: 'Debtors retrieved successfully!',
           Debtors
        })
 } catch (error) {
    next(APIError.customError(error.message))
 }
}

export const getDebtorById = async(req, res, next) => {
    const {id} = req.body
    if (!id) {
        return next(APIError.badRequest('Debtor ID is required'))
    }
    try {
        const findDebtor = await getDebtsByIdService(id)
        if (!findDebtor) {
            return next(APIError.notFound('Debtor not found!'))
        }
        res.status(200).json({
            success: true,
            message: 'Debtor retrieved successfully!',
            Debtor: findDebtor
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

export const getDebtByDebtorId = async(req, res, next) => {
    const {debtorId} = req.params
    if (!debtorId) {
        return next(APIError.badRequest('Debt ID is required'))
    }
    try {
        const findDebt = await getDebtsByDebtorIdService(debtorId)
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
        return next(APIError.badRequest('Debtor ID is required'))
    }
    try {
        const findDebtor = await getDebtsByIdService(id)
        if (!findDebtor) {
            return next(APIError.notFound('Debtor not found!'))
        }
        const updatedDebtor = await editDebtService(id, req.body)
        res.status(200).json({
            success: true,
            message: 'Debtor updated successfully!',
            Debtor: updatedDebtor
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

export const deleteDebt = async(req, res, next) => {
    const {id} = req.body
    if (!id) {
        return next(APIError.badRequest('Debtor ID is required'))
    }
    try {
        const findDebtor = await getDebtsByIdService(id)
        if (!findDebtor) {
            return next(APIError.notFound('Debtor not found!'))
        }
        const deletedDebtor = await deleteDebtService(id, req.body)
        res.status(200).json({
            success: true,
            message: 'Debtor deleted successfully!',
            Debtor: deleteDebtor
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}