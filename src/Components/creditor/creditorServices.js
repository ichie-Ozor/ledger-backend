import { CreditorModel } from "../../models/creditorModel.js";

export const createCreditorService = async(data) => {
    const newCreditor = await CreditorModel.create(data)
    return newCreditor
}

export const getCreditorsService = async() => {
    const creditors = await CreditorModel.find()
    return creditors
}

export const getCreditorsByIdService = async(id) => {
    const creditor = await CreditorModel.findById(id)
    return creditor
}

export const editCreditorService = async(id, data) => {
    const updatedCreditor = await CreditorModel.findByIdAndUpdate(id, data)
    return updatedCreditor
}

export const deleteCreditorService = async(id) => {
    const deletedCreditor = await CreditorModel.findByIdAndDelete(id)
    return deletedCreditor
}