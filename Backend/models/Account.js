import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Mặc định không trả về Password khi request
    },
    role: {
      type: String,
      enum: ["doctor", "admin", "patient", "staff"],
      default: "patient",
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt tự động thêm vào
  }
);

const Account = mongoose.model("Account", accountSchema);
export default Account;
