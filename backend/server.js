import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectMDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middleware/error.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
connectMDB();

const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("CORS not allowed"), false);
      }
      return callback(null, true);
    },
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

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server started at Port ${PORT}`);
  });
}

export default app;
