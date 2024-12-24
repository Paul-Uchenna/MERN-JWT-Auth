import { userModels } from "../models/userModels.js";
import { transporter } from "../config/nodemailer.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const existingUser = await userModels.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModels({ name, email, password: hashedPassword });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000, // ! 3 days
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Welcome to the MERN Auth App 🚀, by PaulDev",
      text: `Hello ${name}, Welcome to the MERN Auth App, you have successfully registered! with email: ${email}`,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(201)
      .json({
        success: true,
        user: newUser._id,
        message: "User Created Successfully",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error, REGISTER" });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const existingUser = await userModels.findOne({ email });

    if (!existingUser) {
      return res.status(401).json({ success: false, message: "Invalid Email" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Password" });
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000, // ! 3 days
    });

    res
      .status(200)
      .json({
        success: true,
        user: existingUser._id,
        message: "Login Successful",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error, LOGIN" });
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    res.status(200).json({ success: true, message: "Logged Out" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error, LOGOUT" });
  }
}

export async function sendVerifyOPT(req, res) {
  try {
    const { userId } = req.body;

    const user = await userModels.findById(userId);
    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "User is already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOTP = otp;
    user.expiredVerifyOTP = Date.now() + 15 * 60 * 1000; // ! 15 minutes

    await user.save();

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: user.email,
      subject: "Verify your email 🚀, by PaulDev",
      text: `Hello ${user.name}, Your One-Time Password (OTP) is ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "OTP sent" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server Error, SEND VERIFY OTP" });
  }
}

export async function verifyEmail(req, res) {
  const { userId, otp } = req.body;
  if (!userId || !otp) {
    return res.status(400).json({ success: false, message: "Missing Details" });
  }

  try {
    const user = await userModels.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.verifyOTP === "" || user.verifyOTP !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (user.expiredVerifyOTP < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    user.isVerified = true;

    user.verifyOTP = "";
    user.expiredVerifyOTP = 0;

    await user.save();

    res.status(200).json({ success: true, message: "Email Verified" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server Error, VERIFY EMAIL" });
  }
}

export async function isAuthenticated(req, res) {
  try {
    res.status(200).json({ success: true, message: "Authenticated" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server Error, IS AUTHENTICATED" });
  }
}

export async function sendResetPassword(req, res) {
  const { email } = req.body;

  if (!email)
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });

  try {
    const user = await userModels.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOTP = otp;
    user.expiredResetOTP = Date.now() + 15 * 60 * 1000; // ! 15 minutes

    await user.save();

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: user.email,
      subject: "Reset your password 🚀, by PaulDev",
      text: `Hello ${user.name}, Your One-Time Password (OTP) to reset your password is ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({
        success: true,
        message: "OTP sent to reset password successfully",
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server Error, RESET PASSWORD" });
  }
}

export async function resetPassword(req, res) {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword)
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });

  try {
    const user = await userModels.findOne({ email });

    if (!email)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (user.resetOTP === "" || user.resetOTP !== otp)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    if (user.expiredResetOTP < Date.now())
      return res.status(400).json({ success: false, message: "OTP expired" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    user.resetOTP = "";
    user.expiredResetOTP = 0;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server Error, RESET PASSWORD" });
  }
}
