const salesService = require('./salesService.js')


const {
    createSalesService,
    editSalesService,
    getSalesByIdService,
    getSalesService,
    deleteSalesService
} = salesService
const { findStockService, getStocksByIdService } = require('../stock/stockServices.js');
const APIError = require('../../utils/customError.js');
const { Stock } = require('../../models/stockModel.js')

const createSales = async (req, res, next) => {
    const incomingData = req.body
    try {
        const { account, description, category, qty, rate, date } = incomingData;
        if (!account || !description || !category || !qty || !rate || !date) {
            return next(APIError.badRequest('Please supply all the required fields!'))
        }

        // import stock from the DB
        await getStocksByIdService(account)

        const stock = await findStockService(description, category, account)

        if (!stock || stock.length === 0) {
            return res.status(400).json({
                success: false,
                message: `The ${incomingData.description} description and category does not match what is in the stock`,
                sale: incomingData
            })
        }
        if (stock[0].qty < qty) {
            return res.status(400).json({
                success: false,
                message: "There is not enough quantity of this stock in the database",
                sale: incomingData
            })
        }
        if (stock[0].qty >= qty) {
            let new_stock = await Stock.findById(stock[0]._id).exec()
            new_stock.qty = stock[0].qty - qty
            await new_stock.save()

            // if stock.qty === 0, delete from the stock
            if (new_stock.qty === 0) {
                await Stock.findByIdAndDelete(new_stock._id)
                return res.status(400).json({
                    success: false,
                    message: 'This goods is finished from the stock'
                })
            }
        }

        // this one saves the incoming sale into the sales DB
        const newSales = await createSalesService(incomingData)
        res.status(201).json({
            success: true,
            message: 'Sales created successfully!',
            sales: newSales
        })
    } catch (error) {
        // next(APIError.customError(error.message))
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'There was a problem creating this sales!'
        })
    }
}

const getSales = async (req, res, next) => {
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

const getSalesById = async (req, res, next) => {
    const { id } = req.body
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

const editSales = async (req, res, next) => {
    const { id } = req.body
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

const deleteSales = async (req, res, next) => {
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

module.exports = {
    createSales,
    getSales,
    getSalesById,
    editSales,
    deleteSales
}