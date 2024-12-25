import express from "express";

import {
  register,
  login,
  logout,
  sendVerifyOPT,
  verifyEmail,
  isAuthenticated,
  sendResetPassword,
  resetPassword,
} from "../controllers/authControllers.js";
import { userAuth } from "../../middleware/userAth.js";

export const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.post("/send-verify-otp", userAuth, sendVerifyOPT);
authRouter.post("/verify-account", userAuth, verifyEmail);
authRouter.get("/is-authenticate", userAuth, isAuthenticated);
authRouter.post("/send-reset-otp", sendResetPassword);
authRouter.post("/reset-password", resetPassword);
