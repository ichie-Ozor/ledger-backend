const debtServices = require('./debtServices.js');
const stockServices = require('../stock/stockServices.js');
const profileService = require('../profile/profileService.js')
const APIError = require('../../utils/customError.js');
const bcrypt = require('bcryptjs');
const Debt = require('../../models/debtModel.js');

const {
    createDebtService,
    editDebtService,
    getDebtsByIdService,
    getDebtsService,
    getDebtsByDebtorIdService,
    deleteDebtService
} = debtServices;
const {
    createStockService,
    editStocksService,
    findStockService,
    getStocksByIdService
} = stockServices;

const { getProfileByIdService } = profileService;

const createDebt = async (req, res, next) => {
    const incomingData = req.body
    console.log(req.body, "debt here")
    try {
        for (let i = 0; i < incomingData.length; i++) {
            const { businessId, debtorId, description, category, qty, rate, date } = incomingData[i];
            if (!businessId || !debtorId || !description || !category || !qty || !rate || !date) {
                return next(APIError.badRequest('Please supply all the required fields!'))
            }
            let price = 1.2 * rate
            const stock_entry = {
                account: businessId,
                goods: description,
                category,
                qty: Number(qty),
                cost: rate,
                sellingPrice: price
            }
            ///fetch stock from the backend
            const fetchStock = await findStockService(description, category, businessId)
            console.log(fetchStock, "from stock")
            ////check if the stock has the product and the price is the same, you add the qty only
            const sameStock = fetchStock.filter((item) => item.cost === rate)
            if (sameStock.length > 0 && fetchStock.length !== 0) {
                console.log(sameStock[0], "before")
                sameStock[0].qty += Number(qty);
                console.log(sameStock[0], "after")
            } else {
                ///if the price is not the same
                createStockService(stock_entry)
            }
            // 
            const newDebt = await createDebtService(incomingData[i])
            res.status(201).json({
                success: true,
                message: 'Debt created successfully!',
                Debt: newDebt
            })
        }
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

const getDebts = async (req, res, next) => {
    try {
        const Debts = await getDebtsService()
        if (!Debts) {
            return next(APIError.notFound('No Debt found!'))
        }
        res.status(200).json({
            success: true,
            message: 'Debts retrieved successfully!',
            Debts
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

const getDebtByDate = async (req, res, next) => {
    const { id } = req.params
    const { from, to } = req.body

    if (!from || !to) {
        return res.json({
            success: false,
            message: "Please provide all the informations needed for this search"
        })
    }
    try {
        const result = await Debt.find({
            date: {
                $gte: new Date(from),
                $lte: new Date(to)
            },
            debtorId: id
        })
        res.status(200).json({
            success: false,
            message: "Debt Filter successfully",
            filter: result
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later"
        })
    }
}

const getDebtById = async (req, res, next) => {
    const { id } = req.body
    if (!id) {
        return next(APIError.badRequest('Debt ID is required'))
    }
    try {
        const findDebt = await getDebtsByIdService(id)
        if (!findDebt) {
            return next(APIError.notFound('Debtnot found!'))
        }
        res.status(200).json({
            success: true,
            message: 'Debt retrieved successfully!',
            Debt: findDebt
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

const getDebtsByDebtorId = async (req, res, next) => {
    const { debtorId } = req.params
    if (!debtorId) {
        return next(APIError.badRequest('Debt ID is required'))
    }
    try {
        const findDebt = await getDebtsByDebtorIdService(debtorId)
        if (!findDebt) {
            return next(APIError.notFound('Debt not found!'))
        }
        res.status(200).json({
            success: true,
            message: 'Debt retrieved successfully!',
            debts: findDebt
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

const editDebt = async (req, res, next) => {
    const { id } = req.body
    if (!id) {
        return next(APIError.badRequest('Debt ID is required'))
    }
    try {
        const findDebt = await getDebtsByIdService(id)
        if (!findDebt) {
            return next(APIError.notFound('Debt not found!'))
        }
        const updatedDebt = await editDebtService(id, req.body)
        res.status(200).json({
            success: true,
            message: 'Debt updated successfully!',
            Debt: updatedDebt
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

const deleteDebt = async (req, res, next) => {
    const { id, password } = req.params
    if (!id) {
        return next(APIError.badRequest('Debt ID is required'))
    }
    try {
        const findDebt = await getDebtsByIdService(id)
        if (!findDebt) {
            return next(APIError.notFound('Debtnot found!'))
        }

        const { description, category, businessId, qty } = findDebt
        const accountId = businessId.toString()

        const getProfileDetails = await getProfileByIdService(accountId)

        const comparePassword = await bcrypt.compare(password, getProfileDetails[0].password)

        if (!comparePassword) {
            return res.status(403).json({
                success: false,
                message: "you are not allowed to do this",
            })
        } else {
            //fetch the stock from DB
            const fetchStock = await getStocksByIdService(accountId)
            //filter the stock that has the same description and category
            const filtered_stock = fetchStock.filter((item) => item.goods === description && item.category === category)

            //update the qty
            filtered_stock[0].qty -= qty
            //isolate the id from the stock
            const _id = filtered_stock[0]._id.toString()

            //update the stock
            await editStocksService(_id, filtered_stock[0])
            await deleteDebtService(id)
            res.status(200).json({
                success: true,
                message: 'Debt deleted successfully!',
            })
        }
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

module.exports = {
    createDebt,
    getDebts,
    getDebtByDate,
    getDebtById,
    getDebtsByDebtorId,
    editDebt,
    deleteDebt
}