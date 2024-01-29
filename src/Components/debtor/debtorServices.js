import { Debtor } from "../../models/debtModel.js";

export const createDebtorService = async(data) => {
    const newCredit = await Debtor.create(data)
    return newCredit
}

export const getDebtorsService = async() => {
    const debtors = await Debtor.find()
    return debtors
}

export const getDebtorsByIdService = async(id) => {
    const debtor = await Debtor.findById(id)
    return debtor
}

export const editDebtorService = async(id, data) => {
    const updatedDebtor = await Debtor.findByIdAndUpdate(id, data)
    return updatedDebtor
}

export const deleteDebtorService = async(id) => {
    const deletedDebtor = await Debtor.findByIdAndDelete(id)
    return deletedDebtor
}