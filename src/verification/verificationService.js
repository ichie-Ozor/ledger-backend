const VerificationModel = require("../models/verificationModel.js");
const accountServices = require("../account/accountServices.js")
const {
   getAccountById,
   editAccountService
} = accountServices
const { sendMail } = require("../utils/sendMail.js");
const { Types } = require("mongoose");
const bycryptjs = require('bcryptjs')
const { v4: uuidv4 } = require('uuid');
const path = require('path')
const { fileURLToPath } = require('url');
const { dirname } = require('path');


const sendVerificationService = async (req, res) => {

   const { _id, email } = req.body
   const currentUrl = "http://localhost:8080/";    //if it is hosted, this should change
   const uniqueString = uuidv4() + _id
   const salt = bycryptjs.genSaltSync(10)
   const hashedUniquString = bycryptjs.hashSync(uniqueString, salt)

   let subject = "Verify your Email";
   let text = `<p>Verify your email address to complete the signup and login into your account.</p>
 <p>this link <b>expires in 6 hours</b>.</p>
 <p>Press <a href=${currentUrl + "verification/verify/" + _id + "/" + uniqueString}>here</a> to proceed.</p>`

   const newVerification = new VerificationModel({
      userId: _id,
      uniqueString: hashedUniquString,
      createdAt: Date.now(),
      expiresAt: Date.now() + 21600000
   })

   newVerification
      .save()
      .then(() => {
         //  sendMail(email, subject, text)
         sendMail("simeon_mc2000@yahoo.com", subject, text)
         res.json({
            status: "PENDING",
            message: "Verification email sent, please check your email"
         })
      })
      .catch((error) => {
         res.status(400).json({
            error,
            message: "Verification email failed"
         })
      })
}

const emailLinkService = async (req, res) => { //this is the router that will respond when they click on the link in their email
   // const __filename = fileURLToPath(import.meta.url);
   const __filename = __filename
   const __dirname = dirname(__filename);
   const { id, uniqueString } = req.params

   await VerificationModel.find({ userId: new Types.ObjectId(id) })
      .then((result) => {
         if (result.length > 0) {
            const { expiresAt } = result[0]
            const hashedUniquString = result[0].uniqueString
            //checking for expired unique string
            if (expiresAt < Date.now()) {
               //record has expired so we delete it
               VerificationModel
                  .deleteOne({ userId: id })
                  .then(() => {
                     res.redirect(
                        `<div style="background-color: #000099; display: flex; align-items: center; justify-content: center; height: 100vh">
               <h1 style="display: flex; color: white; align-items: center; justify-content: center; height: 20vh">The Link you just clicked has expired as it has exceeded 6 hours since you generated it, <br/> Thank you 😀😀😀</h1>
            </div>`
                     )
                     //if you want to delete the user account, do it here
                  })
                  .catch((error) => {
                     console.log(error)
                     let message = "An error occured while clearing user verification record"
                     res.redirect(
                        `<div style="background-color: #000099; display: flex; align-items: center; justify-content: center; height: 100vh">
               <h1 style="display: flex; color: white; align-items: center; justify-content: center; height: 20vh">${message}</h1>
            </div>`
                     )
                  })
            } else {
               //valid record exist so we validate the user string
               //first compare the hashed unique string
               bycryptjs
                  .compare(uniqueString, hashedUniquString)
                  .then(result => {
                     if (result) {
                        //string match

                        console.log(result, "unique string matched")
                        VerificationModel
                           .deleteOne({ userId: id })
                           .then((result) => {
                              console.log(result, "delete verification")
                              res.sendFile(path.join(__dirname, "./../views/verified.html"))
                           })
                           .catch(error => {
                              console.log(error, "error hereeeeeeee")
                              let message = "An error occured while finalising verification"
                              res.redirect(
                                 `<div style="background-color: #000099; display: flex; align-items: center; justify-content: center; height: 100vh">
                        <h1 style="display: flex; color: white; align-items: center; justify-content: center; height: 20vh">${message}</h1>
                     </div>`
                              )
                           })

                        // you can update the user verification in the account model to true here
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
                        console.log("error is here at the end")
                        let message = "Invalid verification record passed, check your inbox"
                        res.redirect(
                           `<div style="background-color: #000099; display: flex; align-items: center; justify-content: center; height: 100vh">
                  <h1 style="display: flex; color: white; align-items: center; justify-content: center; height: 20vh">${message}</h1>
               </div>`
                        )
                     }
                  })
                  .catch(error => {
                     let message = "An error occured while checking for existing user verification record"
                     let encodedMessage = encodeURIComponent(message);
                     res.redirect(
                        `<div style="background-color: #000099; display: flex; align-items: center; justify-content: center; height: 100vh">
               <h1 style="display: flex; color: white; align-items: center; justify-content: center; height: 20vh">${encodedMessage}</h1>
            </div>`
                     )
                  })
            }
         } else {
            let message = "Account record either do not exist or has already being verified. Please sign up or log in"
            res.redirect(
               `<div style="background-color: #000099; display: flex; align-items: center; justify-content: center; height: 100vh">
            <h1 style="display: flex; color: white; align-items: center; justify-content: center; height: 20vh">${message}</h1>
         </div>`
            )
         }
      })
      .catch((error) => {
         console.log(error)
         let message = "An error occured while checking for existing user verification record"
         res.redirect(
            `<div style="background-color: #000099; display: flex; align-items: center; justify-content: center; height: 100vh">
         <h1 style="display: flex; color: white; align-items: center; justify-content: center; height: 20vh">${message}</h1>
      </div>`
         )  //this is the url that will point to the html verified page
      })
}

//this is a route for the file, it is also a get method
const filePageRoute = (req, res) => {
   res.sendFile(path.join(__dirname, "./../views/verified.html"))
}

