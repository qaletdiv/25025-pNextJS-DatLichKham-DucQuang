import Department from "../models/Department.js";

export const getAllDepartment = async(req, res) => {
  try {
    const departments = await Department.find(); 
    res.status(200).json({message: "Danh sách chuyên khoa", departments: departments})
  } catch (error) {
    console.error("Lỗi khi lấy danh sách chuyên khoa", error);
    return res.status(500).json({message: "Lỗi server"})
  }
}

export const createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newDepartment = await Department.create({
      name,
      description,
    });
    res.status(201).json({
      message: "Tạo chuyên khoa mới thành công!",
      newDepartment: newDepartment,
    });
  } catch (error) {
    console.error("Lỗi khi tạo chuyên khoa mới", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
