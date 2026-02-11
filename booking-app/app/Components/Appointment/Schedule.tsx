"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import Container from "../Common/Container/Container";

import {
  fetchDoctorByDepartment,
  getDoctorScheduleByDoctor,
  makeAppointment,
  createMoMoPayment,
} from "@/app/(Role)/patient/action";

interface Doctor {
  _id: string;
  first_name: string;
  last_name: string;
}

interface Schedule {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
  editable: boolean;
  extendedProps?: {
    isBooked: boolean;
  };
}

interface SelectedSlot {
  start: string;
  end: string;
}

interface AppointmentInputProps {
  medicalFormId: string;
}

export default function AppointmentInput({
  medicalFormId,
}: AppointmentInputProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [doctorEvents, setDoctorEvents] = useState<CalendarEvent[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const today = new Date();

  useEffect(() => {
    const loadDoctors = async () => {
      const res = await fetchDoctorByDepartment(medicalFormId as string);
      if (!res?.error) {
        setDoctors(res.doctors || res.data || []);
      }
    };

    if (medicalFormId) loadDoctors();
  }, [medicalFormId]);

  useEffect(() => {
    if (!doctorId) return;

    const loadSchedule = async () => {
      const res = await getDoctorScheduleByDoctor(doctorId);
    

      if (!res?.error && res.schedules) {
        const events = res.schedules.map((item: Schedule): CalendarEvent => {
          const date = item.date.split("T")[0];

          return {
            id: item._id,
            title: "Đã đặt",
            start: `${date}T${item.startTime}:00`,
            end: `${date}T${item.endTime}:00`,
            backgroundColor: "#ef4444",
            borderColor: "#dc2626",
            editable: false,
            extendedProps: {
              isBooked: true,
            },
          };
        });

       
        setDoctorEvents(events);
      }
    };

    loadSchedule();
  }, [doctorId]);

  const handleSubmitSchedule = async () => {
    if (!selectedSlot || !doctorId) return;

    try {
      setIsProcessing(true);

      const examDate = selectedSlot.start.split("T")[0];
      const startTime = selectedSlot.start.split("T")[1].slice(0, 5);
      const endTime = selectedSlot.end.split("T")[1].slice(0, 5);

     
      console.log("📝 Creating appointment...");
      const appointmentRes = await makeAppointment({
        medicalFormId,
        appointmentData: {
          doctorId,
          date: examDate,
          startTime,
          endTime,
        },
      });

      if (appointmentRes?.error) {
     
        alert(appointmentRes.error || "Đặt lịch thất bại!");
        return;
      }

      console.log("✅ Appointment created:", appointmentRes);

    
      const appointmentId =
        appointmentRes?.appointment?._id ||
        appointmentRes?.data?._id ||
        appointmentRes?._id;

      if (!appointmentId) {
       
        alert("Không thể lấy thông tin lịch hẹn!");
        return;
      }

      console.log("💳 Creating MoMo payment for appointment:", appointmentId);

      const paymentRes = await createMoMoPayment(appointmentId);

      if (paymentRes?.error) {
        
        alert(
          "Đặt lịch thành công nhưng không thể tạo link thanh toán. Vui lòng thanh toán sau!"
        );
        setSelectedSlot(null);
        setShowConfirm(false);
        return;
      }

     
      if (paymentRes?.payUrl) {
        window.location.href = paymentRes.payUrl;
      } else {
        alert(" Đặt lịch thành công! Vui lòng thanh toán sau.");
        setDoctorEvents((prevEvents) =>
          prevEvents.map((event) => {
            if (
              event.start === selectedSlot.start &&
              event.end === selectedSlot.end
            ) {
              return {
                ...event,
                title: "Đã đặt",
                backgroundColor: "#ef4444",
                borderColor: "#dc2626",
                extendedProps: {
                  ...event.extendedProps,
                  isBooked: true,
                },
              };
            }
            return event;
          })
        );

        setSelectedSlot(null);
        setShowConfirm(false);
      }
    } catch (error) {
      alert("Có lỗi xảy ra, thử lại nhé!");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Chọn bác sĩ</label>
        <select
          className="w-full border rounded-lg p-2"
          value={doctorId || ""}
          onChange={(e) => setDoctorId(e.target.value)}
          disabled={isProcessing}
        >
          <option value="" disabled>
            -- Chọn bác sĩ --
          </option>
          {doctors.map((doctor) => (
            <option key={doctor._id} value={doctor._id}>
              {doctor.first_name} {doctor.last_name}
            </option>
          ))}
        </select>
      </div>

      <Container>
        <FullCalendar
          height="auto"
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          initialDate={today}
          selectable={!isProcessing}
          selectMirror
          allDaySlot={false}
          slotMinTime="08:00:00"
          slotMaxTime="17:00:00"
          slotDuration="00:30:00"
          firstDay={1}
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
          selectConstraint="businessHours"
          events={doctorEvents}
          selectOverlap={false}
          select={(info) => {
            const duration =
              (info.end.getTime() - info.start.getTime()) / (1000 * 60);

            if (duration === 30) {
              setDoctorEvents((prev) =>
                prev.filter((e) => e.id !== "selected-slot")
              );
              const newEvent: CalendarEvent = {
                id: "selected-slot",
                title: "Đang chọn",
                start: info.startStr,
                end: info.endStr,
                backgroundColor: "#22c55e",
                borderColor: "#16a34a",
                editable: false,
              };
              setDoctorEvents((prev) => [...prev, newEvent]);
              setSelectedSlot({
                start: info.startStr,
                end: info.endStr,
              });
            } else {
              alert(
                `Vui lòng chọn đúng 30 phút. Bạn đã chọn ${duration} phút.`
              );
            }

            info.view.calendar.unselect();
          }}
          selectAllow={(selectInfo) => {
            const start = selectInfo.start;
            const end = selectInfo.end;
            const now = new Date();

            if (start < now) return false;

            return !doctorEvents.some((event: CalendarEvent) => {
              const eventStart = new Date(event.start);
              const eventEnd = new Date(event.end);
              return start < eventEnd && end > eventStart;
            });
          }}
        />
      </Container>

      {selectedSlot && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="font-semibold text-green-800">Slot đã chọn:</p>
          <p className="text-sm text-green-700">
            {new Date(selectedSlot.start).toLocaleString("vi-VN")} -{" "}
            {new Date(selectedSlot.end).toLocaleString("vi-VN")}
          </p>
        </div>
      )}

      <div className="mt-3 flex flex-row-reverse">
        <button
          className="bg-blue-500 p-3 rounded-xl text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={() => {
            if (!selectedSlot || !doctorId) return;
            setShowConfirm(true);
          }}
          disabled={isProcessing || !selectedSlot || !doctorId}
        >
          {isProcessing ? "Đang xử lý..." : "Xác nhận đặt lịch"}
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[380px]">
            <h2 className="text-lg font-semibold mb-2">Xác nhận đặt lịch</h2>
            <p className="text-sm text-gray-600 mb-4">
              Sau khi xác nhận, bạn sẽ được chuyển đến trang thanh toán MoMo để
              hoàn tất đặt lịch.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setShowConfirm(false)}
                disabled={isProcessing}
              >
                Huỷ
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleSubmitSchedule}
                disabled={isProcessing}
              >
                {isProcessing ? "Đang xử lý..." : "Xác nhận & Thanh toán"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 