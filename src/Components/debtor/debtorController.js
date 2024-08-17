const APIError = require('../../utils/customError.js');
const bcrypt = require("bcryptjs");
const debtorServices = require('./debtorServices.js')

const {
    createDebtorService,
    editDebtorService,
    getDebtorsByIdService,
    getDebtorsService,
    deleteDebtorService,
    emailExistService
} = debtorServices

const { getProfileByIdService } = require('../profile/profileService.js');
const { deleteManyDebtService } = require('../debt/debtServices.js');
const { deleteManyDebtorBalService } = require('../debtorBal/debtorBalService.js');

const createDebtor = async (req, res, next) => {
    console.log(req.body)
    const { firstName, lastName, phoneNumber, businessName, createdBy } = req.body;
    if (!firstName || !lastName || !phoneNumber || !businessName || !createdBy) {
        return next(APIError.badRequest('Please supply all the required fields!'))
    }
    try {
        // const emailExist = await emailExistService(email)
        // if (emailExist) {
        //     return next(APIError.badRequest('Email already exists!'))
        // }
        const newDebtor = await createDebtorService(req.body)
        res.status(201).json({
            success: true,
            message: 'Debtor created successfully!',
            debtor: newDebtor
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

const getDebtors = async (req, res, next) => {
    try {
        const debtors = await getDebtorsService()
        if (!debtors) {
            return next(APIError.notFound('No debtor found!'))
        }
        res.status(200).json({
            success: true,
            message: 'Debtors retrieved successfully!',
            debtors
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

const getDebtorById = async (req, res, next) => {
    const { id } = req.params
    if (!id) {
        return next(APIError.badRequest('Debtor ID is required'))
    }
    try {
        const findDebtor = await getDebtorsByIdService(id)
        if (!findDebtor) {
            return next(APIError.notFound('Debtor not found!'))
        }
        res.status(200).json({
            success: true,
            message: 'Debtor retrieved successfully!',
            debtor: findDebtor
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

const editDebtor = async (req, res, next) => {
    const { id } = req.params
    if (!id) {
        return next(APIError.badRequest('Debtor ID is required'))
    }
    try {
        const findDebtor = await getDebtorsByIdService(id)
        if (!findDebtor) {
            return next(APIError.notFound('Debtor not found!'))
        }
        await editDebtorService(id, req.body)
        res.status(200).json({
            success: true,
            message: 'Debtor updated successfully!',
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

const deleteDebtor = async (req, res, next) => {
    const { id, password, account } = req.params
    if (!id) {
        return next(APIError.badRequest('Debtor ID is required'))
    }
    try {
        const findDebtor = await getDebtorsByIdService(id)
        if (!findDebtor) {
            return next(APIError.notFound('Debtor not found!'))
        }
        ////////////fetch the profile
        const ownerProfile = await getProfileByIdService(account)
        //////compare the passwowrd from the req.body with that of the profile
        const comparePassword = await bcrypt.compare(password, ownerProfile[0].password)
        //////////if true, delete. if false, throw an error
        if (ownerProfile.length === 0) {
            return res.status(400).json({
                success: false,
                message: "You are not authorized to carry out ths action. You cant delete this!"
            })
        }
        if (!comparePassword) {
            return res.status(403).json({
                success: false,
                message: "Please put in the correct password, else you will not be able to delete"
            })
        }

        await deleteDebtorService(id)
        await deleteManyDebtService(id)
        await deleteManyDebtorBalService(id)
        res.status(200).json({
            success: true,
            message: 'Debtor deleted successfully!',
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

module.exports = {
    createDebtor,
    getDebtors,
    getDebtorById,
    editDebtor,
    deleteDebtor
}