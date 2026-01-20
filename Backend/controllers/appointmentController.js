import Appointment from "../models/Appointment.js";
import MedicalForm from "../models/MedicalForm.js";
import Schedule from "../models/Schedule.js";
export const createAppointment = async (req, res) => {
  try {
    const { startTime, endTime, doctorId, date } = req.body;
    const schedule = await Schedule.create({
      startTime,
      endTime,
      doctorId,
      date,
    });

    const { id } = req.params;
    const appointment = await Appointment.create({
      scheduleId: schedule._id,
      medicalForm: id,
    });

    res.status(201).json({ message: "Đặt lịch thành công", appointment });
  } catch (error) {
    console.error("Lỗi đăng ký lịch khám", error);
    return res.status(500).json("Server lỗi");
  }
};

export const getAllAppointment = async (req, res) => {
  try {
    const patientId = req.account._id;
    const medicalForms = await MedicalForm.find({ patient: patientId }).select(
      "_id"
    );
    const medicalFormIds = medicalForms.map((mf) => mf._id);
    const appointments = await Appointment.find({
      medicalForm: { $in: medicalFormIds },
    })
      .populate("medicalForm")
      .populate({
        path: "scheduleId",
        select: "date startTime endTime",
        populate: {
          path: "doctorId",
          select: "first_name last_name",
        },
      });
    res
      .status(200)
      .json({ message: "Lấy danh sách lịch khám thành công", appointments });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const getDetailAppoitment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id).populate(
      "scheduleId",
      "startTime endTime date doctorId"
    );
    if (!appointment) {
      return res.status(404).json({ message: "Không tìm thấy lịch khám" });
    }
    res
      .status(200)
      .json({ message: "Lấy chi tiết lịch khám thành công", appointment });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết lịch khám", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
