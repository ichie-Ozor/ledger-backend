import express from 'express'
import { 
    emailLinkController, 
    sendVerificationEmailController,
    filePageRoute 
} from './verificationController.js'

import {
    emailLinkService,
    sendVerificationService,
    forgetPasswordEmailLinkService
} from './verificationService.js'

export const verificationRouter = express.Router()

verificationRouter.route("/user").post(sendVerificationService)
verificationRouter.route("/verifed").get(filePageRoute) 
verificationRouter.route("/verify/:id/:uniqueString").get(emailLinkService)
verificationRouter.route("/:password/:id/:uniqueString").get(forgetPasswordEmailLinkService)