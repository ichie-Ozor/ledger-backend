const creditService = require('./creditServices.js')
const stockService = require('../stock/stockServices.js')
const APIError = require('../../utils/customError.js');
const bcrypt = require('bcryptjs')


const {
    createCreditService,
    editCreditService,
    getCreditsByIdService,
    getCreditsService,
    deleteCreditService,
    getCreditsByCreditorIdService
} = creditService
const {
    getStocksByIdService,
    editStocksService,
    deleteStockService
} = stockService;

const Stock = require('../../models/stockModel.js');
const { getProfileByIdService } = require('../profile/profileService.js');
const { getCreditorBalByIdService, deleteCreditorBalService } = require('../creditorBal/creditorBalService.js');
const Credit = require('../../models/creditModel.js');

const createCredit = async (req, res, next) => {
    console.log(req.body, "credit body")
    try {
        const incomingData = req.body
        for (let i = 0; i < incomingData.length; i++) {
            const { businessId, creditorId, description, category, amt, qty, rate, date, crt } = incomingData[i];

            if (!businessId || !creditorId || !description || !category || !qty || !rate || !date) {
                return next(APIError.badRequest('Please supply all the required fields!'))
            }

            //get the stock 
            const getStock = await getStocksByIdService(businessId)

            const compareWithStock = getStock.filter((item) => item.goods === description && item.category === category)

            let creditCreated = false
            for (let j = 0; j < compareWithStock.length; j++) {

                const stockItem = compareWithStock[j]
                //if the stock is less than the credit, return a response
                if (stockItem.qty < qty) {
                    return res.status(400).json({
                        success: false,
                        message: 'There is not enough items in the stock DB',
                        code: 100,
                        credit: incomingData[i]
                    })
                }

                // const new_stock = stockItem.qty - qty
                // stockItem.qty = new_stock

                let crtQty = qty * (stockItem.pcs || 1)
                amt === "pcs" ? stockItem.qty -= qty : stockItem.qty -= crtQty


                if (compareWithStock[j].qty === 0) {
                    await Stock.findByIdAndDelete(stockItem._id)
                }

                await editStocksService(stockItem._id, stockItem)
                if (stockItem.qty >= qty) {
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
        if (!createCredit) {
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

const getCredits = async (req, res, next) => {
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

const getCreditById = async (req, res, next) => {
    const { id } = req.params
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

const getCreditByDate = async (req, res, next) => {
    const { id } = req.params
    const { from, to } = req.body
    if (!from || !to) {
        return res.json({
            success: false,
            message: "Please provide both 'from' and 'to' dates"
        })
    }
    try {
        const result = await Credit.find({
            date: {
                $gte: new Date(from),
                $lte: new Date(to)
            },
            creditorId: id
        })
        res.status(200).json({
            success: true,
            message: "Filtered successfully",
            filter: result
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later. Error" + err.message
        })
    }
}

const getCreditByCreditorId = async (req, res, next) => {
    const { creditorId } = req.params
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

const editCredit = async (req, res, next) => {
    const { id } = req.body
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

const deleteCredit = async (req, res, next) => {
    const { id, password } = req.params

    if (!id) {
        return next(APIError.badRequest('Credit ID is required'))
    }
    try {
        const findCredit = await getCreditsByIdService(id)
        if (!findCredit) {
            return next(APIError.notFound('Credit not found!'))
        }
        const { description, category, businessId, qty } = findCredit
        const accountId = businessId.toString()
        const getProfileDetails = await getProfileByIdService(accountId)

        const comparePassword = await bcrypt.compare(password, getProfileDetails[0].password)
        // get stock and add the qty that was deducted
        if (!comparePassword) {
            return res.status(403).json({
                success: false,
                message: "you are not allowed to do this",
            })
        } else {

            const fetchStock = await getStocksByIdService(businessId)
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
        }
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

module.exports = {
    createCredit,
    getCredits,
    getCreditById,
    getCreditByDate,
    getCreditByCreditorId,
    editCredit,
    deleteCredit
}