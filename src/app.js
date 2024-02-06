import Express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoute from "./auth/authRoutes.js";
import creditorRouter from "./Components/creditor/creditorRoutes.js";
// import debtorRouter from "./Components/debtor/debtorRoutes.js";
import stockRouter from "./Components/stock/stockRoutes.js";
import salesRouter from "./Components/sales/salesRouter.js";
import accountRoute from "./account/accountRoutes.js";
dotenv.config();

const corsOptions = {
  origin: 'htps://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200
}


export const app = Express();
const PORT = process.env.PORT || 8080;
const MONGODB_URL = process.env.MONGODB_URI;

app.use(cors(corsOptions));
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));


app.use("/auth", authRoute)
app.use("/account",accountRoute)
app.use("/sales", salesRouter)
app.use("/stock", stockRouter)
// app.use("/debtor", debtorRouter)
app.use("/creditor", creditorRouter)

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to LEDGER API!"
  });
});



app.listen(PORT, async() => {
    try {
       await connectDB(MONGODB_URL);
        console.log(`Server is running on port ${PORT}`); 
    } catch (error) {
        console.log(error.message);
    }
    });