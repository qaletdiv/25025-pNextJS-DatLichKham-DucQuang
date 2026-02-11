"use client";

import { getSchedule } from "@/app/(Role)/doctor/action";
import { updateMeetingUrl } from "@/app/(Role)/doctor/action";
import { useState, useEffect } from "react";

interface MedicalForm {
  _id: string;
  images: Array<{
    url: string;
    public_id: string;
    _id: string;
  }>;
  description: string;
  pastMedicalHistory: string;
}

interface Appointment {
  _id: string;
  scheduleId: string;
  medicalForm: MedicalForm;
  status: "pending" | "approved" | "rejected";
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
  createdAt: string;
  updatedAt: string;
  appointments: Appointment[];
}

interface ScheduleResponse {
  message: string;
  doctor: {
    id: string;
    fullName: string;
    gender: string;
    phone_number: string;
  };
  schedules: Schedule[];
  error?: string;
}

interface GroupedSchedules {
  [date: string]: Schedule[];
}

export default function ScheduleDoctor() {
  const [groupedSchedules, setGroupedSchedules] = useState<GroupedSchedules>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingAppointmentId, setEditingAppointmentId] = useState<
    string | null
  >(null);
  const [meetingUrlInput, setMeetingUrlInput] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [daysToShow, setDaysToShow] = useState(7); // Hiển thị 7 ngày tiếp theo

  useEffect(() => {
    fetchSchedules();
  }, [daysToShow]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const result: ScheduleResponse = await getSchedule();

      if (result.error) {
        setError(result.error);
        return;
      }

      // Lấy ngày hôm nay
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Lấy ngày cuối cùng cần hiển thị
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + daysToShow);

      // Lọc các lịch trong khoảng thời gian
      const filteredSchedules = result.schedules.filter((schedule) => {
        const scheduleDate = new Date(schedule.date);
        scheduleDate.setHours(0, 0, 0, 0);
        return scheduleDate >= today && scheduleDate < endDate;
      });

      // Nhóm lịch theo ngày
      const grouped: GroupedSchedules = {};
      filteredSchedules.forEach((schedule) => {
        const dateKey = new Date(schedule.date).toLocaleDateString("vi-VN");
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(schedule);
      });

      // Sắp xếp lịch trong mỗi ngày theo thời gian
      Object.keys(grouped).forEach((date) => {
        grouped[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
      });

      setGroupedSchedules(grouped);
    } catch (err) {
      setError("Có lỗi xảy ra khi tải dữ liệu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMeetingUrl = async (appointmentId: string) => {
    if (!meetingUrlInput.trim()) {
      alert("Vui lòng nhập link meeting");
      return;
    }

    setUpdateLoading(true);
    try {
      const result = await updateMeetingUrl(appointmentId, meetingUrlInput);

      if (result.error) {
        alert(result.error);
        return;
      }

      alert("Cập nhật link meeting thành công!");
      setEditingAppointmentId(null);
      setMeetingUrlInput("");

     
      await fetchSchedules();
    } catch (err) {
      alert("Có lỗi xảy ra khi cập nhật link meeting");
      console.error(err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const startEditing = (appointmentId: string, currentUrl: string) => {
    setEditingAppointmentId(appointmentId);
    setMeetingUrlInput(currentUrl || "");
  };

  const cancelEditing = () => {
    setEditingAppointmentId(null);
    setMeetingUrlInput("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">Lỗi: {error}</div>;
  }

  const sortedDates = Object.keys(groupedSchedules).sort((a, b) => {
    const dateA = new Date(a.split("/").reverse().join("-"));
    const dateB = new Date(b.split("/").reverse().join("-"));
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Lịch khám</h2>
        <select
          value={daysToShow}
          onChange={(e) => setDaysToShow(Number(e.target.value))}
          className="border rounded px-3 py-2"
        >
          <option value={1}>Hôm nay</option>
          <option value={3}>3 ngày tới</option>
          <option value={7}>7 ngày tới</option>
          <option value={14}>14 ngày tới</option>
          <option value={30}>30 ngày tới</option>
        </select>
      </div>

      {sortedDates.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Không có lịch khám nào trong khoảng thời gian này
        </p>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date} className="border-2 rounded-lg p-4 bg-white shadow">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">
                📅 {date}
              </h3>

              <div className="space-y-3">
                {groupedSchedules[date].map((schedule) => (
                  <div
                    key={schedule._id}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-lg">
                          ⏰ {schedule.startTime} - {schedule.endTime}
                        </p>
                        <p className="text-sm text-gray-600">
                          {schedule.appointments.length > 0
                            ? `${schedule.appointments.length} lịch hẹn`
                            : "Chưa có lịch hẹn"}
                        </p>
                      </div>
                    </div>

                    {schedule.appointments.length > 0 && (
                      <div className="mt-3 space-y-3">
                        {schedule.appointments.map((appointment) => (
                          <div
                            key={appointment._id}
                            className="bg-white p-4 rounded border-l-4"
                            style={{
                              borderLeftColor:
                                appointment.status === "approved"
                                  ? "#10b981"
                                  : appointment.status === "pending"
                                    ? "#f59e0b"
                                    : "#ef4444",
                            }}
                          >
                            <div className="space-y-2">
                              <p className="text-sm">
                                <span className="font-medium">
                                  Trạng thái:{" "}
                                </span>
                                <span
                                  className={
                                    appointment.status === "approved"
                                      ? "text-green-600 font-semibold"
                                      : appointment.status === "pending"
                                        ? "text-yellow-600 font-semibold"
                                        : "text-red-600 font-semibold"
                                  }
                                >
                                  {appointment.status === "approved"
                                    ? "✓ Đã duyệt"
                                    : appointment.status === "pending"
                                      ? "⏳ Chờ duyệt"
                                      : "✗ Từ chối"}
                                </span>
                              </p>

                              <p className="text-sm">
                                <span className="font-medium">
                                  Triệu chứng:{" "}
                                </span>
                                {appointment.medicalForm.description}
                              </p>

                              <p className="text-sm">
                                <span className="font-medium">Giá: </span>
                                <span className="text-green-600 font-semibold">
                                  {appointment.price.toLocaleString("vi-VN")}{" "}
                                  VNĐ
                                </span>
                              </p>

                              
                              {appointment.status === "approved" && (
                                <div className="mt-3 pt-3 border-t">
                                  {editingAppointmentId === appointment._id ? (
                                    <div className="space-y-2">
                                      <label className="block text-sm font-medium">
                                        Link cuộc họp:
                                      </label>
                                      <input
                                        type="url"
                                        value={meetingUrlInput}
                                        onChange={(e) =>
                                          setMeetingUrlInput(e.target.value)
                                        }
                                        placeholder="https://meet.google.com/xxx hoặc https://zoom.us/j/xxx"
                                        className="w-full border rounded px-3 py-2 text-sm"
                                      />
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() =>
                                            handleUpdateMeetingUrl(
                                              appointment._id,
                                            )
                                          }
                                          disabled={updateLoading}
                                          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:bg-gray-400"
                                        >
                                          {updateLoading
                                            ? "Đang lưu..."
                                            : "Lưu"}
                                        </button>
                                        <button
                                          onClick={cancelEditing}
                                          disabled={updateLoading}
                                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-400"
                                        >
                                          Hủy
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-between">
                                      {appointment.meetingUrl ? (
                                        <a
                                          href={appointment.meetingUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                        >
                                          🔗 Link cuộc họp
                                        </a>
                                      ) : (
                                        <span className="text-sm text-gray-500">
                                          Chưa có link meeting
                                        </span>
                                      )}
                                      <button
                                        onClick={() =>
                                          startEditing(
                                            appointment._id,
                                            appointment.meetingUrl,
                                          )
                                        }
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                      >
                                        {appointment.meetingUrl
                                          ? "Sửa"
                                          : "Thêm link"}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
