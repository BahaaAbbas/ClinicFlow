import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectMDB from "./config/db.js";

dotenv.config();
const app = express();
connectMDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server returned corrctly");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server started at Port ${PORT}`);
});
