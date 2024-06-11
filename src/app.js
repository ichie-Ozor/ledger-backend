import Express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoute from "./auth/authRoutes.js";
import {creditorRouter} from "./Components/creditor/creditorRoutes.js";
import {creditRouter} from "./Components/credit/creditRoutes.js";
import {debtorRouter} from "./Components/debtor/debtorRoutes.js";
import {debtRouter} from "./Components/debt/debtRoutes.js";
import {stockRouter} from "./Components/stock/stockRoutes.js";
import {salesRouter} from "./Components/sales/salesRoutes.js";
import {accountRoute} from "./account/accountRoutes.js";
import { errorHandler, notFound } from "./middleware/authMiddleware.js";
import { categoryRouter } from "./Components/category/categoryRouter.js";
import { creditorBalRouter } from "./Components/creditorBal/creditorBalRoutes.js";
import { debtorBalRouter } from "./Components/debtorBal/debtorBalRoutes.js";
import { profileRoute } from "./Components/profile/profileRoutes.js";

dotenv.config();

const corsOptions = {
  Origin: 'htps://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200
}


export const app = Express();
const PORT = process.env.PORT || 8080;
const MONGODB_URL = process.env.MONGODB_URI;
app.use(Express.json());   //this collect whatever data we are passing in, convert it to Js object and pass it to the neccessary handler
app.use(Express.urlencoded({ extended: true }));
app.use(cors(corsOptions))

app.use("/auth", authRoute)
app.use("/account",accountRoute)
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



app.listen(PORT, async() => {
    try {
       await connectDB(MONGODB_URL);
        console.log(`Server is running on port ${PORT}`); 
    } catch (error) {
        console.log(error.message);
    }
    });