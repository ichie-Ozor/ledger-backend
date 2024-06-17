import { ProfileModel } from "../../models/profileModel.js";
import { Types } from "mongoose";
import bycryptjs from 'bcryptjs'

export const createProfileService = async(data) => {
    const ownerProfile = new ProfileModel(data)
    const salt = bycryptjs.genSaltSync(10)
    const hashedPassword = bycryptjs.hashSync(data.password, salt)
    ownerProfile.password = hashedPassword
    await ownerProfile.save().then(result => {
        console.log(result)
    })
    return ownerProfile
}

////////////if the profile exist
export const profileExistService = async(account) => {
    const findProfile = await ProfileModel.find({account: new Types.ObjectId(account)})
    if(!findProfile || !findProfile.businessName){
     return false 
    } else {
     return true
    }
 }

export const getAllProfileService = async() => {
    const owners = await ProfileModel.find()
    return owners
}

export const getProfileByIdService = async (id) => {
    const owners = await ProfileModel.find({account: new Types.ObjectId(id)})
    return owners 
} 

export const editProfileService = async (id, data) => {
    console.log(id, data, "data")
    const updatedOwner = await ProfileModel.findByIdAndUpdate(id, data)
    console.log(updatedOwner, "update")
    return updatedOwner
}

export const deleteProfileService = async (id) => {
    const deletedProfile = await ProfileModel.findByIdAndDelete(id)
    return deletedProfile
}