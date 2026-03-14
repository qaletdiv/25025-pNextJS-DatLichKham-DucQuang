import mongoose from "mongoose";

const stripeSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    stripePaymentId: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "vnd",
    },
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

const StripePayment = mongoose.model("StripePayment", stripeSchema);
export default StripePayment;
