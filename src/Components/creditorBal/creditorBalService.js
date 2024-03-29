import { CreditorBal } from "../../models/creditorBalModal.js";
import { Types } from "mongoose";


export const createCreditorBalService = async(data) => {
    const newCreditorBal = await CreditorBal.create(data)
    return newCreditorBal
}

export const getCreditorBalService = async() => {
    const creditorBals = await CreditorBal.find()
    return creditorBals
} 

export const getCreditorBalByIdService = async(id) => {
    const creditorBal = await CreditorBal.findById(id)
    return creditorBal
}

export const getCreditorBalByCreditorIdService = async(creditorId) => {
    const creditorBal = await CreditorBal.find({creditor: new Types.ObjectId(creditorId)})
    return creditorBal
}

export const editCreditorBalService = async(id, data) => {
    const updatedCreditorBal = await CreditorBal.findByIdAndUpdate(id, data)
    return updatedCreditorBal
}

export const deleteCreditorBalService = async(id) => {
    const deletedCreditorBal = await CreditorBal.findByIdAndDelete(id)
    return deletedCreditorBal
}