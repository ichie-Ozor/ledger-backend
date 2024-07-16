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
// import { get, Types } from 'mongoose';
import { Stock } from '../../models/stockModel.js';
import { 
    getCreditorBalByIdService,
    deleteCreditorBalService } from '../creditorBal/creditorBalService.js';

export const createCredit = async(req, res, next) => {
    try {
    console.log(req.body, "credit req.body")
    const incomingData = req.body
    for (let i = 0; i < incomingData.length; i++){
        console.log(incomingData[i], "each credit")
    const {businessId, creditorId, description, category, qty, rate, date} = incomingData[i];

    if (!businessId || !creditorId || !description || !category || !qty || !rate || !date) {
        return next(APIError.badRequest('Please supply all the required fields!'))
    }
    
    //get the stock 
    const getStock = await getStocksByIdService(businessId)
    //    console.log(getStock, "stock from the db")
     
       const compareWithStock = getStock.filter((item) => item.goods === description && item.category === category)
    //    console.log(compareWithStock, "compareWithStock")

       let createCredit = false
    for(let j = 0; j < compareWithStock.length; j++){
        //if the stock.goods is not the same as the description, return a response
        // console.log(compareWithStock[j].goods, description, compareWithStock[j].category, category, "credit match")
        if(compareWithStock[j].goods !== description &&  compareWithStock[j].category !== category){
            return res.status(400).json({
                success: false,
                message: "the goods description and category do not match",
                code: 103,
                credit: incomingData[i]
            })
        }
        //if the stock is less than the credit, return a response
        if(compareWithStock[j].qty < qty){
            return res.status(400).json({
            success: false,
            message: 'There is not enough items in the stock DB',
            code: 100,
            credit:incomingData[i]
          })
        }

        const new_stock = compareWithStock[j].qty - qty
        compareWithStock[j].qty = new_stock

        if(compareWithStock[j].qty === 0){
            await Stock.findByIdAndDelete(compareWithStock[j]._id)
        }

        await editStocksService(compareWithStock[j]._id, compareWithStock[j])
        if(compareWithStock[j].qty >= qty) {
        //this will save the credit to the credit DB
        const newCredit = await createCreditService(incomingData[i])
        res.status(201).json({    
            success: true,
            message: 'Credit created successfully!',
            creditor: newCredit
        })
        creditCreated = true;
        break;
        }
        // break
      }
    }
     if(!createCredit){
        return res.status(400).json({
            success: false,
            message: "Failed to create credit due to insufficient stock or mismatch",
            credit: incomingData
        });
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
    const {id} = req.params
    if (!id) {
        return next(APIError.badRequest('Credit ID is required'))
    }
    try {
        const findCredit = await getCreditsByIdService(id) 
        if (!findCredit) {
            return next(APIError.notFound('Credit not found!'))
        }
        const {description, category, businessId, qty} = findCredit
        const accountId = businessId.toString()
        // get stock and add the qty that was deducted
        const fetchStock = await getStocksByIdService(accountId)
        //filter the stock
        const filtered_stock = fetchStock.filter((item) => item.goods === description && item.category === category)
        //update the qty
        filtered_stock[0].qty += qty
        //isolate the id and stringify
        const _id = filtered_stock[0]._id.toString()
        //update the stock
        await editStocksService(_id, filtered_stock[0])
        await deleteCreditService(findCredit)
        res.status(200).json({
            success: true,
            message: 'Credit deleted successfully!',
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}