"use client";

import { getSchedule, updateMeetingUrl } from "@/app/(Role)/doctor/action";
import { useState, useEffect } from "react";
import PrescriptionModal from "./PrescriptionModal";
interface MedicalForm {
  _id: string;
  images: Array<{ url: string; public_id: string; _id: string }>;
  description: string;
  pastMedicalHistory: string;
}

interface Appointment {
  _id: string;
  scheduleId: string;
  medicalForm: MedicalForm;
  status: "pending" | "approved" | "cancelled";
  medicalStatus: "waiting" | "completed";
  prescription: string | null;
  meetingUrl: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

interface Schedule {
  _id: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  appointments: Appointment[];
}

export default function ScheduleDoctor() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<{
    appointment: Appointment;
    schedule: Schedule;
  } | null>(null);
  const [meetingUrlInput, setMeetingUrlInput] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0); // 0 = tuần hiện tại
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const result = await getSchedule();
      if (result.error) return;
      setSchedules(result.schedules || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Lấy 7 ngày của tuần hiện tại + offset
  const getWeekDays = () => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);

    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      return day;
    });
  };

  const weekDays = getWeekDays();
  const DAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  // Lấy tất cả các giờ có trong data, sort
  const generateTimeSlots = () => {
    const slots = [];
    for (let h = 8; h <= 17; h++) {
      slots.push(`${String(h).padStart(2, "0")}:00`);
      if (h < 17 || true) slots.push(`${String(h).padStart(2, "0")}:30`);
    }
    // Kết quả: 08:00, 08:30, 09:00, ... 17:00, 17:30
    return slots;
  };

  const allTimeSlots = generateTimeSlots();

  // Tìm schedule theo ngày và giờ
  const getScheduleByDayAndTime = (day: Date, time: string) => {
    return schedules.find((s) => {
      const scheduleDate = new Date(s.date);
      return (
        scheduleDate.toDateString() === day.toDateString() &&
        s.startTime === time
      );
    });
  };

  const handleClickSlot = (appointment: Appointment, schedule: Schedule) => {
    setSelectedAppointment({ appointment, schedule });
    setMeetingUrlInput(appointment.meetingUrl || "");
  };

  const handleUpdateMeetingUrl = async () => {
    if (!meetingUrlInput.trim() || !selectedAppointment) return;
    setUpdateLoading(true);
    try {
      const result = await updateMeetingUrl(
        selectedAppointment.appointment._id,
        meetingUrlInput,
      );
      if (result.error) {
        alert(result.error);
        return;
      }
      alert("Cập nhật link meeting thành công!");
      setSelectedAppointment(null);
      await fetchSchedules();
    } catch (err) {
      alert("Có lỗi xảy ra");
    } finally {
      setUpdateLoading(false);
    }
  };

  const isToday = (day: Date) =>
    day.toDateString() === new Date().toDateString();

  if (loading) return <div className="p-8 text-center">Đang tải...</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header tuần */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setWeekOffset((w) => w - 1)}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          ← Tuần trước
        </button>
        <h2 className="text-lg font-semibold">
          {weekDays[0].toLocaleDateString("vi-VN")} -{" "}
          {weekDays[6].toLocaleDateString("vi-VN")}
        </h2>
        <button
          onClick={() => setWeekOffset((w) => w + 1)}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          Tuần sau →
        </button>
      </div>

      {/* Bảng lịch */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="p-2 border-b border-r bg-gray-50 w-20 text-gray-500">
                Giờ
              </th>
              {weekDays.map((day, i) => (
                <th
                  key={i}
                  className={`p-2 border-b text-center ${
                    isToday(day) ? "bg-blue-50 text-blue-600" : "bg-gray-50"
                  }`}
                >
                  <div className="font-semibold">{DAY_LABELS[i]}</div>
                  <div
                    className={`text-xs ${isToday(day) ? "text-blue-500" : "text-gray-500"}`}
                  >
                    {day.getDate()}/{day.getMonth() + 1}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allTimeSlots.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-400">
                  Không có lịch khám nào
                </td>
              </tr>
            ) : (
              allTimeSlots.map((time) => (
                <tr key={time} className="border-b">
                  <td className="p-2 border-r text-center text-gray-500 bg-gray-50 font-medium">
                    {time}
                  </td>
                  {weekDays.map((day, i) => {
                    const schedule = getScheduleByDayAndTime(day, time);
                    const appointment = schedule?.appointments?.[0];

                    return (
                      <td key={i} className="p-1 border-r h-14 align-top">
                        {schedule && appointment ? (
                          <button
                            onClick={() =>
                              handleClickSlot(appointment, schedule)
                            }
                            className={`w-full h-full text-left px-2 py-1 rounded text-xs font-medium transition-colors ${
                              appointment.status === "approved"
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : appointment.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                  : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                          >
                            <div className="truncate">
                              {appointment.medicalForm.description}
                            </div>
                            <div className="text-xs opacity-70">
                              {schedule.startTime} - {schedule.endTime}
                            </div>
                          </button>
                        ) : schedule ? (
                          <div className="w-full h-full px-2 py-1 rounded text-xs bg-gray-50 text-gray-300 flex items-center justify-center">
                            Không có lịch
                          </div>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Drawer */}
      {selectedAppointment && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setSelectedAppointment(null)}
          />

          {/* Drawer */}
          <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Chi tiết lịch khám</h3>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>

              {/* Thông tin lịch */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Ngày khám</span>
                    <span className="font-medium">
                      {new Date(
                        selectedAppointment.schedule.date,
                      ).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Giờ khám</span>
                    <span className="font-medium">
                      {selectedAppointment.schedule.startTime} -{" "}
                      {selectedAppointment.schedule.endTime}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Trạng thái</span>
                    <span
                      className={`font-medium ${
                        selectedAppointment.appointment.status === "approved"
                          ? "text-green-600"
                          : selectedAppointment.appointment.status === "pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {selectedAppointment.appointment.status === "approved"
                        ? "✓ Đã duyệt"
                        : selectedAppointment.appointment.status === "pending"
                          ? "⏳ Chờ duyệt"
                          : "✗ Từ chối"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Giá khám</span>
                    <span className="font-medium text-green-600">
                      {selectedAppointment.appointment.price.toLocaleString(
                        "vi-VN",
                      )}{" "}
                      VNĐ
                    </span>
                  </div>
                </div>

                {/* Thông tin bệnh */}
                <div>
                  <h4 className="font-medium mb-2">Thông tin bệnh nhân</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Triệu chứng</p>
                      <p className="text-sm bg-gray-50 rounded p-3">
                        {
                          selectedAppointment.appointment.medicalForm
                            .description
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Tiền sử bệnh</p>
                      <p className="text-sm bg-gray-50 rounded p-3">
                        {
                          selectedAppointment.appointment.medicalForm
                            .pastMedicalHistory
                        }
                      </p>
                    </div>

                    {/* Ảnh */}
                    {selectedAppointment.appointment.medicalForm.images.length >
                      0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Hình ảnh</p>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedAppointment.appointment.medicalForm.images.map(
                            (img) => (
                              <img
                                key={img._id}
                                src={img.url}
                                alt="medical"
                                className="rounded w-full h-24 object-cover"
                              />
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Link meeting - chỉ hiện khi approved */}
                {selectedAppointment.appointment.status === "approved" && (
                  <div>
                    <h4 className="font-medium mb-2">Link cuộc họp</h4>
                    <input
                      type="url"
                      value={meetingUrlInput}
                      onChange={(e) => setMeetingUrlInput(e.target.value)}
                      placeholder="https://meet.google.com/xxx"
                      className="w-full border rounded px-3 py-2 text-sm mb-2"
                    />
                    {selectedAppointment.appointment.meetingUrl && (
                      <a
                        href={selectedAppointment.appointment.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline block mb-2"
                      >
                        🔗 Link hiện tại
                      </a>
                    )}
                    <button
                      onClick={handleUpdateMeetingUrl}
                      disabled={updateLoading}
                      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
                    >
                      {updateLoading ? "Đang lưu..." : "Lưu link meeting"}
                    </button>
                  </div>
                )}
                {selectedAppointment.appointment.status === "approved" &&
                  !selectedAppointment.appointment.prescription && (
                    <button
                      onClick={() => setShowPrescriptionModal(true)}
                      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
                    >
                      + Kê toa thuốc
                    </button>
                  )}
                {showPrescriptionModal && selectedAppointment && (
                  <PrescriptionModal
                    appointmentId={selectedAppointment.appointment._id}
                    onClose={() => setShowPrescriptionModal(false)}
                    onSuccess={() => {
                      setShowPrescriptionModal(false);
                      fetchSchedules();
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
