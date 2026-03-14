import { query } from "express-validator";
import MedicalForm from "../models/MedicalForm.js";
import StripePayment from "../models/PaymentStripe.js";
import Appointment from "../models/Appointment.js";
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
      .populate("patient", "username email")
      .populate("department");
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

export const getPaymentList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const total = await StripePayment.countDocuments();
    const payments = await StripePayment.find()
      .populate({
        path: "appointmentId",
        populate: {
          path: "scheduleId medicalForm",
        },
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    return res.status(200).json({
      payments,
      pagination: {
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách payment:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const confirmAppointment = async (req, res) => {
  try {
    const { id } = req.params; 

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn" });
    }

    const payment = await StripePayment.findOne({
      appointmentId: id,
      status: "paid",
    });
    if (!payment) {
      return res.status(400).json({ message: "Lịch hẹn chưa được thanh toán" });
    }

   
    const updated = await Appointment.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );

    return res.status(200).json({
      message: "Xác nhận lịch hẹn thành công",
      appointment: updated,
    });
  } catch (error) {
    console.error("Lỗi xác nhận lịch hẹn:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};