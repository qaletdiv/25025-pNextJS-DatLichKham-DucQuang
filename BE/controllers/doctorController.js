import Account from "../models/Account.js";
import Department from "../models/Department.js";
import Doctor from "../models/Doctor.js";
import Schedule from "../models/Schedule.js";
import Appointment from "../models/Appointment.js";

export const createDoctor = async (req, res) => {
  try {
    const newDoctor = await Doctor.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      gender: req.body.gender,
      phone_number: req.body.phone_number,
      date_of_birth: req.body.date_of_birth,
      account: req.body.account,
      avatar: req.body.avatar,
      department: req.body.department,
    });
    res.status(201).json({
      message: "Tạo bác sĩ thành công",
      doctor: newDoctor,
    });
  } catch (error) {
    console.error("Lỗi khi tạo bác sĩ", error);
    return res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

export const getSchedule = async (req, res) => {
  try {
    const accountId = req.account._id;

    const doctor = await Doctor.findOne({ account: accountId });
    if (!doctor) {
      return res.status(404).json({ message: "Không tìm thấy bác sĩ" });
    }

    const schedules = await Schedule.find({ doctorId: doctor._id }).lean();

    if (schedules.length === 0) {
      return res.status(200).json({
        message: "Bác sĩ chưa có lịch khám nào",
        schedules: [],
      });
    }

    const scheduleIds = schedules.map((s) => s._id);

    const appointments = await Appointment.find({
      scheduleId: { $in: scheduleIds },
    })
      .populate({
        path: "medicalForm",
        select: "images description pastMedicalHistory",
      })
      .lean();

    const appointmentsBySchedule = {};
    appointments.forEach((app) => {
      const scheduleIdStr = app.scheduleId.toString();
      if (!appointmentsBySchedule[scheduleIdStr]) {
        appointmentsBySchedule[scheduleIdStr] = [];
      }
      appointmentsBySchedule[scheduleIdStr].push(app);
    });

    const schedulesWithAppointments = schedules.map((schedule) => {
      const scheduleIdStr = schedule._id.toString();
      return {
        ...schedule,
        appointments: appointmentsBySchedule[scheduleIdStr] || [],
      };
    });

    return res.status(200).json({
      message: "Lấy danh sách lịch khám thành công",
      doctor: {
        id: doctor._id,
        fullName: `${doctor.first_name || ""} ${doctor.last_name || ""}`.trim(),
        gender: doctor.gender,
        phone_number: doctor.phone_number,
      },
      schedules: schedulesWithAppointments,
    });
  } catch (error) {
    console.error("Lỗi getSchedule:", error);
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

export const updateAppointmentLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { meetingUrl } = req.body;
    if (!id || !meetingUrl) {
      return res
        .status(400)
        .json({ message: "Thiếu appointmentId hoặc meetLink" });
    }
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { meetingUrl },
      { new: true },
    );
    if (!appointment) {
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn" });
    }
    return res.json({
      message: "Cập nhật link meet thành công",
      data: appointment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
