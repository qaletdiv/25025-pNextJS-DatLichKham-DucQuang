"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import {
  doctorsByDepartment,
  doctorSchedule,
} from "@/app/redux/slices/patient-medical/patients.slices";
import { makeAppointment } from "@/app/redux/slices/patient-medical/patients.slices";

export default function AppointmentInput({ slots = [] }) {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { doctorsDepartment, schedule } = useAppSelector(
    (state) => state.patientMedical
  );
  const [doctorId, setDoctorId] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(doctorsByDepartment(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (doctorId) {
      dispatch(doctorSchedule(doctorId));
    }
  }, [dispatch, doctorId]);
  const today = new Date();
  const doctorEvents =
    schedule?.schedules?.map((item) => {
      const date = item.date.split("T")[0];

      return {
        id: item._id,
        title: "Đã có lịch",
        start: `${date}T${item.startTime}:00`,
        end: `${date}T${item.endTime}:00`,
        backgroundColor: "#ef4444",
        borderColor: "#ef4444",
        editable: false,
      };
    }) || [];

  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  // Kết hợp slots từ props với mock data
  const allEvents = [...doctorEvents, ...slots];

  useEffect(() => {
    if (selectedSlot) {
      console.log("Selected slot:", selectedSlot);
    }
  }, [selectedSlot]);

  const handleSubmitSchedule = () => {
    if (!selectedSlot || !doctorId) {
      console.log("Thiếu dữ liệu");
      return;
    }

    const examDate = selectedSlot.start.split("T")[0];
    const startTime = selectedSlot.start.split("T")[1].slice(0, 5);
    const endTime = selectedSlot.end.split("T")[1].slice(0, 5);

    dispatch(
      makeAppointment({
        medicalFormId: id,
        appointmentData: {
          doctorId,
          date: examDate,
          startTime,
          endTime,
        },
      })
    );
  };

  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Chọn bác sĩ</label>

        <select
          className="w-full border rounded-lg p-2"
          value={doctorId || ""}
          onChange={(e) => setDoctorId(e.target.value)}
        >
          <option value="" disabled>
            -- Chọn bác sĩ --
          </option>

          {doctorsDepartment?.doctors?.map((doctor) => (
            <option key={doctor._id} value={doctor._id}>
              {doctor.first_name} {doctor.last_name}
            </option>
          ))}
        </select>
      </div>
      <div className="bg-white rounded-xl shadow p-4">
        <FullCalendar
          height="auto"
          contentHeight="auto"
          firstDay={1}
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          initialDate={today} // Thứ 2 để test
          selectable
          selectMirror
          allDaySlot={false}
          slotMinTime="08:00:00"
          slotMaxTime="17:00:00"
          slotDuration="00:30:00"
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
          events={allEvents} // Sử dụng allEvents thay vì chỉ slots
          selectOverlap={false}
          select={(info) => {
            // Chỉ cho phép chọn đúng 30 phút
            const duration =
              (info.end.getTime() - info.start.getTime()) / (1000 * 60);

            if (duration === 30) {
              setSelectedSlot({
                start: info.startStr,
                end: info.endStr,
              });
            } else {
              // Nếu kéo quá, tự động điều chỉnh về 30 phút
              info.view.calendar.unselect();
            }
          }}
          // Ngăn không cho select vào các slot đã đặt
          selectAllow={(selectInfo) => {
            const start = selectInfo.start;
            const end = selectInfo.end;
            const now = new Date();
            if (start < now) {
              return false; // Không cho phép chọn các slot trong quá khứ
            }
            // Kiểm tra xem có bị trùng với event đã đặt không
            const hasOverlap = doctorEvents.some((event) => {
              const eventStart = new Date(event.start);
              const eventEnd = new Date(event.end);
              return start < eventEnd && end > eventStart;
            });

            return !hasOverlap;
          }}
        />

        {selectedSlot && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="font-semibold text-green-800">Slot đã chọn:</p>
            <p className="text-sm text-green-700">
              {new Date(selectedSlot.start).toLocaleString("vi-VN")} -{" "}
              {new Date(selectedSlot.end).toLocaleString("vi-VN")}
            </p>
          </div>
        )}
      </div>
      <div className="mt-3 flex flex-row-reverse">
        <button
          className="bg-blue-500 flex p-3 rounded-xl text-white cursor-pointer"
          onClick={handleSubmitSchedule}
        >
          Xác nhận đặt lịch
        </button>
      </div>
    </>
  );
}
