const salesService = require('./salesService.js')


const {
    createSalesService,
    editSalesService,
    getSalesByIdService,
    getSalesService,
    deleteSalesService
} = salesService
const { findStockService, getStocksByIdService, editStocksService } = require('../stock/stockServices.js');
const { getProfileByIdService } = require('../profile/profileService.js')
const APIError = require('../../utils/customError.js');
const Stock = require('../../models/stockModel.js')
const bcrypt = require('bcryptjs')

// const createSales = async (req, res, next) => {
//     try {
//         const incomingData = req.body
//         for (let i = 0; i < incomingData.length; i++) {
//             const { account, description, category, qty, rate, date } = incomingData[i];
//             if (!account || !description || !category || !qty || !rate || !date) {
//                 return next(APIError.badRequest('Please supply all the required fields!'))
//             }

//             let createSales = false
//             // import stock from the DB
//             //await getStocksByIdService(account)

//             const stock = await findStockService(description, category, account)

//             if (!stock || stock.length === 0) {
//                 return res.status(400).json({
//                     success: false,
//                     message: `The ${incomingData[i].description} description and category does not match what is in the stock`,
//                     sale: incomingData[i]
//                 })
//             }
//             if (stock[0].qty < qty) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "There is not enough quantity of this stock in the database",
//                     sale: incomingData[i]
//                 })
//             }
//             if (stock[0].qty >= qty) {
//                 let new_stock = await Stock.findById(stock[0]._id).exec()
//                 // new_stock.qty = stock[0].qty - qty
//                 // await new_stock.save()
//                 stock[0].qty -= qty

//                 // if stock.qty === 0, delete from the stock
//                 if (new_stock.qty === 0) {
//                     await Stock.findByIdAndDelete(new_stock._id)
//                     return res.status(400).json({
//                         success: false,
//                         message: 'This goods is finished from the stock'
//                     })
//                 }
//             }

//             // this one saves the incoming sale into the sales DB
//             const newSales = await createSalesService(incomingData)
//             res.status(201).json({
//                 success: true,
//                 message: 'Sales created successfully!',
//             })
//             createSales = true;
//             break;
//         }
//     } catch (error) {
//         // next(APIError.customError(error.message))
//         console.log(error)
//         return res.status(500).json({
//             success: false,
//             message: 'There was a problem creating this sales!'
//         })
//     }
// }

const createSales = async (req, res, next) => {
    try {
        const incomingData = req.body;
        const salesErrors = [];
        const successfulSales = [];

        console.log(req.body, "bodyyyyyyy")
        for (let i = 0; i < incomingData.length; i++) {
            const { account, description, category, qty, rate, date } = incomingData[i];

            if (!account || !description || !category || !qty || !rate || !date) {
                salesErrors.push({ sale: incomingData[i], message: 'Please supply all required fields' });
                continue;
            }

            // Find the stock
            const stock = await findStockService(description, category, account);
            console.log(stock, "stockkkkkk")

            if (!stock || stock.length === 0) {
                salesErrors.push({
                    sale: incomingData[i],
                    message: `The ${description} description and category does not match stock`
                });
                continue;
            }

            if (stock[0].qty < qty) {
                salesErrors.push({
                    sale: incomingData[i],
                    message: "Not enough quantity in stock"
                });
                continue;
            }

            // Update stock quantity
            // stock[0].qty -= qty;

            // Fetch the stock by ID to update in the DB
            let new_stock = await Stock.findById(stock[0]._id).exec();
            new_stock.qty = stock[0].qty - qty
            console.log(new_stock, "new stockkkk")

            // Save the updated stock
            if (new_stock.qty === 0) {
                await Stock.findByIdAndDelete(new_stock._id);
            } else {
                await new_stock.save();
            }

            // Save the sale
            await createSalesService(incomingData[i]);
            successfulSales.push(incomingData[i]);
        }

        if (salesErrors.length > 0) {
            return res.status(207).json({
                success: false,
                message: "Some sales encountered issues",
                errors: salesErrors,
                successfulSales
            });
        }

        return res.status(201).json({
            success: true,
            message: 'All sales created successfully!',
            sales: successfulSales
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'There was a problem creating the sales!'
        });
    }
};


const getSales = async (req, res, next) => {
    try {
        const sales = await getSalesService()
        if (!sales) {
            return next(APIError.notFound('No creditor found!'))
        }
        res.status(200).json({
            success: true,
            message: 'Saless retrieved successfully!',
            sales
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

const getSalesById = async (req, res, next) => {
    const { id } = req.params
    if (!id) {
        return next(APIError.badRequest('Sales ID is required'))
    }
    try {
        const findSales = await getSalesByIdService(id)
        if (!findSales) {
            return next(APIError.notFound('Sales not found!'))
        }
        res.status(200).json({
            success: true,
            message: 'Sales retrieved successfully!',
            sales: findSales
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

const editSales = async (req, res, next) => {
    const { id } = req.body
    if (!id) {
        return next(APIError.badRequest('Sales ID are is required'))
    }
    try {
        const findSales = await getSalesByIdService(id)
        if (!findSales) {
            return next(APIError.notFound('Sales not found!'))
        }
        const updatedSales = await editSalesService(id, req.body)
        res.status(200).json({
            success: true,
            message: 'Sales updated successfully!',
            sales: updatedSales
        })
    } catch (error) {
        next(APIError.customError(error.message))
    }
}

const deleteSales = async (req, res, next) => {
    const id = req.body[0]._id
    const { password } = req.params
    if (!id) {
        return next(APIError.badRequest('Sales ID is required'))
    }

    try {
        const findSales = await getSalesByIdService(id)
        if (!findSales) {
            return next(APIError.notFound('Sales not found!'))
        }
        const { account, qty, description, category } = findSales
        const accountId = account.toString()
        const getProfileDetails = await getProfileByIdService(accountId)

        const comparePassword = await bcrypt.compare(password, getProfileDetails[0].password)
        if (!comparePassword) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to do this!"
            })
        } else {
            //fetch the stock
            const fetchStock = await getStocksByIdService(accountId)
            //filter the stock
            const filtered_stock = fetchStock.filter((item) => item.goods === description && item.category === category)
            if (filtered_stock.length === 0) {
                const newStockItem = JSON.parse(JSON.stringify(req.body[0]));
                filtered_stock.push(newStockItem);
            } else {
                //update the qty
                filtered_stock[0].qty += qty
                const _id = filtered_stock[0]._id.toString()
                //update the stock
                await editStocksService(_id, filtered_stock[0])
            }
            await deleteSalesService(id)
            res.status(200).json({
                success: true,
                message: 'Sales deleted successfully!',
                sales: deleteSales
            })
        }

    } catch (error) {
        next(APIError.customError(error.message))
    }
}

module.exports = {
    createSales,
    getSales,
    getSalesById,
    editSales,
    deleteSales
}