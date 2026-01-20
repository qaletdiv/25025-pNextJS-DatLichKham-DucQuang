import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt tự động thêm vào
  }
);

const Department = mongoose.model("Department", departmentSchema);
export default Department;