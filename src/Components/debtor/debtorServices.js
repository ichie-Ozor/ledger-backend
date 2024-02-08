import { Debtor } from "../../models/debtorModel.js";

export const createDebtorService = async(data) => {
    const newDebtor = await Debtor.create(data)
    return newDebtor
}

export const getDebtorsService = async() => {
    const creditors = await Debtor.find()
    return creditors
}

export const getDebtorsByIdService = async(id) => {
    const creditor = await Debtor.findById(id)
    return creditor
}

export const editDebtorService = async(id, data) => {
    const updatedDebtor = await Debtor.findByIdAndUpdate(id, data)
    return updatedDebtor
}

export const deleteDebtorService = async(id) => {
    const deletedDebtor = await Debtor.findByIdAndDelete(id)
    return deletedDebtor
}

export const emailExistService = (email) => {
    return Debtor.exists({email})
}