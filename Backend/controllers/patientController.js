import MedicalForm from "../models/MedicalForm.js";
import Doctor from "../models/Doctor.js";
import Schedule from "../models/Schedule.js";
import Account from "../models/Account.js";

export const createMedicalForm = async (req, res) => {
  try {
    const { description, pastMedicalHistory } = req.body;

    const images =
      req.files?.map((file) => ({
        url: file.path,
        public_id: file.filename,
      })) || [];

    const newForm = await MedicalForm.create({
      patient: req.account._id,
      images: images,
      description: description,
      pastMedicalHistory: pastMedicalHistory,
    });

    res.status(201).json({
      message: "Tạo phiếu khám thành công",
      form: newForm,
    });
  } catch (error) {
    console.error("Không thể tạo phiếu khám", error);
    return res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

export const getAllMedicalForm = async (req, res) => {
  try {
    const patientiId = req.account._id;
    const medicalForms = await MedicalForm.find({ patient: patientiId })
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
      .populate("patient", "username email")
      .populate("department");
    if (!medicalForm) {
      return res.status(404).json({ message: "Không tìm thấy phiếu khám" });
    }

    res.status(200).json({ message: "Lấy phiếu khám thành công", medicalForm });
  } catch (error) {
    console.error("Lỗi khi lấy phiếu khám", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const getAllDoctorDepartment = async (req, res) => {
  try {
    const medicalForm = await MedicalForm.findById(req.params.id);
    if (!medicalForm) {
      return res.status(404).json({ message: "Không tìm thấy phiếu khám" });
    }
    const doctors = await Doctor.find({
      department: medicalForm.department,
    }).select(
      "name email phone department first_name last_name  phone_number gender"
    );
    res.status(200).json({
      message: "Danh sách bác sĩ trong khoa",
      doctors: doctors,
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách bác sĩ", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const getDoctorWithSchedules = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)

    const schedules = await Schedule.find({ doctorId: req.params.id }).select(
      "date startTime endTime"
    );

    if (!doctor) {
      return res.status(404).json({ message: "Không tìm thấy bác sĩ" });
    }
    res.status(200).json({
      message: "Lấy lịch làm việc của bác sĩ thành công",
      ...doctor.toObject(),
      schedules: schedules,
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách bác sĩ", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
