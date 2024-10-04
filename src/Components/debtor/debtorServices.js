const Debtor = require("../../models/debtorModel.js");

const createDebtorService = async (data) => {
    const newDebtor = await Debtor.create(data)
    return newDebtor
}

const getDebtorsService = async () => {
    const creditors = await Debtor.find()
    return creditors
}

const getDebtorsByIdService = async (id) => {
    console.log(id, "debtor service")
    const creditor = await Debtor.find({ createdBy: id })
    console.log(creditor, "debtorS")
    return creditor
}

const editDebtorService = async (id, data) => {
    try {
        const updatedDebtor = await Debtor.findByIdAndUpdate(
            { _id: id },
            { $set: data },
            { new: true }
        );
        return updatedDebtor
    } catch (error) {
        console.error('Error updating debtor', error)
        throw error
    }
}

const deleteDebtorService = async (id) => {
    const deletedDebtor = await Debtor.findByIdAndDelete(id)
    return deletedDebtor
}

const emailExistService = (email) => {
    return Debtor.exists({ email })
}

module.exports = {
    createDebtorService,
    getDebtorsService,
    getDebtorsByIdService,
    editDebtorService,
    deleteDebtorService,
    emailExistService
}