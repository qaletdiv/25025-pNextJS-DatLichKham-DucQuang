import mongoose from "mongoose";

const paymentMomoSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    requestId: {
      type: String,
      required: true,
    },
    transId: {
      type: Number, // MoMo trả về number
      default: null,
    },
    payType: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "cancelled"],
      default: "pending",
    },
    resultCode: {
      type: Number,
      default: null,
    },
    message: {
      type: String,
      default: null,
    },
    responseTime: {
      type: Number,
      default: null,
    },
    ipnReceived: {
      type: Boolean,
      default: false,
    },
    momoResponse: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const MomoPayment = mongoose.model("MomoPayment", paymentMomoSchema)
export default MomoPayment