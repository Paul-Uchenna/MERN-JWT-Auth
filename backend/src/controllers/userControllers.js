import { userModels } from "../models/userModels.js";

export async function getuserData(req, res) {
  try {
    const { userId } = req.body;

    const user = await userModels.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      userData: { name: user.name, isAccountVerified: user.isVerified },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server Error, GET USER DATA" });
  }
}
