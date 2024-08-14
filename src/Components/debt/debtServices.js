const { Debt } = require("../../models/debtModel.js");
const { Types } = require("mongoose");

const createDebtService = async (data) => {
    const newDebt = await Debt.create(data)
    return newDebt
}

const getDebtsService = async () => {
    const debts = await Debt.find()
    return debts
}

const getDebtsByIdService = async (id) => {
    const debt = await Debt.findById(id)
    return debt
}

const getDebtsByDebtorIdService = async (debtorId) => {
    const debts = await Debt.find({ debtorId: new Types.ObjectId(debtorId) })
    return debts
}

const editDebtService = async (id, data) => {
    const updatedDebt = await Debt.findByIdAndUpdate(id, data)
    return updatedDebt
}

const deleteDebtService = async (id) => {
    const deletedDebt = await Debt.findByIdAndDelete(id)
    return deletedDebt
}

const deleteManyDebtService = async (id) => {
    const deletedItems = await Debt.deleteMany({ debtorId: id })
    return deletedItems
}

module.exports = {
    createDebtService,
    getDebtsService,
    getDebtsByIdService,
    getDebtsByDebtorIdService,
    editDebtService,
    deleteDebtService,
    deleteManyDebtService
}