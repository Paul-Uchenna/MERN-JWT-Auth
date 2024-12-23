import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import "dotenv/config";
import { connectDB } from "./config/mongoDB.js";

const app = express();
const PORT = process.env.PORT || 4000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
