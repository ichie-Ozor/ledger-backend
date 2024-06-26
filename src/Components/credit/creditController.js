import {
    createCreditService, 
    editCreditService, 
    getCreditsByIdService, 
    getCreditsService, 
    deleteCreditService,
    getCreditsByCreditorIdService
} from './creditServices.js'
import { getStocksByIdService, editStocksService, deleteStockService } from '../stock/stockServices.js';
import APIError from '../../utils/customError.js';
import { get, Types } from 'mongoose';
import { Stock } from '../../models/stockModel.js';

export const createCredit = async(req, res, next) => {
    // console.log(req.body, "credit req.body")
    const incomingData = req.body
    try {
    for(let i = 0; i < incomingData.length; i++){
        // console.log(incomingData[i], "see incoming credit")

    const {businessId, creditorId, description, category, qty, rate, date} = incomingData[i];

    if (!businessId || !creditorId || !description || !category || !qty || !rate || !date) {
        return next(APIError.badRequest('Please supply all the required fields!'))
    }
    
    //get the stock 
    const getStock = await getStocksByIdService(businessId)

    for(let j = 0; j < getStock.length; i++){
        //if the stock.goods is not the same as the description, return a response
        if(getStock[j].goods !== description &&  getStock[j].category !== category){
            return res.status(400).json({
                success: false,
                message: "the goods description and category do not match",
                code: 103,
                credit: incomingData[i]
            })
        }
        //if the stock is less than the credit, return a response
    if(getStock[j].goods === description && getStock[j].qty < qty){
            return res.status(400).json({
            success: false,
            message: 'There is not enough items in the stock DB',
            code: 100,
            credit:incomingData[i] 
          })
      }
    
    //if the stock is greater than the credit, subtract it
    if(getStock[j].goods === description && getStock[j].qty >= qty) {
        let new_stock =await Stock.findById(getStock[j]._id).exec()
        new_stock.qty = getStock[j].qty - qty
        //////this code can replace the uptwo lines, source: chatgpt (not checked)
        // getStock[j] -= qty
        // console.log(new_stock.qty, "new stock")

        // if the stock qty is = 0 remove it from the stock
        if(new_stock.qty === 0){
            await Stock.findByIdAndDelete(new_stock._id)
            // return res.status(200).json({   ///delete this, source: chatgpt
            //     success: true,
            //     message: 'There is no more stock in the Database',
            //   })
        }
        await new_stock.save()
      } 
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