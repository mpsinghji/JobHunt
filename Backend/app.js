import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/userRoutes.js";

dotenv.config({ path: "./config/config.env" });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.WEB_URL,
    credentials: true,
  })
);

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "API is running",
        success: true,
    });
});
app.use("/api/v1/user",userRoutes);


export default app;
