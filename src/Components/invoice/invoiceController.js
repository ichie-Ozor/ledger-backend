const APIError = require('../../utils/customError.js');
const invoiceService = require('./invoiceService.js')

const {
    createInvoiceService,
    getAllInvoiceService,
    getOneInvoiceService,
    deleteOneInvoiceService,
} = invoiceService

const createInvoice = async (req, res, next) => {
    console.log(req.body, "body backend")
    const data = req.body
    const successSave = []
    const errorSave = []
    for (let i = 0; data.length > 0; i++) {
        console.log(data[i], "each data")
        try {
            const {
                businessId,
                invoiceId,
                creditorId,
                date,
                paymentMethod,
                businessPhone,
                creditorPhone,
                businessName,
                ownerName,
                creditorName,
                description,
                category,
                qty,
                rate,
                unit,
                total
            } = data[i]
            if (
                !businessId ||
                !invoiceId ||
                !creditorId ||
                !date ||
                !paymentMethod ||
                !businessPhone ||
                !creditorPhone ||
                !businessName ||
                !ownerName ||
                !creditorName ||
                !description ||
                !category ||
                !qty ||
                !rate ||
                !unit ||
                !total
            ) {
                return next(APIError.badRequest('Please supply all the invoice details required'))
            }

            const createdInvoice = await createInvoiceService(req.body)
            console.log(createdInvoice, "invoice created")
            successSave.push({
                createdInvoice
            })

        } catch (error) {
            errorSave.push(next(APIError.customError(error.message)))
        }
    }
    if (errorSave.length > 0) {
        res.status(400).json({
            success: false,
            message: "Invoice not created successfully"
        })
    } else {
        res.status(200).json({
            success: true,
            message: "Invoice created successfully",
            successSave
        })
    }
}

module.exports = {
    createInvoice
}