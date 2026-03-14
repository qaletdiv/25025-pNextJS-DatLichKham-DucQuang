import mongoose from "mongoose";

const staffDepartmentSchema = new mongoose.Schema(
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

const StaffDepartment = mongoose.model("StaffDepartment", staffDepartmentSchema);
export default StaffDepartment;