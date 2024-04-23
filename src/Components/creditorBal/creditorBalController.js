import {
    createCreditorBalService,
    getCreditorBalService,
    getCreditorBalByIdService,
    getCreditorBalByCreditorIdService,
    editCreditorBalService,
    deleteCreditorBalService
} from './creditorBalService.js';
import APIError from '../../utils/customError.js';

export const createCreditorBal = async(req, res, next) => {
    console.log(req.body, "na us be this")
    try{
        const {businessId, balance, creditorId, firstName, lastName, paid, phoneNumber, purchase} =  req.body
        if(!businessId || !balance || !creditorId || !firstName || !lastName || !phoneNumber || !paid || !purchase){
            return next(APIError.badRequest("Please supply all the payment details of the creditor"))
        }
        const newCreditorBal = await createCreditorBalService(req.body)
        res.status(200).json({
            success: true,
            message: "Creditor Balance created successfully",
            creditorBal: newCreditorBal
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

export const getCreditorBal = async(req, res, next) => {
    try{
        const creditorBal = await getCreditorBalService()
        if(!creditorBal){
            return next(APIError.notFound("This Creditor Balance was not found!"))
        }
        res.status(200).json({
            success: true,
            message: "Creditor Bal retrieved successfully",
            creditorBal
        })
    } catch(error) {
        next(APIError.customError(error.message))
    }
}

export const getCreditorBalById = async(req, res, next) => {
    const {id} = req.params
    if(!id){
        return next(APIError.badRequest("creditor Id required"))
    }
    try{
        const findCreditorBal = await getCreditorBalByIdService(id)
        if(!findCreditorBal){
            return next(APIError.notFound('This creditor Bal not found'))
        }
        res.status(200).json({
            success: true,
            message: "Creditor Bal retrieved successfully",
            creditorBal: findCreditorBal
        })
    } catch(error) {
        next(APIError.customError(error.message))
    }
}

export const getCreditorBalByCreditorId = async(req, res, next) => {
    const {creditorId} = req.params
    console.log(creditorId)
    if(!creditorId){
        return next(APIError.badRequest('Creditor Id required'))
    }
   try { 
     const findCreditorBal = await getCreditorBalByCreditorIdService(creditorId)
     if(!findCreditorBal){
        return next(APIError.notFound('Creditor not found'))
     }
        res.status(200).json({
        success: true,
        message: "creditor bal retrieved successfully",
        creditBal: findCreditorBal
    })
  } catch (error) {
    next(APIError.customError(error.message))
  }
}

export const editCreditorBal = async(req, res, next) => {
    const {id} = req.body
    if(!id){
        return next(APIError.badRequest('credit Id required'))
    }
    try {
        const findCreditorBal = await getCreditorBalByIdService(id)
        if(!findCreditorBal){
            return next(APIError.notFound('creditor Bal not found'))
        }
        const updatedCreditorBal = await editCreditorBalService(id, req.body)
        res.status(200).json({
            success: true,
            message: "Credit bal update successfully",
            creditorBal: updatedCreditorBal
        })
    } catch(error) {
        next(APIError.customError(error.message))
    }
}

export const deleteCreditorBal = async(req, res, next) => {
    const {id} = req.body
    if(!id){
        return next(APIError.badRequest('creditor id not found'))
    }
    try{
        const deletedCreditorBal = await deleteCreditorBalService(id, req.body)
        res.status(200).json({
            success: true,
            message: "creditor Bal deleted successfully",
            deletedCreditorBal
        })
    } catch(error) {
        next(APIError.customError(error.message))
    }
}