import {
    createCreditorService, 
    editCreditorService, 
    getCreditorsByIdService, 
    getCreditorsService, 
    deleteCreditorService
} from './creditorServices.js'
import APIError from '../../utils/customError.js';

export const createCreditor = async(req, res, next) => {
    const {firstName, lastName, phoneNumber, businessName, email, createdBy} = req.body;
    console.log(req.body)
    if (!firstName || !lastName || !phoneNumber || !businessName || !email || !createdBy) {
        return next(APIError.badRequest('Please supply all the required fields!'))
    }
   try {
     const newCreditor = await createCreditorService(req.body)
     res.status(201).json({
        success: true,
        message: 'Creditor created successfully!',
        creditor: newCreditor
     })
   } catch (error) {
    next(APIError.customError(error.message))
   }
}

export const getCreditors = async(req, res, next) => {
 try {
       const creditors = await getCreditorsService()
       if (!creditors) {
       return next(APIError.notFound('No creditor found!'))
       }
       res.status(200).json({
           success: true,
           message: 'Creditors retrieved successfully!',
           creditors
        })
 } catch (error) {
    next(APIError.customError(error.message))
 }
}

export const getCreditorById = async(req, res, next) => {
    const {id} = req.params
    if (!id) {
        return next(APIError.badRequest('Creditor ID is required'))
    }
    try {
        const findCreditor = await getCreditorsByIdService(id)
        if (!findCreditor) {
            return next(APIError.notFound('Creditor not found!'))
        }
        res.status(200).json({
            success: true,
            message: 'Creditor retrieved successfully!',
            creditor: findCreditor
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

export const editCreditor = async(req, res, next) => {
    const {id} = req.params
    if (!id) {
        return next(APIError.badRequest('Creditor ID is required'))
    }
    try {
        const findCreditor = await getCreditorsByIdService(id)
        if (!findCreditor) {
            return next(APIError.notFound('Creditor not found!'))
        }
        const updatedCreditor = await editCreditorService(id, req.body)
        res.status(200).json({
            success: true,
            message: 'Creditor updated successfully!',
            creditor: updatedCreditor
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

export const deleteCreditor = async(req, res, next) => {
    const {id} = req.params
    if (!id) {
        return next(APIError.badRequest('Creditor ID is required'))
    }
    try {
        const findCreditor = await getCreditorsByIdService(id)
        if (!findCreditor) {
            return next(APIError.notFound('Creditor not found!'))
        }
        const deletedCreditor = await deleteCreditorService(id, req.body)
        res.status(200).json({
            success: true,
            message: 'Creditor deleted successfully!',
            creditor: deletedCreditor
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}