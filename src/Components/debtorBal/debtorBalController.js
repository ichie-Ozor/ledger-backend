import {
    createDebtorBalService,
    getDebtorBalService,
    getDebtorBalByIdService,
    getDebtorBalByDebtorService,
    editDebtorBalService,
    deleteDebtorBalService
} from './debtorBalService.js'
import APIError from '../../utils/customError.js'

export const createDebtorBal = async(req, res, next) => {
    console.log(req.body, "us")
    try{
        const {businessId, balance, debtorId, firstName, lastName, paid, phoneNumber, purchase} =  req.body
        if(!businessId || !balance || !debtorId || !firstName || !lastName || !paid || !phoneNumber || !purchase){
            return next(APIError.badRequest('Please supply all the payment details of the debtor'))
        }
        const newDebtorBal = await createDebtorBalService(req.body)
        res.status(200).json({
            success: true,
            message: "Debtor Balance created successfully",
            DebtorBal: newDebtorBal
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

export const getDebtorBal = async(req, res, next) => {
    try{
        const debtorBal = await getDebtorBalService()
        if(!debtorBal){
            return next(APIError.notFound("This Debtor Balance was not found"))
        }
        res.status(200).json({
            success: true,
            message: "Debtor Balance retrieved successfully",
            debtorBal
        })
    } catch(error) {
        next(APIError.customError(error.message))
    }
}

export const getDebtorBalById = async(req, res, next) => {
    const {id} = req.body
    if(!id){
        return next(APIError.badRequest("Debtor Id required"))
    }
    try{
        const findDebtorBal = await getDebtorBalByIdService(id)
        if(!findDebtorBal) {
            return next(APIError.notFound("This Debtor Bal not found"))
        }
        res.status(200).json({
            success: true,
            message: "Debtor Bal retirieved successfully",
            debtorBal: findDebtorBal
        })
    } catch(error) {
        next(APIError.customError(error.message))
    }
}

export const getDebtorBalByDebtorId = async(req, res, next) => {
    const {debtorId} = req.params
    if(!debtorId){
        return next(APIError.badRequest("Debtor Id required"))
    }
    try{
        const findDebtorBal = await getDebtorBalByDebtorService(debtorId)
        if(!findDebtorBal) {
            return next(APIError.notFound('Debtor not found'))
        }
        res.status(200).json({
            success: true,
            message: "debtor bal retrieved successfully",
            debtorBal: findDebtorBal
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

export const editDebtorBal = async(req, res, next) => {
    const {id} = req.body
    if(!id){
        return next(APIError.badRequest('debt Id required'))
    }
    try {
        const findDebtorBal = await getDebtorBalByIdService(id)
        if(!findDebtorBal){
            return next(APIError.notFound('creditor Bal not found'))
        }
        const updatedDebtorBal = await editDebtorBalService(id, req.body)
        res.status(200).json({
            success: true,
            message: "Debt bal update successfully",
            debtorBal: updatedDebtorBal
        })
    } catch(error) {
        next(APIError.customError(error.message))
    }
}


export const deleteDebtorBal = async(req, res, next) => {
    const {id} = req.body
    if(!id){
        return next(APIError.badRequest('creditor id not found'))
    }
    try{
        const deletedDebtorBal = await deleteDebtorBalService(id, req.body)
        res.status(200).json({
            success: true,
            message: "debtor Bal deleted successfully",
            deletedDebtorBal
        })
    } catch(error) {
        next(APIError.customError(error.message))
    }
}