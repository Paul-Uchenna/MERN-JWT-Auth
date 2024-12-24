import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import "dotenv/config";
import { connectDB } from "./config/mongoDB.js";
import { authRouter } from "./routes/authRoutes.js";
import { userRouter } from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;
connectDB();

const frontendOrigin = ["http://localhost:5173", "http://localhost:/3000"];

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: frontendOrigin, credentials: true }));

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

// API enndpoints
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
