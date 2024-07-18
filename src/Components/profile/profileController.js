import {
    createProfileService,
    getAllProfileService,
    getProfileByIdService,
    editProfileService,
    deleteProfileService,
    profileExistService
} from './profileService.js'
import bcrypt from "bcryptjs";
import APIError from '../../utils/customError.js'


export const createProfile = async(req, res, next) => {
    console.log(req.body)
    const {account, firstName, lastName, businessName, password } = req.body
    if(!firstName || !lastName || !businessName || !password ){
        return res.json({
            status: "Failed",
            message: "Incomplete credentials, Please complete the profile inputs"
        })
    } else if(!/^[a-zA-Z ]*$/.test(firstName)){
        res.json({
            status: "Failed",
            message: "Invalid first name entered"
        })
    } else if(!/^[a-zA-Z ]*$/.test(lastName)){
        res.json({
            status: "Failed",
            message: "Invalid last name entered"
        })
    } else if(password.length < 5){
        res.json({
            status: "Failed",
            message: "Password is too small"
        })
    }

    const profileExist = await profileExistService(account)
    if(profileExist){
        return res.json({
            status: "failed",
            message: "An profile with this account already exist"
        })
    }
    const newProfile = await createProfileService(req.body)
    if(newProfile){
        res.json({
            status: 200,
            message: "Profile created Successfully",
            newProfile
        })
    } else (
        res.json({
            status: "failed",
            message: "Profile creation failed"
        })
    )
}

////////////get all profile
export const getAllProfileController = async(req, res) => {
    try{
        const allProfileAccount = await getAllProfileService()
        res.json({
            status: "Success",
            message: "All profile has being fetched sucessfully",
            allProfileAccount
        })
    } catch(error){
        res.json({
            status: "failed",
            message: "Internal server error"
        })
    }
}

//////////////get a profile by Id
export const getProfileByIdController = async(req, res) => {
   const {accountId, password} = req.params
   
    const getProfile = await getProfileByIdService(accountId)

    const comparePassword = await bcrypt.compare(password, getProfile[0].password)

    if(comparePassword){
    res.json({
        status: "Success",
        message: "Profile retrieved successfully",
    })
   } else {
    res.json({
        status: "failed",
        message: "Sorry we could not get the profile you seek"
    })
   }
}

export const editProfileController = async(req, res, next) => {
    const {id} = req.params
    if(!id){
        return next(APIError.badRequest("Profile id required"))
    }
    try{
        const findProfile = await getProfileByIdService(id)
        if(!findProfile){
            return next(APIError.notFound("Account not found"))
        }
        const updatedProfile = await editProfileService(id, req.body)
        res.status(200).json({
            success: true,
            message: "Profile udate successful",
        })
    } catch (error) {
        next(APIError.badRequest(error.message))
    }
}

export const deleteProfile = async(req, res, next) => {
    const {id} = req.params
    if(!id) {
        return next(APIError.badRequest("Profile ID is required"))
    }
    try {
        const findProfile = await getProfileByIdService(id)
        if(!findProfile){
            return next(APIError.badRequest("PRofile not found"))
        }
        const deletedProfile = await deleteProfileService(id, req.body)
        res.status(200).json({
            success: true,
            message:"Profile deleted successfully"
        })
    } catch(err){
        next(APIError.customError(err.message))
    }
}