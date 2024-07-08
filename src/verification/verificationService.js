import { VerificationModel } from "../models/verificationModel";
import { sendMail } from "../utils/sendMail";
import bycryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid';
import {path} from 'path'


export const sendVerificationService = async(body, res) => {
    const {_id, email} = body
 //url to be used in the email
 const currentUrl = "http://localhost:8080/";    //if it is hosted, this should change
 const uniqueString = uuidv4() + _id
const salt = bycryptjs.genSaltSync(10)
const hashedUniquString = bycryptjs.hashSync(uniqueString, salt)

 let subject = "Verify your Email";
 let text = `<p>Verify your email address to complete the signup and login into your account.</p>
 <p>this link <b>expires in 6 hours</b>.</p>
 <p>Press <a href=${currentUrl + "/verification/verify/" + _id + "/" + uniqueString}>here</a> to proceed.</p>`

 const newVerification = new VerificationModel({
    userId: _id,
    uniqueString: hashedUniquString,
    createdAt: Date.now(),
    expiresAt: Date.now() +21600000
 })

 newVerification
 .save()
 .then(() => {
    sendMail(email, subject, text)
    res.json({
        status: "PENDING",
        message: "Verification email sent, please check your email"
    })
 })
 .catch((error) => {
    res.status(400).json({
        message: "Verification email failed"
    })
 })
}



export const emailLinkService = async(req, res) => { //this is the router that will respond when they click on the link in their email
  const { userId, uniqueString} = req.params
  await VerificationModel.find({userId})
  .then((result) => {
   if(result.length > 0 ){
     //user verification record exists so we proceed
     const {expiresAt} = result[0]
     const hashedUniquString = result[0].uniqueString
     //checking for expired unique string
     if(expiresAt < Date.now()){
      //record has expired so we delete it
      VerificationModel
      .deleteOne({userId})
      .then((result) => {
         console.log(result)
         //if you want to delete the user account, do it here
      })
      .catch((error) => {
         console.log(error)
         let message = "An error occured while clearing user verification record"
         res.redirect(`/verification/verifed/error=true&message=${message}`)
      })
     }else {
      //valid record exist so we validate the user string
      //first compare the hashed unique string
      bycryptjs
      .compare(uniqueString, hashedUniquString)
      .then(result => {
         if(result){
            //string match

            console.log("unique string matched")
            // you can update the user verification in the account medel to true here
            // Account
            // .updateOne({_id: userId}, {verified: true})
            // .then(() => {
            //    VerificationModel
            //    .deleteOne({userId})
            //    .then(() => {
            //       res.sendFile(path.join(__dirname, "./../views/verified.html"))
            //    })
            //    .catch(error => {
            //       console.log(error)
            //       let message = "An error occured while finalising verification"
            //       res.redirect(`/verification/verifed/error=true&message=${message}`)
            //    })
            // })
            // .catch(error => {
            //    console.log(error)
            //    let message = "An error occured while checking for existing user verification record"
            //    res.redirect(`/verification/verifed/error=true&message=${message}`)
            // })

         } else {
            //existing record but incorrect verification details passed
            let message = "Invalid verification record passed, check your inbox"
            res.redirect(`/verification/verifed/error=true&message=${message}`)
         }
      })
      .catch(error => {
         let message = "An error occured while checking for existing user verification record"
         res.redirect(`/verification/verifed/error=true&message=${message}`)
      })
     }
   } else {
      let message = "Account record either do not exist or has already being verified. Please sign up or log in"
      res.redirect(`/verification/verifed/error=true&message=${message}`)
   }
  })
  .catch((error) => {
   console.log(error)
   let message = "An error occured while checking for existing user verification record"
   res.redirect(`/verification/verifed/error=true&message=${message}`)  //this is the url that will point to the html verified page
  })
}

//this is a route for the file, it is also a get method
export const filePageRoute = (req, res) => {
  res.sendFile(path.join(__dirname, "./../views/verified.html"))
}
