import {
    createCreditorService, 
    editCreditorService, 
    getCreditorsByIdService, 
    getCreditorsService, 
    deleteCreditorService
} from './creditorServices.js'
import bcrypt from "bcryptjs";
import { getProfileByIdService } from '../profile/profileService.js';
import APIError from '../../utils/customError.js';

export const createCreditor = async(req, res, next) => {
    // console.log(req.body, "see me")
    const {firstName, lastName, phoneNumber, businessName, email, createdBy} = req.body;
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

export const getCreditors = async(req, res, next) => {
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

export const getCreditorById = async(req, res, next) => {
    console.log(req.params)
    const {id} = req.params
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

export const editCreditor = async(req, res, next) => {
    const {id} = req.params
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
            creditor: updatedCreditor
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

export const deleteCreditor = async(req, res, next) => {
    const {id, account, password} = req.params
    console.log(req.body, id, req.params, "delete creditor")
    if (!id) {
        return next(APIError.badRequest('Creditor ID is required'))
    }
    try {
        const findCreditor = await getCreditorsByIdService(id)
        if (!findCreditor) {
            return next(APIError.notFound('Creditor not found!'))
        }
        /////fetch the profile 
        const ownerProfile = await getProfileByIdService(account)
        console.log(ownerProfile, "owner profile")
        //////compare the password from the req..body with that of the profile
        const comparePassword = await bcrypt.compare(password, ownerProfile[0].password)
        console.log(comparePassword)
        /////if true, then delete, if false return an error 
        if(ownerProfile.length === 0 ){
            return res.status(400).json({
                success: false,
                message: "You are not authorized to carry out this action"
            })
        }
        if(!comparePassword){
            return res.status(403).json({
                success: false,
                message: "Please put in the correct password, else you will not be allowed to delete"
            })
        }
       
        const deletedCreditor = await deleteCreditorService(id, req.body)
        res.status(200).json({
            success: true,
            message: 'Creditor deleted successfully!',
            creditor: deletedCreditor
         })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}