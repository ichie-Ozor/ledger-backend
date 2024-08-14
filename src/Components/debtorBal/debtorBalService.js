const { DebtorBal } = require("../../models/DebtorBalModel.js");
const { Types } = require('mongoose');

const createDebtorBalService = async (data) => {
    const newDebtorBal = await DebtorBal.create(data)
    return newDebtorBal
}

const getDebtorBalService = async () => {
    const debtorBals = await DebtorBal.find()
    return debtorBals
}

const getDebtorBalByIdService = async (id) => {
    const debtorBal = await DebtorBal.find({ businessId: new Types.ObjectId(id) })
    return debtorBal
}

const getDebtorBalByDebtorService = async (debtorId) => {
    const debtorBal = await DebtorBal.find({ debtorId: new Types.ObjectId(debtorId) })
    return debtorBal
}

const editDebtorBalService = async (id, data) => {
    const updatedDebtorBal = await DebtorBal.findByIdAndUpdate(id, data)
    return updatedDebtorBal
}

const deleteDebtorBalService = async (id) => {
    const deletedDebtorBal = await DebtorBal.findByIdAndDelete(id)
    return deletedDebtorBal
}

const deleteManyDebtorBalService = async (id) => {
    const deleteDebtorBal = await DebtorBal.deleteMany({ debtorId: id })
    return deleteDebtorBal;
}

module.exports = {
    createDebtorBalService,
    getDebtorBalService,
    getDebtorBalByIdService,
    getDebtorBalByDebtorService,
    editDebtorBalService,
    deleteDebtorBalService,
    deleteManyDebtorBalService
}