import express from "express";
import { userAuth } from "../../middleware/userAth.js";
import { getuserData } from "../controllers/userControllers.js";

export const userRouter = express.Router();

userRouter.get("/data", userAuth, getuserData);
