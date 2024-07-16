import {
    createDebtService, 
    editDebtService, 
    getDebtsByIdService, 
    getDebtsService, 
    getDebtsByDebtorIdService,
    deleteDebtService
} from './debtServices.js'
import APIError from '../../utils/customError.js';
import { 
    createStockService, 
    editStocksService, 
    findStockService,
    getStocksByIdService
} from '../stock/stockServices.js';

export const createDebt = async(req, res, next) => {
    console.log(req.body, "debt")
    const incomingData = req.body
    try {
    for (let i = 0; i < incomingData.length; i++){
        console.log(incomingData[i], "each debt")
        const {businessId, debtorId, description, category, qty, rate, date} = incomingData[i];
    if (!businessId || !debtorId || !description || !category || !qty || !rate || !date) {
        return next(APIError.badRequest('Please supply all the required fields!'))
    }
    let price = 1.2 * rate
    const stock_entry = {
        account : businessId,
        goods: description,
        category,
        qty: Number(qty),
        cost: rate,
        sellingPrice: price 
    }
    ///fetch stock from the backend
    const fetchStock = await findStockService(description, category, businessId)
    ////check if the stock has the product and the price is the same, you add the qty only
    const sameStock = fetchStock.filter((item) => item.cost === rate)
    if(sameStock.length > 0 && fetchStock.length !== 0){
        sameStock[0].qty += Number(qty);
    } else {
        ///if the price is not the same
        createStockService(stock_entry)
    }    
    // 
     const newDebt= await createDebtService(incomingData[i])
     res.status(201).json({
        success: true,
        message: 'Debt created successfully!',
        Debt: newDebt
     })
    }
   } catch (error) {
    next(APIError.customError(error.message))
   }
}

export const getDebts = async(req, res, next) => {
 try {
       const Debts = await getDebtsService()
       if (!Debts) {
       return next(APIError.notFound('No Debt found!'))
       }
       res.status(200).json({
           success: true,
           message: 'Debts retrieved successfully!',
           Debts
        })
 } catch (error) {
    next(APIError.customError(error.message))
 }
}

export const getDebtById = async(req, res, next) => {
    const {id} = req.body
    if (!id) {
        return next(APIError.badRequest('Debt ID is required'))
    }
    try {
        const findDebt= await getDebtsByIdService(id)
        if (!findDebt) {
            return next(APIError.notFound('Debtnot found!'))
        }
        res.status(200).json({
            success: true,
            message: 'Debt retrieved successfully!',
            Debt: findDebt
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}


export const getDebtsByDebtorId = async(req, res, next) => {
    const {debtorId} = req.params
    console.log(debtorId, "na me be this")
    if (!debtorId) {
        return next(APIError.badRequest('Debt ID is required'))
    }
    try {
        const findDebt = await getDebtsByDebtorIdService(debtorId)
        console.log(findDebt)
        if (!findDebt) {
            return next(APIError.notFound('Debt not found!'))
        }
        res.status(200).json({
            success: true,
            message: 'Debt retrieved successfully!',
            debts: findDebt
         })
    } catch (error) {
        console.log(error)
        next(APIError.customError(error.message))
    }
}

export const editDebt = async(req, res, next) => {
    const {id} = req.body
    if (!id) {
        return next(APIError.badRequest('Debt ID is required'))
    }
    try {
        const findDebt= await getDebtsByIdService(id)
        if (!findDebt) {
            return next(APIError.notFound('Debt not found!'))
        }
        const updatedDebt= await editDebtService(id, req.body)
        res.status(200).json({
            success: true,
            message: 'Debt updated successfully!',
            Debt: updatedDebt
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

export const deleteDebt= async(req, res, next) => {
    const {id} = req.params
    console.log(id, "id")
    if (!id) {
        return next(APIError.badRequest('Debt ID is required'))
    }
    try {
        const findDebt= await getDebtsByIdService(id)
        if (!findDebt) {
            return next(APIError.notFound('Debtnot found!'))
        }
        
        const {description, category, businessId, qty} = findDebt
        const accountId = businessId.toString()
        //fetch the stock from DB
        const fetchStock = await getStocksByIdService(accountId)
        //filter the stock that has the same description and category
        const filtered_stock = fetchStock.filter((item) => item.goods === description && item.category === category)

        //update the qty
        filtered_stock[0].qty -= qty
        //isolate the id from the stock
        const _id = filtered_stock[0]._id.toString()

        //update the stock
        await editStocksService(_id, filtered_stock[0])
    
        await deleteDebtService(id) 
        res.status(200).json({
            success: true,
            message: 'Debt deleted successfully!',
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}