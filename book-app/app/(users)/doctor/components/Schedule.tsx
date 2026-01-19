"use client";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { useEffect, useState } from "react";
import { getAllSchedules } from "@/app/redux/slices/doctor/doctors.slices";
import { updateAppointmentMeetUrl } from "@/app/redux/slices/doctor/doctors.slices";
export default function Schedule() {
  const dispatch = useAppDispatch();
  const { schedules } = useAppSelector((state) => state.doctor);

  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [meetingUrl, setMeetingUrl] = useState("");

  const today = new Date();

  useEffect(() => {
    dispatch(getAllSchedules());
  }, [dispatch]);

  console.log(schedules);
  const events = schedules.map((item) => {
    const date = item.date.split("T")[0];
    const appointment = item.appointments?.[0];

    return {
      id: item._id,
      title: appointment ? "Có lịch hẹn" : "Trống",
      start: `${date}T${item.startTime}:00`,
      end: `${date}T${item.endTime}:00`,
      extendedProps: {
        appointment,
      },
    };
  });

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-6">
      <FullCalendar
        height="auto"
        contentHeight="auto"
        firstDay={1}
        plugins={[timeGridPlugin]}
        initialView="timeGridWeek"
        initialDate={today}
        allDaySlot={false}
        slotMinTime="08:00:00"
        slotMaxTime="17:00:00"
        slotDuration="00:30:00"
        hiddenDays={[0, 6]}
        businessHours={[
          {
            daysOfWeek: [1, 2, 3, 4, 5, 6],
            startTime: "08:00",
            endTime: "12:30",
          },
          {
            daysOfWeek: [1, 2, 3, 4, 5, 6],
            startTime: "13:30",
            endTime: "17:00",
          },
        ]}
        events={events}
        eventClick={(info) => {
          const appointment = info.event.extendedProps.appointment;
          if (!appointment) {
            setSelectedAppointment(null);
            return;
          }

          setSelectedAppointment(appointment);
          setMeetingUrl(appointment.meetingUrl || "");
        }}
      />

      {selectedAppointment &&
        (() => {
          const isPaid = selectedAppointment.status === "approved";

          return (
            <div className="border rounded-lg p-4 space-y-4">
              <h2 className="text-lg font-semibold">Thông tin lịch khám</h2>

              <div>
                <p className="text-sm text-gray-600">Lý do khám</p>
                <p className="font-medium">
                  {selectedAppointment.medicalForm?.description}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Tiền sử bệnh</p>
                <p className="font-medium">
                  {selectedAppointment.medicalForm?.pastMedicalHistory}
                </p>
              </div>

              {selectedAppointment.medicalForm?.images?.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Hình ảnh bệnh án</p>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedAppointment.medicalForm.images.map((img) => (
                      <img
                        key={img._id}
                        src={img.url}
                        className="w-full h-64 object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Trạng thái:</span>
                {isPaid ? (
                  <span className="text-green-600 font-medium">
                    Đã thanh toán
                  </span>
                ) : (
                  <span className="text-yellow-600 font-medium">
                    Chưa thanh toán
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-600">
                  Link khám bệnh trực tuyến
                </label>

                <input
                  type="text"
                  value={meetingUrl}
                  disabled={!isPaid}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  placeholder={
                    isPaid
                      ? "Nhập link meeting..."
                      : "Chỉ nhập khi đã thanh toán"
                  }
                  className={`w-full border rounded px-3 py-2 outline-none
            ${
              isPaid
                ? "focus:ring-2 focus:ring-blue-500"
                : "bg-gray-100 cursor-not-allowed"
            }`}
                />
              </div>

              {isPaid && (
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={async () => {
                    if (!meetingUrl.trim()) {
                      alert("Vui lòng nhập link meeting");
                      return;
                    }
                    try {
                      await dispatch(
                        updateAppointmentMeetUrl({
                          id: selectedAppointment._id,
                          meetingUrl,
                        }),
                      ).unwrap();
                      alert("Cập nhật link meeting thành công");
                      setSelectedAppointment((prev: any) => ({
                        ...prev,
                        meetingUrl,
                      }));
                    } catch (err: any) {
                      alert(
                        err?.message || err?.error || "Cập nhật link thất bại",
                      );
                    }
                  }}
                >
                  Lưu link meeting
                </button>
              )}
            </div>
          );
        })()}
    </div>
  );
}
