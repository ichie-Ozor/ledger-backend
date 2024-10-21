const stockService = require('./stockServices.js')

const {
    createStockService,
    editStocksService,
    getStocksByIdService,
    getStocksService,
    deleteStockService
} = stockService
const { getProfileByIdService } = require('../profile/profileService.js')
const APIError = require('../../utils/customError.js');
const AccountModel = require('../../models/accountModel.js');
const { Types } = require("mongoose");
const sendMail = require('../../utils/sendMail.js');
const bcrypt = require('bcryptjs')
const { sendPDFMail } = require('../../utils/pdf.js');
const Stock = require('../../models/stockModel.js');

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
        const { account } = incomingData[0]
        const businessOwner = await AccountModel.find({ _id: new Types.ObjectId(account) })
        const { email, fullName } = businessOwner[0]

        const PDFmail = sendPDFMail(fullName, req.body)
        sendMail(email, "This is the stock", PDFmail)

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

const getStockByDate = async (req, res, next) => {
    const { id } = req.params
    const { from, to } = req.body
    if (!from || !to) {
        return res.json({
            success: false,
            message: "Please provide both 'from' and 'to' dates"
        })
    }
    try {
        const results = await Stock.find({
            date: {
                $gte: new Date(from),
                $lte: new Date(to)
            },
            account: id
        })
        res.status(200).json({
            success: true,
            message: 'Filtered successfully',
            filter: results
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later. Error" + err.message
        })
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
    const { id, password } = req.params
    console.log(req.params, req.body, "params")
    if (!_id) {
        return next(APIError.badRequest('Stock ID is required'))
    }
    try {
        const findStock = await getStocksByIdService(_id)
        if (!findStock) {
            return next(APIError.notFound('Stock not found!'))
        }
        const getProfileDetails = await getProfileByIdService(id)
        console.log(getProfileDetails, "profile")

        const comparePassword = await bcrypt.compare(password, getProfileDetails[0].password)
        if (!comparePassword) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to do this!"
            })
        } else {
            const deletedStock = await deleteStockService(_id, req.body)
            res.status(200).json({
                success: true,
                message: 'Stock deleted successfully!',
                Stock: deletedStock
            })
        }

    } catch (error) {
        next(APIError.customError(error.message))
    }
}

module.exports = {
    createStock,
    getStocks,
    getStockById,
    getStockByDate,
    editStock,
    deleteStock
}