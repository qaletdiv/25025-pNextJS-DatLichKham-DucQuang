import mongoose, { connect } from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_CONNECTSTRING
    );
    console.log("Database connected!");
  } catch (error) {
    console.error("Error Database connected");
    process.exit(1)  }
};
