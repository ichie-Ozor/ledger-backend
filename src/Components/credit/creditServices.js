import { Credit } from "../../models/creditModel";

export const createCreditService = async(data) => {
    const newCredit = await Credit.create(data)
    return newCredit
}

export const getCreditsService = async() => {
    const creditors = await Credit.find()
    return creditors
}

export const getCreditsByIdService = async(id) => {
    const creditor = await Credit.findById(id)
    return creditor
}

export const editCreditService = async(id, data) => {
    const updatedCredit = await Credit.findByIdAndUpdate(id, data)
    return updatedCredit
}

export const deleteCreditService = async(id) => {
    const deletedCredit = await Credit.findByIdAndDelete(id)
    return deletedCredit
}