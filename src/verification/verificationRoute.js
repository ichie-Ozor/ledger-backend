import express from 'express'
import { 
    emailLinkController, 
    sendVerificationEmailController,
    filePageRoute 
} from './verificationController.js'

export const verificationRouter = express.Router()

verificationRouter.route("/user").post(sendVerificationEmailController)
verificationRouter.route("/verifed").get(filePageRoute) 
verificationRouter.route("/verify/:id/:uniqueString").get(emailLinkController)