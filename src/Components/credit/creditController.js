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

const createCredit = async (req, res, next) => {
    try {
        const incomingData = req.body
        for (let i = 0; i < incomingData.length; i++) {
            const { businessId, creditorId, description, category, qty, rate, date } = incomingData[i];

            if (!businessId || !creditorId || !description || !category || !qty || !rate || !date) {
                return next(APIError.badRequest('Please supply all the required fields!'))
            }

            //get the stock 
            const getStock = await getStocksByIdService(businessId)

            const compareWithStock = getStock.filter((item) => item.goods === description && item.category === category)

            let createCredit = false
            for (let j = 0; j < compareWithStock.length; j++) {
                //if the stock.goods is not the same as the description, return a response
                if (compareWithStock[j].goods !== description && compareWithStock[j].category !== category) {
                    return res.status(400).json({
                        success: false,
                        message: "the goods description and category do not match",
                        code: 103,
                        credit: incomingData[i]
                    })
                }
                //if the stock is less than the credit, return a response
                if (compareWithStock[j].qty < qty) {
                    return res.status(400).json({
                        success: false,
                        message: 'There is not enough items in the stock DB',
                        code: 100,
                        credit: incomingData[i]
                    })
                }

                const new_stock = compareWithStock[j].qty - qty
                console.log(new_stock, "before")
                compareWithStock[j].qty = new_stock
                console.log(new_stock, compareWithStock[j], compareWithStock[j]._id, "credit page")
                if (compareWithStock[j].qty === 0) {
                    await Stock.findByIdAndDelete(compareWithStock[j]._id)
                }

                await editStocksService(compareWithStock[j]._id, compareWithStock[j])
                if (compareWithStock[j].qty >= qty) {
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
    getCreditByCreditorId,
    editCredit,
    deleteCredit
}