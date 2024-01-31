import {
    createDebtorService, 
    editDebtorService, 
    getDebtorsByIdService, 
    getDebtorsService, 
    deleteDebtorService
} from './debtServices.js'
import APIError from '../../utils/customError.js';

export const createDebtor = async(req, res, next) => {
    const {account, description, category, qty, rate, date} = req.body;
    if (!account || !description || !category || !qty || !rate || !date) {
        return next(APIError.badRequest('Please supply all the required fields!'))
    }
    const total = qty * rate
   try {
     req.body.total = total
     const newDebtor = await createDebtorService(req.body)
     res.status(201).json({
        success: true,
        message: 'Debtor created successfully!',
        Debtor: newDebtor
     })
   } catch (error) {
    next(APIError.customError(error.message))
   }
}

export const getDebtors = async(req, res, next) => {
 try {
       const Debtors = await getDebtorsService()
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
        const findDebtor = await getDebtorsByIdService(id)
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

export const editDebtor = async(req, res, next) => {
    const {id} = req.body
    if (!id) {
        return next(APIError.badRequest('Debtor ID is required'))
    }
    try {
        const findDebtor = await getDebtorsByIdService(id)
        if (!findDebtor) {
            return next(APIError.notFound('Debtor not found!'))
        }
        const updatedDebtor = await editDebtorService(id, req.body)
        res.status(200).json({
            success: true,
            message: 'Debtor updated successfully!',
            Debtor: updatedDebtor
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

export const deleteDebtor = async(req, res, next) => {
    const {id} = req.body
    if (!id) {
        return next(APIError.badRequest('Debtor ID is required'))
    }
    try {
        const findDebtor = await getDebtorsByIdService(id)
        if (!findDebtor) {
            return next(APIError.notFound('Debtor not found!'))
        }
        const deletedDebtor = await deleteDebtorService(id, req.body)
        res.status(200).json({
            success: true,
            message: 'Debtor deleted successfully!',
            Debtor: deleteDebtor
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}