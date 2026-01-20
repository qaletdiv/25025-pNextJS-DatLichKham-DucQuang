import mongoose from "mongoose";

const pillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String, 
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
}, { timestamps: true })

export const Pill = mongoose.model("Pill", pillSchema);
export default Pill;