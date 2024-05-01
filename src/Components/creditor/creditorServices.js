import { Creditor } from "../../models/creditorModel.js";
import { Types } from "mongoose";


export const createCreditorService = async(data) => {
    const newCreditor = await Creditor.create(data)
    return newCreditor
}

export const getCreditorsService = async() => {
    const creditors = await Creditor.find()
    return creditors
}

export const getCreditorsByIdService = async(id) => {
    const creditor = await Creditor.find({createdBy: new Types.ObjectId(id)})
    // console.log(creditor)
    return creditor
}

export const editCreditorService = async(id, data) => {
    const updatedCreditor = await Creditor.findByIdAndUpdate(id, data, {new: true})
    return updatedCreditor
}

export const deleteCreditorService = async(id) => {
    const deletedCreditor = await Creditor.findByIdAndDelete(id)
    return deletedCreditor
}