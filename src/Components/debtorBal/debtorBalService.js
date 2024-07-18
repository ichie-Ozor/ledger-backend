import { DebtorBal } from "../../models/DebtorBalModel.js";
import { Types } from 'mongoose';

export const createDebtorBalService = async(data) => {
    const newDebtorBal = await DebtorBal.create(data)
    return newDebtorBal
}

export const getDebtorBalService = async() => {
    const debtorBals = await DebtorBal.find()
    return debtorBals
}

export const getDebtorBalByIdService = async(id) => {
    const debtorBal = await DebtorBal.find({businessId: new Types.ObjectId(id)})
    return debtorBal
}

export const getDebtorBalByDebtorService = async(debtorId) => {
    const debtorBal = await DebtorBal.find({debtorId: new Types.ObjectId(debtorId)})
    return debtorBal
}

export const editDebtorBalService = async(id, data) => {
    const updatedDebtorBal = await DebtorBal.findByIdAndUpdate(id, data)
    return updatedDebtorBal
}

export const deleteDebtorBalService = async(id) => {
    const deletedDebtorBal = await DebtorBal.findByIdAndDelete(id)
    return deletedDebtorBal
}

export const deleteManyDebtorBalService = async(id) => {
    const deleteDebtorBal = await DebtorBal.deleteMany({debtorId: id})
    return deleteDebtorBal;
}