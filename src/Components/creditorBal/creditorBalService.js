const CreditorBal = require("../../models/creditorBalModal.js");
const { Types } = require("mongoose");


const createCreditorBalService = async (data) => {
    const newCreditorBal = await CreditorBal.create(data)
    return newCreditorBal
}

const getCreditorBalService = async () => {
    const creditorBals = await CreditorBal.find()
    return creditorBals
}

const getCreditorBalByIdService = async (id) => {
    const creditorBal = await CreditorBal.find({ businessId: new Types.ObjectId(id) })
    return creditorBal
}

const getCreditorBalByCreditorIdService = async (creditorId) => {
    const creditorBal = await CreditorBal.find({ creditorId: new Types.ObjectId(creditorId) })
    return creditorBal
}

const editCreditorBalService = async (id, data) => {
    const updatedCreditorBal = await CreditorBal.findByIdAndUpdate(id, data)
    return updatedCreditorBal
}

const deleteCreditorBalService = async (id) => {
    const deletedCreditorBal = await CreditorBal.findByIdAndDelete(id)
    return deletedCreditorBal
}

const deleteManyCreditorBalService = async (id) => {
    const deletedCreditBal = await CreditorBal.deleteMany({ creditorId: id })
    return deletedCreditBal
}

module.exports = {
    createCreditorBalService,
    getCreditorBalService,
    getCreditorBalByIdService,
    getCreditorBalByCreditorIdService,
    editCreditorBalService,
    deleteCreditorBalService,
    deleteManyCreditorBalService
}