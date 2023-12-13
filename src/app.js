import Express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
dotenv.config();

export const app = Express();
const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URI;

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to SHOPEE API!"
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