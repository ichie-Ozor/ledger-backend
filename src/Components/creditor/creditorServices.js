import { Creditor } from "../../models/creditorModel.js";
import { Types } from "mongoose";


export const createCreditorService = async(data) => {
    const newCreditor = await Creditor.create(data)
    return newCreditor
}

export const getCreditorsService = async() => {
    const creditors = await Creditor.find()
    return creditors
}

export const getCreditorsByIdService = async(id) => {
    const creditor = await Creditor.find({createdBy: new Types.ObjectId(id)})
    // console.log(creditor)
    return creditor
}

export const editCreditorService = async(id, data) => {
    try{
    const updatedCreditor = await Creditor.findByIdAndUpdate(
        {_id: id},
        {$set: data}, 
        {new: true}
    )
    return updatedCreditor
    } catch(error) {
        console.error('Error occured trying to update the creditors', error)
        throw error
    }
}

export const deleteCreditorService = async(id) => {
    const deletedCreditor = await Creditor.findByIdAndDelete(id)
    return deletedCreditor
}