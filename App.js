import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/AuthRoute.js";
import userRoute from "./routes/UserRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";

/* ---------- CONFIG ---------- */
const app = express();
dotenv.config();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());
app.use(cors());

/* ---------- AUTH ROUTE ---------- */
app.use("/auth", authRoute);

/* ---------- ROUTES ---------- */
app.use("/user", userRoute);

/* ---------- CONNECT DB ---------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(
    app.listen(process.env.PORT, () => {
      console.log("Listening on port " + process.env.PORT);
    })
  )
  .catch((error) => {
    console.log(error);
  });
