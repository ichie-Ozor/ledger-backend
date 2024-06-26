import {
    createSalesService, 
    editSalesService, 
    getSalesByIdService, 
    getSalesService, 
    deleteSalesService
} from './salesService.js'
import { findStockService, getStocksByIdService} from '../stock/stockServices.js'
import APIError from '../../utils/customError.js';
import { Stock } from '../../models/stockModel.js'

export const createSales = async(req, res, next) => {
    console.log(req.body, "here")
    const incomingData = req.body
    try {
    // for(let i = 0; i < incomingData.length; i++){
    const {account, description, category, qty, rate, date} = incomingData;
    if (!account || !description || !category || !qty || !rate || !date) {
        return next(APIError.badRequest('Please supply all the required fields!'))
    }
    
    // import stock from the DB
    await getStocksByIdService(account)

    // const { description, category, account } = incomingData[0]
    const stock = await findStockService(description, category, account)

    if(!stock || stock.length === 0) {
        return res.status(400).json({
            success: false,
            message: `The ${incomingData.description} description and category does not match what is in the stock`,
            sale: incomingData
        })
    }
    if( stock[0].qty < qty ){
        return res.status(400).json({
            success: false,
            message: "There is not enough quantity of this stock in the database",
            sale: incomingData
          })
    } 
    if(stock[0].qty >= qty){
        let new_stock = await Stock.findById(stock[0]._id).exec()
       new_stock.qty = stock[0].qty - qty
       await new_stock.save()
    //     res.status(200).json({
    //     success: true,
    //     message: 'This goods is successfully removed from the stock'
    // })
      // if stock.qty === 0, delete from the stock
    if(new_stock.qty === 0){
        console.log("stock deleted")
        await Stock.findByIdAndDelete(new_stock._id)
        return res.status(400).json({
            success: false,
            message: 'This goods is finished from the stock'
        })
       }
    } 
    
    

    // for(let i = 0; i < getStock.length; i++){
    // if the getStock.good and category does not match that of incoming sale, return error
    // if(getStock.goods !== description && getStock.category !== category){
    //     return res.status(400).json({
    //         success: false,
    //         message: `The ${incomingData[i].description} description and category does not match what is in the stock`,
    //         sale: incomingData[i]
    //     })
    // }

    // if the incoming sale qty is > than the qty in the stock or stock.goods !== description, return an error
    // if(getStock[i].goods === description && getStock[i].qty < qty){
    //   return res.status(400).json({
    //     success: false,
    //     message: "There is not enough quantity of this stock in the database",
    //     code: 100,
    //     sale: incomingData[i]
    //   })
    // }

    // check if the sale input from the front is present in the stock and  stock.qty >= qty, then subtract from the stock
    // if(getStock[i].goods === description && getStock[i].qty >= qty){
    //    let new_stock = await Stock.findById(getStock[i]._id).exec()
    //    new_stock.qty = getStock[i].qty - qty

    //    // if stock.qty === 0, delete from the stock
    //    if(new_stock.qty === 0){
    //     await Stock.findByIdAndDelete(new_stock._id)
    //     return res.status(200).json({
    //         success: true,
    //         message: 'This goods is finished from the stock'
    //     })
    //    }
    //    await new_stock.save()
    // }
    // }


    // this one saves the incoming sale into the sales DB
    const newSales = await createSalesService(incomingData)
     res.status(201).json({
        success: true,
        message: 'Sales created successfully!',
        sales: newSales
     })

    // }
   } catch (error) {
    // next(APIError.customError(error.message))
    console.log(error)
    return res.status(500).json({
        success: false,
        message: 'There was a problem creating this sales!'
     })
   }
 
}

export const getSales = async(req, res, next) => {
 try {
       const sales = await getSalesService()
       if (!sales) {
       return next(APIError.notFound('No creditor found!'))
       }
       res.status(200).json({
           success: true,
           message: 'Saless retrieved successfully!',
           sales
        })
 } catch (error) {
    next(APIError.customError(error.message))
 }
}

export const getSalesById = async(req, res, next) => {
    const {id} = req.body
    if (!id) {
        return next(APIError.badRequest('Sales ID is required'))
    }
    try {
        const findSales = await getSalesByIdService(id)
        if (!findSales) {
            return next(APIError.notFound('Sales not found!'))
        }
        res.status(200).json({
            success: true,
            message: 'Sales retrieved successfully!',
            sales: findSales
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

export const editSales = async(req, res, next) => {
    const {id} = req.body
    if (!id) {
        return next(APIError.badRequest('Sales ID are is required'))
    }
    try {
        const findSales = await getSalesByIdService(id)
        if (!findSales) {
            return next(APIError.notFound('Sales not found!'))
        }
        const updatedSales = await editSalesService(id, req.body)
        res.status(200).json({
            success: true,
            message: 'Sales updated successfully!',
            sales: updatedSales
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

export const deleteSales = async(req, res, next) => {
    console.log(req.body, "data here")
    console.log(req.body[0]._id)
    const id = req.body[0]._id
    if (!id) {
        return next(APIError.badRequest('Sales ID is required'))
    }
    try {
        const findSales = await getSalesByIdService(id)
        if (!findSales) {
            return next(APIError.notFound('Sales not found!'))
        }
        await deleteSalesService(id, req.body)
        res.status(200).json({
            success: true,
            message: 'Sales deleted successfully!',
            sales: deleteSales
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}