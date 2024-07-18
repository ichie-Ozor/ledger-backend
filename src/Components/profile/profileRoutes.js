import express from 'express'
import {
    createProfile,
    getAllProfileController,
    getProfileByIdController,
    editProfileController,
    deleteProfile
} from './profileController.js';

export const profileRoute = express.Router();

profileRoute.route("/").post(createProfile).get(getAllProfileController)
profileRoute.route("/:id").put(editProfileController).delete(deleteProfile)
profileRoute.route("/:accountId/:password").get(getProfileByIdController)