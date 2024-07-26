import { Credit } from "../../models/creditModel.js";
import {Types} from "mongoose";

export const createCreditService = async(data) => {
    const newCredit = await Credit.create(data)
    return newCredit
}

export const getCreditsService = async() => {
    const creditors = await Credit.find()
    return creditors
}

export const getCreditsByIdService = async(id) => {
    const creditor = await Credit.findOne({_id: new Types.ObjectId(id)})
    return creditor
}

export const getCreditsByCreditorIdService = async(creditorId) => {
    const credits = await Credit.find({creditorId: new Types.ObjectId(creditorId)})
    // const credits = await Credit.find({creditorId: creditorId})
    // console.log(credits, "see am")
    return credits
}

export const editCreditService = async(id, data) => {
    const updatedCredit = await Credit.findByIdAndUpdate(id, data)
    return updatedCredit
}

export const deleteCreditService = async(value) => {
    const { _id} = value
    const deletedCredit = await Credit.findByIdAndDelete(_id)
    return deletedCredit
}

export const deleteManyCreditService = async(id) => {
    const deletedItems = await Credit.deleteMany({creditorId: id})
    return deletedItems
}