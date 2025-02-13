const creditorBalService = require('./creditorBalService.js')
const APIError = require('../../utils/customError.js');
const { getCreditorById } = require('../creditor/creditorController.js');


const {
    createCreditorBalService,
    getCreditorBalService,
    getCreditorBalByIdService,
    getCreditorBalByCreditorIdService,
    editCreditorBalService,
    deleteCreditorBalService
} = creditorBalService;


const createCreditorBal = async (req, res, next) => {
    try {
        const { businessId, balance, creditorId, firstName, lastName, paid, phoneNumber, purchase } = req.body
        if (!businessId || !balance || !creditorId || !firstName || !lastName || !phoneNumber || !paid || !purchase) {
            return next(APIError.badRequest("Please supply all the payment details of the creditor"))
        }
        const newCreditorBal = await createCreditorBalService(req.body)
        res.status(200).json({
            success: true,
            message: "Creditor Balance created successfully",
            creditorBal: newCreditorBal
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

const getCreditorBal = async (req, res, next) => {
    try {
        const creditorBal = await getCreditorBalService()
        if (!creditorBal) {
            return next(APIError.notFound("This Creditor Balance was not found!"))
        }
        res.status(200).json({
            success: true,
            message: "Creditor Bal retrieved successfully",
            creditorBal
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

const getCreditorBalById = async (req, res, next) => {
    const { creditorId } = req.params
    if (!creditorId) {
        return next(APIError.badRequest("creditor Id required"))
    }
    try {
        const findCreditorBal = await getCreditorBalByIdService(creditorId)
        if (!findCreditorBal) {
            return next(APIError.notFound('This creditor Bal not found'))
        }
        res.status(200).json({
            success: true,
            message: "Creditor Bal retrieved successfully",
            creditorBal: findCreditorBal
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

const getCreditorBalByCreditorId = async (req, res, next) => {
    const { creditorId } = req.params
    if (!creditorId) {
        return next(APIError.badRequest('Creditor Id required'))
    }
    try {
        const findCreditorBal = await getCreditorBalByCreditorIdService(creditorId)
        if (!findCreditorBal) {
            return next(APIError.notFound('Creditor not found'))
        }
        return res.status(200).json({
            success: true,
            message: "creditor bal retrieved successfully",
            creditBal: findCreditorBal
        })
    } catch (error) {
        console.error("Error in getCreditorBalByCreditorId controller", error)
        next(APIError.customError(error.message))
    }
}

const editCreditorBal = async (req, res, next) => {
    const { id } = req.body
    if (!id) {
        return next(APIError.badRequest('credit Id required'))
    }
    try {
        const findCreditorBal = await getCreditorBalByIdService(id)
        if (!findCreditorBal) {
            return next(APIError.notFound('creditor Bal not found'))
        }
        const updatedCreditorBal = await editCreditorBalService(id, req.body)
        res.status(200).json({
            success: true,
            message: "Credit bal update successfully",
            creditorBal: updatedCreditorBal
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

const deleteCreditorBal = async (req, res, next) => {
    const { id } = req.body
    if (!id) {
        return next(APIError.badRequest('creditor id not found'))
    }
    try {
        const deletedCreditorBal = await deleteCreditorBalService(id, req.body)
        res.status(200).json({
            success: true,
            message: "creditor Bal deleted successfully",
            deletedCreditorBal
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

module.exports = {
    createCreditorBal,
    getCreditorBal,
    getCreditorBalById,
    getCreditorBalByCreditorId,
    editCreditorBal,
    deleteCreditorBal
}