const express = require('express');
const profileController = require('./profileController.js')
const {
    createProfile,
    getAllProfileController,
    getOneProfileByIdController,
    getProfileByIdController,
    editProfileController,
    deleteProfile
} = profileController;

const profileRoute = express.Router();

profileRoute.route("/").post(createProfile).get(getAllProfileController)
profileRoute.route("/:id").put(editProfileController).delete(deleteProfile).get(getOneProfileByIdController)
profileRoute.route("/:accountId/:password").get(getProfileByIdController)

module.exports = profileRoute;