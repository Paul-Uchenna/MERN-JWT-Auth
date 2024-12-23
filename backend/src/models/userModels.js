import mongoose from "mongoose";

// ** OTP (One-Time Password)

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verifyOTP: { type: String, default: "" },
  expiredVerifyOTP: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  resetOTP: { type: String, default: "" },
  expiredResetOTP: { type: Number, default: 0 },
});

const userModels = mongoose.model("User", userSchema);

export { userModels };
