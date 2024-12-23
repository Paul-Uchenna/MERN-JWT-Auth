import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    await mongoose.connect(process.env.MONGO_DB_DATABASE);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
