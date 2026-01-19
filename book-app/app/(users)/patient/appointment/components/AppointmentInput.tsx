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
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useAppDispatch();
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
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

  // Kết hợp slots từ props với mock data
  const allEvents = [...doctorEvents, ...slots];

  useEffect(() => {
    if (selectedSlot) {
      console.log("Selected slot:", selectedSlot);
    }
  }, [selectedSlot]);

  const handleSubmitSchedule = async () => {
    if (!selectedSlot || !doctorId) return;

    const examDate = selectedSlot.start.split("T")[0];
    const startTime = selectedSlot.start.split("T")[1].slice(0, 5);
    const endTime = selectedSlot.end.split("T")[1].slice(0, 5);

    const result = await dispatch(
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

    if (makeAppointment.fulfilled.match(result)) {
      dispatch(doctorSchedule(doctorId));
      setSelectedSlot(null);
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
          initialDate={today}
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
          events={allEvents}
          selectOverlap={false}
          select={(info) => {
            const duration =
              (info.end.getTime() - info.start.getTime()) / (1000 * 60);

            if (duration === 30) {
              setSelectedSlot({
                start: info.startStr,
                end: info.endStr,
              });
            } else {
              info.view.calendar.unselect();
            }
          }}
          selectAllow={(selectInfo) => {
            const start = selectInfo.start;
            const end = selectInfo.end;
            const now = new Date();
            if (start < now) {
              return false;
            }

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

        {showConfirm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[380px]">
              <h2 className="text-lg font-semibold mb-2">Xác nhận đặt lịch</h2>
              <p className="text-sm text-gray-600 mb-4">
                Bạn chắc chắn muốn đặt lịch vào khung giờ này
              </p>

              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 border rounded-lg"
                  onClick={() => setShowConfirm(false)}
                >
                  Huỷ
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  onClick={() => {
                    handleSubmitSchedule(), setShowConfirm(false);
                  }}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 flex flex-row-reverse">
        <button
          className="bg-blue-500 flex p-3 rounded-xl text-white cursor-pointer"
          onClick={() => {
            if (!selectedSlot || !doctorId) return;
            setShowConfirm(true);
          }}
        >
          Xác nhận đặt lịch
        </button>
      </div>
    </>
  );
}
