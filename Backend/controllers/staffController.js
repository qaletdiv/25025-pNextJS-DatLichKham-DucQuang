import MedicalForm from "../models/MedicalForm.js";

export const getAllMedicalForm = async (req, res) => {
  try {
    const medicalForms = await MedicalForm.find()
      .populate("patient", "username email")
      .populate("department", "name description")
      .sort({ createdAt: -1 });
    res.json({
      message: "Danh sách tất cả phiếu đăng ký khám",
      forms: medicalForms,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phiếu khám", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getDetailForm = async (req, res) => {
  try {
    const { id } = req.params;
    const medicalForm = await MedicalForm.findById(id)
    .populate("patient","username email")
    .populate('department');
    if (!medicalForm) {
      return res.status(400).json({ message: "Không tìm thấy phiếu khám" });
    }

    res.status(200).json({ message: "Lấy phiếu khám thành công", medicalForm });
  } catch (error) {
    console.error("Lỗi khi lấy phiếu khám", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const updateMedicalForm = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectedMessage, department } = req.body;

    const form = await MedicalForm.findById(id);
    if (!form) {
      return res.status(404).json({ message: "Không tìm thấy phiếu khám" });
    }

    const allowedStatus = ["pending", "approved", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    if (status === "approved" && !department) {
      return res
        .status(400)
        .json({ message: "Vui lòng chọn chuyên khoa khi duyệt phiếu" });
    }

    if (status === "rejected" && !rejectedMessage) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập lý do từ chối phiếu" });
    }

    form.status = status;

    if (status === "approved") {
      form.department = department;
      form.rejectedMessage = null;
    }

    if (status === "rejected") {
      form.department = null;
      form.rejectedMessage = rejectedMessage;
    }

    const updatedForm = await form.save();

    res.json({
      message: "Cập nhật trạng thái phiếu khám thành công",
      form: updatedForm,
    });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái:", error);
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};
