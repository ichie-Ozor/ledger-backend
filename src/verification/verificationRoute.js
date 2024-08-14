const express = require('express');
const verificationController = require('./verificationController.js')
const verificationService = require('./verificationService.js')


const {
    emailLinkController,
    sendVerificationEmailController,
    filePageRoute
} = verificationController

const {
    emailLinkService,
    sendVerificationService,
    forgetPasswordEmailLinkService
} = verificationService

const verificationRouter = express.Router()

verificationRouter.route("/user").post(sendVerificationService)
verificationRouter.route("/verifed").get(filePageRoute)
verificationRouter.route("/verify/:id/:uniqueString").get(emailLinkService)
verificationRouter.route("/:password/:id/:uniqueString").get(forgetPasswordEmailLinkService)

module.exports = { verificationRouter }