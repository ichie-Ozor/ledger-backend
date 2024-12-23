const Invoice = require("../../models/invoiceModel.js")
const { Types } = require('mongoose');

const createInvoiceService = async (data) => {
    const createdInvoice = await Invoice.create(data)
    console.log(createdInvoice, "service", data)
    return createdInvoice
}

const getAllInvoiceService = async (id) => {
    const allInvoice = await Invoice.find({ businessId: new Types.ObjectId(id) })
    return allInvoice
}

const getOneInvoiceService = async (id) => {
    const OneInvoice = await Invoice.find({ creditorId: new Types.ObjectId(id) })
    return OneInvoice
}

const deleteOneInvoiceService = async (id) => {
    const deleteOne = await Invoice.findByIdAndDelete(id)
    return deleteOne
}


module.exports = {
    createInvoiceService,
    getAllInvoiceService,
    getOneInvoiceService,
    deleteOneInvoiceService,
}