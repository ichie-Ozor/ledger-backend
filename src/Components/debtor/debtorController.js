import {
    createDebtorService, 
    editDebtorService, 
    getDebtorsByIdService, 
    getDebtorsService, 
    deleteDebtorService,
    emailExistService
} from './debtorServices.js'
import APIError from '../../utils/customError.js';

export const createDebtor = async(req, res, next) => {
    console.log(req.body)
    const {firstName, lastName, phoneNumber, businessName, createdBy} = req.body;
    if (!firstName || !lastName || !phoneNumber || !businessName || !createdBy) {
        return next(APIError.badRequest('Please supply all the required fields!'))
    }
   try {
    // const emailExist = await emailExistService(email)
    // if (emailExist) {
    //     return next(APIError.badRequest('Email already exists!'))
    // }
     const newDebtor = await createDebtorService(req.body)
     res.status(201).json({
        success: true,
        message: 'Debtor created successfully!',
        debtor: newDebtor
     })
   } catch (error) {
    next(APIError.customError(error.message))
   }
}

export const getDebtors = async(req, res, next) => {
 try {
       const debtors = await getDebtorsService()
       if (!debtors) {
       return next(APIError.notFound('No debtor found!'))
       }
       res.status(200).json({
           success: true,
           message: 'Debtors retrieved successfully!',
           debtors
        })
 } catch (error) {
    next(APIError.customError(error.message))
 }
}

export const getDebtorById = async(req, res, next) => {
    const {id} = req.params
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
            debtor: findDebtor
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

export const editDebtor = async(req, res, next) => {
    const {id} = req.params
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
            debtor: updatedDebtor
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

export const deleteDebtor = async(req, res, next) => {
    const {id} = req.params
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
            debtor: deletedDebtor
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}