const express = require('express');
const profileController = require('./profileController.js')
const upload = require("../../middleware/upload.js")
const {
    createProfile,
    getAllProfileController,
    getOneProfileByIdController,
    getProfileByIdController,
    getFileByIdController,
    editProfileController,
    deleteProfile
} = profileController;

const profileRoute = express.Router();

profileRoute.route("/").post(upload.single("file"), createProfile).get(getAllProfileController)
profileRoute.route("/file/:id").get(getFileByIdController)
profileRoute.route("/:id").put(editProfileController).delete(deleteProfile).get(getOneProfileByIdController)
profileRoute.route("/:accountId/:password").get(getProfileByIdController)

module.exports = profileRoute;