import {
    createCreditService, 
    editCreditService, 
    getCreditsByIdService, 
    getCreditsService, 
    deleteCreditService,
    getCreditsByCreditorIdService
} from './creditServices.js'
import APIError from '../../utils/customError.js';

export const createCredit = async(req, res, next) => {
    console.log(req.body)
    const incomingData = req.body
    try {
    for(let i = 0; i < incomingData.length; i++){
        console.log(incomingData[i])

    const {businessId, creditorId, description, category, qty, rate, date} = incomingData[i];
    if (!businessId || !creditorId || !description || !category || !qty || !rate || !date) {
        return next(APIError.badRequest('Please supply all the required fields!'))
    }
    // const total = qty * rate
   
    //  req.body.total = total
   
     const newCredit = await createCreditService(incomingData[i])
     res.status(201).json({
        success: true,
        message: 'Credit created successfully!',
        creditor: newCredit
     })
    }
   } catch (error) {
    next(APIError.customError(error.message))
   }
}

export const getCredits = async(req, res, next) => {
 try {
       const creditors = await getCreditsService()
       if (!creditors) {
       return next(APIError.notFound('No creditor found!'))
       }
       res.status(200).json({
           success: true,
           message: 'Credits retrieved successfully!',
           creditors
        })
 } catch (error) {
    next(APIError.customError(error.message))
 }
}

export const getCreditById = async(req, res, next) => {
    // console.log(req.body)
    const {id} = req.body
    if (!id) {
        return next(APIError.badRequest('Credit ID is required'))
    }
    try {
        const findCredit = await getCreditsByIdService(id)
        if (!findCredit) {
            return next(APIError.notFound('Credit not found!'))
        }
        res.status(200).json({
            success: true,
            message: 'Credit retrieved successfully!',
            creditor: findCredit
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

export const getCreditByCreditorId = async(req, res, next) => {
    const {creditorId} = req.params
    console.log(req.params)
    if (!creditorId) {
        return next(APIError.badRequest('Credit ID is required'))
    }
    try {
        const findCredit = await getCreditsByCreditorIdService(creditorId)
        if (!findCredit) {
            return next(APIError.notFound('Credit not found!'))
        }
        res.status(200).json({
            success: true,
            message: 'Credit retrieved successfully!',
            credits: findCredit
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

export const editCredit = async(req, res, next) => {
    const {id} = req.body
    if (!id) {
        return next(APIError.badRequest('Credit ID is required'))
    }
    try {
        const findCredit = await getCreditsByIdService(id)
        if (!findCredit) {
            return next(APIError.notFound('Credit not found!'))
        }
        const updatedCredit = await editCreditService(id, req.body)
        res.status(200).json({
            success: true,
            message: 'Credit updated successfully!',
            creditor: updatedCredit
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

export const deleteCredit = async(req, res, next) => {
    const {id} = req.body
    if (!id) {
        return next(APIError.badRequest('Credit ID is required'))
    }
    try {
        const findCredit = await getCreditsByIdService(id)
        if (!findCredit) {
            return next(APIError.notFound('Credit not found!'))
        }
        const deletedCredit = await deleteCreditService(id, req.body)
        res.status(200).json({
            success: true,
            message: 'Credit deleted successfully!',
            creditor: deleteCredit
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}