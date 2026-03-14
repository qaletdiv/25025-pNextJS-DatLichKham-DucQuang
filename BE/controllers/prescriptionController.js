import Prescription from "../models/Presciption.js";
import Appointment from "../models/Appointment.js";
export const createPrescription = async (req, res) => {
  try {
    const { appointmentId, medicines, note } = req.body;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn" });
    }
    if (appointment.prescription) {
      return res.status(404).json({ message: "Lịch hẹn này đã có toa thuốc" });
    }
    const prescription = await Prescription.create({
      appointmentId,
      medicines,
      note,
    });
    await Appointment.findByIdAndUpdate(appointmentId, {
        prescription: prescription._id,
        medicalStatus: "completed"
    })
    return res.status(201).json({message: "Kê toa thuốc thành công ", prescription})
  } catch (error) {
    console.error("Lỗi khi kê toa thuốc", error)
    return res.status(500).json({message: "Lỗi server"})
  }
};

export const getPrescription = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const prescription = await Prescription.findOne({ appointmentId })
      .populate("medicines.pill");

    if (!prescription) {
      return res.status(404).json({ message: "Chưa có toa thuốc" });
    }

    return res.status(200).json({ prescription });
  } catch (error) {
    console.error("Lỗi lấy toa thuốc:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};