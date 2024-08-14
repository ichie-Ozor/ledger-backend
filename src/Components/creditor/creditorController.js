const creditorService = require('./creditorServices.js')

const {
    createCreditorService,
    editCreditorService,
    getCreditorsByIdService,
    getCreditorsService,
    deleteCreditorService
} = creditorService
const { deleteManyCreditService } = require('../credit/creditServices.js');
const bcrypt = require("bcryptjs");
const { getProfileByIdService } = require('../profile/profileService.js');
const APIError = require('../../utils/customError.js');
const { deleteCreditorBalService } = require('../creditorBal/creditorBalService.js');

const createCreditor = async (req, res, next) => {
    // console.log(req.body, "see me")
    const { firstName, lastName, phoneNumber, businessName, email, createdBy } = req.body;
    if (!firstName || !lastName || !phoneNumber || !businessName || !createdBy) {
        return next(APIError.badRequest('Please supply all the required fields!'))
    }
    try {
        const newCreditor = await createCreditorService(req.body)
        res.status(201).json({
            success: true,
            message: 'Creditor created successfully!',
            creditor: newCreditor
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

const getCreditors = async (req, res, next) => {
    try {
        const creditors = await getCreditorsService()
        if (!creditors) {
            return next(APIError.notFound('No creditor found!'))
        }
        res.status(200).json({
            success: true,
            message: 'Creditors retrieved successfully!',
            creditors
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

const getCreditorById = async (req, res, next) => {
    // console.log(req.params)
    const { id } = req.params
    if (!id) {
        return next(APIError.badRequest('Creditor ID is required'))
    }
    try {
        const findCreditor = await getCreditorsByIdService(id)
        // console.log(findCreditor, id)
        if (!findCreditor) {
            return next(APIError.notFound('Creditor not found!'))
        }
        console.log(findCreditor)
        res.status(200).json({
            success: true,
            message: 'Creditor retrieved successfully!',
            creditor: findCreditor
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

const editCreditor = async (req, res, next) => {
    const { id } = req.params
    if (!id) {
        return next(APIError.badRequest('Creditor ID is required'))
    }
    try {
        const findCreditor = await getCreditorsByIdService(id)
        if (!findCreditor) {
            return next(APIError.notFound('Creditor not found!'))
        }
        const updatedCreditor = await editCreditorService(id, req.body)
        res.status(200).json({
            success: true,
            message: 'Creditor updated successfully!',
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

const deleteCreditor = async (req, res, next) => {
    const { id, account, password } = req.params
    console.log(req.body, id, req.params, "delete creditor")
    if (!id) {
        return next(APIError.badRequest('Creditor ID is required'))
    }
    try {
        const findCreditor = await getCreditorsByIdService(id)
        if (!findCreditor) {
            return next(APIError.notFound('Creditor not found!'))
        }

        const ownerProfile = await getProfileByIdService(account)
        const comparePassword = await bcrypt.compare(password, ownerProfile[0].password)

        if (ownerProfile.length === 0) {
            return res.status(400).json({
                success: false,
                message: "You are not authorized to carry out this action"
            })
        }
        if (!comparePassword) {
            return res.status(403).json({
                success: false,
                message: "Please put in the correct password, else you will not be allowed to delete"
            })
        }

        await deleteCreditorService(id)
        await deleteManyCreditService(id)
        await deleteCreditorBalService(id)
        res.status(200).json({
            success: true,
            message: 'Creditor deleted successfully!',
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

module.exports = {
    createCreditor,
    getCreditors,
    getCreditorById,
    editCreditor,
    deleteCreditor
}