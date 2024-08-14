const Creditor = require("../../models/creditorModel.js");
const Types = require("mongoose");


const createCreditorService = async (data) => {
    const newCreditor = await Creditor.create(data)
    return newCreditor
}

const getCreditorsService = async () => {
    const creditors = await Creditor.find()
    return creditors
}

const getCreditorsByIdService = async (id) => {
    const creditor = await Creditor.find({ createdBy: new Types.ObjectId(id) })
    // console.log(creditor)
    return creditor
}

const editCreditorService = async (id, data) => {
    try {
        const updatedCreditor = await Creditor.findByIdAndUpdate(
            { _id: id },
            { $set: data },
            { new: true }
        )
        return updatedCreditor
    } catch (error) {
        console.error('Error occured trying to update the creditors', error)
        throw error
    }
}

const deleteCreditorService = async (id) => {
    const deletedCreditor = await Creditor.findByIdAndDelete(id)
    return deletedCreditor
}

module.exports = {
    createCreditorService,
    getCreditorsService,
    getCreditorsByIdService,
    editCreditorService,
    deleteCreditorService
}