const forgetPasswordEmailLinkService = async (req, res) => {
   // const __filename = fileURLToPath(import.meta.url);
   const __filename = __filename
   const __dirname = dirname(__filename);
   const { password, id, uniqueString } = req.params;
   console.log("Processing password reset");

   try {
      const verificationRecord = await VerificationModel.findOne({ userId: id });
      if (!verificationRecord) {
         return res.status(400).send(`
               <div style="background-color: #000099; display: flex; align-items: center; justify-content: center; height: 100vh">
                   <h1 style="color: white; text-align: center;">Account record does not exist or has already been verified. Please sign up or log in.</h1>
               </div>
           `);
      }

      const { expiresAt, uniqueString: hashedUniqueString } = verificationRecord;

      if (expiresAt < Date.now()) {
         await VerificationModel.deleteOne({ userId: id });
         return res.send(`
               <div style="background-color: #000099; display: flex; align-items: center; justify-content: center; height: 100vh">
                   <h1 style="color: white; text-align: center;">The link you clicked has expired as it has exceeded 6 hours since you generated it. Thank you 😊😊😊</h1>
               </div>
           `);
      }

      const isMatch = await bycryptjs.compare(uniqueString, hashedUniqueString);

      if (!isMatch) {
         throw new Error("Invalid verification link.");
      }

      const findAccount = await getAccountById(id);

      if (!findAccount) {
         return res.status(401).json({ message: "There is an issue with the account" });
      }

      // Hash the new password before saving
      //  const hashedPassword = await bcryptjs.hash(password, 10);
      findAccount.password = password;
      await editAccountService(findAccount._id, findAccount);

      await VerificationModel.deleteOne({ userId: id });

      res.sendFile(path.join(__dirname, "./../views/verified.html"));

   } catch (error) {
      console.error(error);
      res.status(500).send(`
           <div style="background-color: #000099; display: flex; align-items: center; justify-content: center; height: 100vh">
               <h1 style="color: white; text-align: center;">An error occurred while finalizing verification. Please try again later.</h1>
           </div>
       `);
   }
};

// const forgetPasswordEmailLinkService = async(req, res) => {
//    const __filename = fileURLToPath(import.meta.url);
//    const __dirname = dirname(__filename)
//    const {password, id, uniqueString} = req.params
//    console.log("forget password")

//    await VerificationModel.find({userId: new Types.ObjectId(id)})
//    .then((result) => {
//       if(result.length > 0){
//          const { expiresAt } = result[0]
//          const hashedUniquString = result[0].uniqueString

//          if(expiresAt < Date.now()){
//             VerificationModel
//             .deleteOne({userId: id})
//             .then(() => {
//                res.sendFile(
//                   `<div style="background-color: #000099; display: flex; align-items: center; justify-content: center; height: 100vh">
//                      <h1 style="display: flex; color: white; align-items: center; justify-content: center; height: 20vh">The Link you just clicked has expired as it has exceeded 6 hours since you generated it, <br/> Thank you 😀😀😀</h1>
//                   </div>`
//                )
//             })
//             .catch((error) => {
//                console.log(error)
//                let message = "An error occured while clearing user verification record"
//                res.sendFile(
//                   `<div style="background-color: #000099; display: flex; align-items: center; justify-content: center; height: 100vh">
//                      <h1 style="display: flex; color: white; align-items: center; justify-content: center; height: 20vh">${message}</h1>
//                   </div>`
//                )
//             })
//          } else {
//             bycryptjs
//             .compare(uniqueString, hashedUniquString)
//             .then(result => {
//                if(result){
//                   const findAccount = getAccountById(id)
//                   console.log(findAccount, "findAccount")
//                   if(!findAccount){
//                      res.status(401).json({
//                         message: "There is an issue with the account"
//                      })
//                   } else{
//                      findAccount.password = password
//                      editAccountService(findAccount._id, findAccount)
//                   }

//                   VerificationModel
//                   .deleteOne({userId: id})
//                   .then(() => {
//                      res.sendFile(path.join(__dirname, "./../views/verified.html"))
//                   })
//                   .catch(error => {
//                      let message = "An error occured while finalising verification"
//                      res.sendFile(
//                         `<div style="background-color: #000099; display: flex; align-items: center; justify-content: center; height: 100vh">
//                            <h1 style="display: flex; color: white; align-items: center; justify-content: center; height: 20vh">${message}</h1>
//                         </div>`
//                      )
//                   })
//                }
//             })
//             .catch((error) => {
//                let message = "An error occured while finalising verification"
//                res.sendFile(
//                   `<div style="background-color: #000099; display: flex; align-items: center; justify-content: center; height: 100vh">
//                      <h1 style="display: flex; color: white; align-items: center; justify-content: center; height: 20vh">${message}</h1>
//                   </div>`
//                )
//             })
//          }
//       }
//       else {
//          let message = "Account record either do not exist or has already being verified. Please sign up or log in"
//          res.sendFile(
//             `<div style="background-color: #000099; display: flex; align-items: center; justify-content: center; height: 100vh">
//                <h1 style="display: flex; color: white; align-items: center; justify-content: center; height: 20vh">${message}</h1>
//             </div>`
//          )
//       }
//    })
//    .catch((error) => {
//       let message = "An error occured while finalising verification"
//       res.sendFile(
//          `<div style="background-color: #000099; display: flex; align-items: center; justify-content: center; height: 100vh">
//             <h1 style="display: flex; color: white; align-items: center; justify-content: center; height: 20vh">${message}</h1>
//          </div>`
//       )
//    })
// }

module.exports = {
   sendVerificationService,
   emailLinkService,
   filePageRoute,
   forgetPasswordEmailLinkService
}