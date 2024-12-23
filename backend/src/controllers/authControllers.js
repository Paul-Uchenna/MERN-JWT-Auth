import { userModels } from "../models/userModels";

export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await userModels.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

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

    res.json({ user: newUser._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function login(req, res) {}
