const Credit = require("../../models/creditModel.js");
const { Types } = require("mongoose");

const createCreditService = async (data) => {
    const newCredit = await Credit.create(data)
    return newCredit
}

const getCreditsService = async () => {
    const creditors = await Credit.find()
    return creditors
}

const getCreditsByIdService = async (id) => {
    const creditor = await Credit.findOne({ _id: new Types.ObjectId(id) })
    return creditor
}

const getCreditsByCreditorIdService = async (creditorId) => {
    const credits = await Credit.find({ creditorId: new Types.ObjectId(creditorId) })
    // const credits = await Credit.find({ creditorId: creditorId })
    return credits
}

const editCreditService = async (id, data) => {
    const updatedCredit = await Credit.findByIdAndUpdate(id, data)
    return updatedCredit
}

const deleteCreditService = async (value) => {
    const { _id } = value
    const deletedCredit = await Credit.findByIdAndDelete(_id)
    return deletedCredit
}

const deleteManyCreditService = async (id) => {
    const deletedItems = await Credit.deleteMany({ creditorId: id })
    return deletedItems
}

module.exports = {
    createCreditService,
    getCreditsService,
    getCreditsByIdService,
    getCreditsByCreditorIdService,
    editCreditService,
    deleteCreditService,
    deleteManyCreditService
}