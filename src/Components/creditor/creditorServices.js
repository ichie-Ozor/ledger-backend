import { Creditor } from "../../models/creditorModel.js";


export const createCreditorService = async(data) => {
    const newCreditor = await Creditor.create(data)
    return newCreditor
}

export const getCreditorsService = async() => {
    const creditors = await Creditor.find()
    return creditors
}

export const getCreditorsByIdService = async(id) => {
    const creditor = await Creditor.findById(id)
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