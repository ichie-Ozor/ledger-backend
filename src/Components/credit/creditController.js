import {
    createCreditService, 
    editCreditService, 
    getCreditsByIdService, 
    getCreditsService, 
    deleteCreditService,
    getCreditsByCreditorIdService
} from './creditServices.js'
import { getStocksByIdService, editStocksService } from '../stock/stockServices.js';
import APIError from '../../utils/customError.js';

export const createCredit = async(req, res, next) => {
    console.log(req.body, "it here")
    const incomingData = req.body
    try {
    for(let i = 0; i < incomingData.length; i++){
        console.log(incomingData[i], "see incoming data")

    const {businessId, creditorId, description, category, qty, rate, date} = incomingData[i];
    if (!businessId || !creditorId || !description || !category || !qty || !rate || !date) {
        return next(APIError.badRequest('Please supply all the required fields!'))
    }
    
    
    //get the stock 
    const getStock = await getStocksByIdService(businessId)
    console.log(getStock, businessId, "see stock")

    //if the stock is less than the credit, return a response
    if(getStock[0].category !== category && getStock[0].qty < qty){
         res.status(200).json({
            success: true,
            message: 'There is not enough items in the stock DB'
          })
    }

   //check if the stock has the item
   if(getStock.category !== category || getStock.length === 0) {
       res.status(200).json({
       success: true,
       message: 'There is no item in the stock DB'
     })
   }
    //if the stock is greater than the credit, subtract it
    if(getStock.qty >= qty) {
        let stockDiff = getStock.qty - qty
        const editedStock = {...getStock}
        editedStock.qty = stockDiff
        const updatedStock = await editStocksService(businessId, editedStock)

            res.status(201).json({
            success: true,
            message: 'Credit created successfully!',
            creditor: updatedStock
         })
    }
    //this will save the credit to the credit DB
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
    const {id} = req.params
    console.log(id, "id hereeee")
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
    // console.log(req.params, "here")
    if (!creditorId) {
        return next(APIError.badRequest('Credit ID is required'))
    }
    try {
        const findCredit = await getCreditsByCreditorIdService(creditorId)
        if (!findCredit) {
            return next(APIError.notFound('Credit not found!!!'))
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
            creditor: deletedCredit
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}