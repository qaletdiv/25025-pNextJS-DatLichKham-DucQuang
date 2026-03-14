import Pill from "../models/Pill.js";

export const createPill = async (req, res) => {
  try {
    const { name, description, unit, price } = req.body;
    const pill = await Pill.create({ name, description, unit, price });
    return res.status(201).json({ message: "Tạo thuốc thành công", pill });
  } catch (error) {
    console.error("Lỗi tạo thuốc:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const getPills = async (req, res) => {
  try {
    const pills = await Pill.find().sort({ createdAt: -1 });
    return res.status(200).json({pills})
  } catch (error) {
    console.error("Lỗi lấy danh sách thuốc", error);
    return res.status(500).json({message: "Lỗi server"})
  }
};
 