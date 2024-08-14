const AccountModel = require("../models/accountModel.js");
const bycryptjs = require('bcryptjs');


////////////creating an account
const createAccountService = async (body) => {
   const auth = new AccountModel(body)
   const salt = bycryptjs.genSaltSync(10)
   const hashedPassword = bycryptjs.hashSync(body.password, salt)
   auth.password = hashedPassword
   await auth
      .save()
      .then(result => {
         sendVerificationEmail(result)
      })
   return auth
}

////////////change password
const encryptPasswordService = async (body) => {
   const salt = bycryptjs.genSaltSync(10)
   const hashedPassword = bycryptjs.hashSync(body, salt)
   return hashedPassword
}

////////////if the account exist
const accountExistService = async (email) => {
   const findAccount = await AccountModel.findOne({ email })
   if (!findAccount || !findAccount.email) {
      return false
   } else {
      return true
   }
}

/////////////get All the accounts
const getAllAccountsService = async () => {
   const allAccount = AccountModel.find()
   return allAccount
}

/////////////get individual account   +  needed for signin
const getAccountByEmail = async (email) => {
   const findAccount = await AccountModel.findOne({ email })
   //  console.log(findAccount, "here")
   if (!findAccount || !findAccount.email) {
      return false
   } else {
      return (true, findAccount)
   }
}

/////////////get individual account by id
const getAccountById = async (id) => {
   const findAccount = await AccountModel.findById(id)
   // console.log(findAccount, "here")
   if (findAccount && findAccount._id) {
      return (true, findAccount)
   } else {
      return false
   }
}

/////////////update account
const editAccountService = async (id, data) => {
   const updateAccount = await AccountModel.findByIdAndUpdate(id, data)
   return updateAccount
}

/////////////////Delete account
const deleteAccountService = async (id) => {
   const deleteAccount = await AccountModel.findByIdAndDelete(id)
   return deleteAccount
}
/////////////////////Email Verification/////////////////////////
const sendVerificationEmail = ({ _id, email }, res) => {
   console.log("email sent successfully")
}

module.exports = {
   createAccountService,
   encryptPasswordService,
   accountExistService,
   getAllAccountsService,
   getAccountByEmail,
   getAccountById,
   editAccountService,
   deleteAccountService
}