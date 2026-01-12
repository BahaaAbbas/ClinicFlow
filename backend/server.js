import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectMDB from "./config/db.js";
import errorHandler from "./middleware/error.js";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import visitRoutes from "./routes/visitRoutes.js";

dotenv.config();
const app = express();
connectMDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

//test
app.get("/", (req, res) => {
  res.json("Server returned correctly");
});

app.use("/api/auth", authRoutes);
app.use("/api/visits", visitRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server started at Port ${PORT}`);
});
