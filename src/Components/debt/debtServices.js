import { Debt } from "../../models/debtModel.js";
import { Types } from "mongoose";

export const createDebtService = async(data) => {
    const newDebt = await Debt.create(data)
    return newDebt
}

export const getDebtsService = async() => {
    const debts = await Debt.find()
    return debts
}

export const getDebtsByIdService = async(id) => {
    const debt = await Debt.findById(id)
    return debt
}

export const getDebtsByDebtorIdService = async(debtorId) => {
    const debts = await Debt.find({debtorId: new Types.ObjectId(debtorId)})
    return debts
}

export const editDebtService = async(id, data) => {
    const updatedDebt = await Debt.findByIdAndUpdate(id, data)
    return updatedDebt
}

export const deleteDebtService = async(id) => {
    const deletedDebt = await Debt.findByIdAndDelete(id)
    return deletedDebt
}