const Express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const accountRoute = require("./account/accountRoutes.js")
// import {accountRoute} from ;
const connectDB = require("./config/db.js");
const authRoute = require("./auth/authRoutes.js");
const verificationRouter = require("./verification/verificationRoute.js")
const creditorRouter = require("./Components/creditor/creditorRoutes.js");
const creditRouter = require("./Components/credit/creditRoutes.js");
const debtorRouter = require("./Components/debtor/debtorRoutes.js");
const debtRouter = require("./Components/debt/debtRoutes.js");
const stockRouter = require("./Components/stock/stockRoutes.js");
const salesRouter = require("./Components/sales/salesRoutes.js");
const authMiddleware = require("./middleware/authMiddleware.js")
const categoryRouter = require("./Components/category/categoryRouter.js");
const creditorBalRouter = require("./Components/creditorBal/creditorBalRoutes.js");
const debtorBalRouter = require("./Components/debtorBal/debtorBalRoutes.js");
const profileRoute = require("./Components/profile/profileRoutes.js");
const { errorHandler, notFound } = authMiddleware;

dotenv.config();

const corsOptions = {
  Origin: 'https://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200
}


const app = Express();
const PORT = process.env.PORT || 8080;
const MONGODB_URL = process.env.MONGODB_URI;
app.use(Express.json());   //this collect whatever data we are passing in, convert it to Js object and pass it to the neccessary handler
app.use(Express.urlencoded({ extended: true }));
app.use(cors(corsOptions))

app.use("/auth", authRoute)
app.use("/account", accountRoute)
app.use("/verification", verificationRouter)
app.use("/sales", salesRouter)
app.use("/stock", stockRouter)
app.use("/profile", profileRoute)
app.use("/category", categoryRouter)
app.use("/debtor", debtorRouter)
app.use("/creditor", creditorRouter)
app.use("/credit", creditRouter)
app.use("/debt", debtRouter)
app.use("/debtorBal", debtorBalRouter)
app.use("/creditorBal", creditorBalRouter)

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to LEDGER API!"
  });
});

app.use(notFound)
app.use(errorHandler)



app.listen(PORT, async () => {
  try {
    await connectDB(MONGODB_URL);
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = { app } 