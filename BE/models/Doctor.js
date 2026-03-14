import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["female", "male"],
      required: true,
      lowercase: true,
    },
    phone_number: {
      type: String,
      required: true,
      unique: true,
    },
    date_of_birth: {
      type: Date,
      required: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    department: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Department", 
        required: true
    }
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
