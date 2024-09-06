const stockService = require('./stockServices.js')

const {
    createStockService,
    editStocksService,
    getStocksByIdService,
    getStocksService,
    deleteStockService
} = stockService
const APIError = require('../../utils/customError.js');
const AccountModel = require('../../models/accountModel.js');
const { Types } = require("mongoose");
const { sendMail } = require('../../utils/sendMail.js');
const { sendPDFMail } = require('../../utils/pdf.js');

const createStock = async (req, res, next) => {
    const incomingData = req.body
    const { account } = req.body
    try {
        for (let i = 0; i < incomingData.length; i++) {
            const { account, goods, category, qty, cost, date, sellingPrice } = incomingData[i];
            if (!account || !goods || !category || !qty || !cost || !sellingPrice) {
                return next(APIError.badRequest('Please supply all the required fields!'))
            }
        }
        // const total = qty * cost
        //  req.body.total = total
        const { account } = incomingData[0]
        const businessOwner = await AccountModel.find({ _id: new Types.ObjectId(account) })
        const { email, fullName } = businessOwner[0]

        const PDFmail = sendPDFMail(fullName, req.body)
        sendMail("simeon_mc2000@yahoo.com", "This is the stock", PDFmail)

        const newStock = await createStockService(req.body)
        res.status(201).json({
            success: true,
            message: 'Stock created successfully!',
            Stock: newStock
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

const getStocks = async (req, res, next) => {
    try {
        const Stocks = await getStocksService()
        if (!Stocks) {
            return next(APIError.notFound('No Stock found!'))
        }
        res.status(200).json({
            success: true,
            message: 'Stocks retrieved successfully!',
            Stocks
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

const getStockById = async (req, res, next) => {
    const { id } = req.params
    if (!id) {
        return next(APIError.badRequest('Stock ID is required'))
    }
    try {
        const findStock = await getStocksByIdService(id)
        if (!findStock) {
            return next(APIError.notFound('Stock not found!'))
        }
        res.status(200).json({
            success: true,
            message: 'Stock retrieved successfully!',
            Stock: findStock
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

const editStock = async (req, res, next) => {
    const { id } = req.body
    if (!id) {
        return next(APIError.badRequest('Stock ID is required'))
    }
    try {
        const findStock = await getStocksByIdService(id)
        if (!findStock) {
            return next(APIError.notFound('Stock not found!'))
        }
        const updatedStock = await editStocksService(id, req.body)
        res.status(200).json({
            success: true,
            message: 'Stock updated successfully!',
            Stock: updatedStock
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

const deleteStock = async (req, res, next) => {
    const { _id } = req.body[0]
    if (!_id) {
        return next(APIError.badRequest('Stock ID is required'))
    }
    try {
        const findStock = await getStocksByIdService(_id)
        if (!findStock) {
            return next(APIError.notFound('Stock not found!'))
        }
        const deletedStock = await deleteStockService(_id, req.body)
        res.status(200).json({
            success: true,
            message: 'Stock deleted successfully!',
            Stock: deletedStock
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

module.exports = {
    createStock,
    getStocks,
    getStockById,
    editStock,
    deleteStock

}