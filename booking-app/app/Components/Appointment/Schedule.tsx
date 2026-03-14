"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import Container from "../Common/Container/Container";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

import {
  fetchDoctorByDepartment,
  getDoctorScheduleByDoctor,
  makeAppointment,
  createStripePayment,
} from "@/app/(Role)/patient/action";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

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
  extendedProps?: { isBooked: boolean };
}

interface SelectedSlot {
  start: string;
  end: string;
}

interface AppointmentInputProps {
  medicalFormId: string;
}

// Form thanh toán Stripe
function CheckoutForm({ onSuccess, onClose }: { onSuccess: () => void; onClose: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isPaying, setIsPaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setIsPaying(true);
    setErrorMsg(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: "if_required",
    });

    if (error) {
      setErrorMsg(error.message || "Thanh toán thất bại!");
    } else {
      onSuccess();
    }
    setIsPaying(false);
  };

  return (
    <div className="space-y-4">
      <PaymentElement />
      {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
      <div className="flex justify-end gap-2 mt-4">
        <button
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          onClick={onClose}
          disabled={isPaying}
        >
          Huỷ
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={handlePay}
          disabled={isPaying || !stripe}
        >
          {isPaying ? "Đang xử lý..." : "Thanh toán"}
        </button>
      </div>
    </div>
  );
}

export default function AppointmentInput({ medicalFormId }: AppointmentInputProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [doctorEvents, setDoctorEvents] = useState<CalendarEvent[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const today = new Date();

  useEffect(() => {
    if (!medicalFormId) return;
    const loadDoctors = async () => {
      const res = await fetchDoctorByDepartment(medicalFormId);
      if (!res?.error) setDoctors(res.doctors || res.data || []);
    };
    loadDoctors();
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
            extendedProps: { isBooked: true },
          };
        });
        setDoctorEvents(events);
        setSelectedSlot(null);
      }
    };
    loadSchedule();
  }, [doctorId, refreshKey]);

  useEffect(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const handleSubmitSchedule = async () => {
    if (!selectedSlot || !doctorId) return;

    try {
      setIsProcessing(true);

      const examDate = selectedSlot.start.split("T")[0];
      const startTime = selectedSlot.start.split("T")[1].slice(0, 5);
      const endTime = selectedSlot.end.split("T")[1].slice(0, 5);

      const appointmentRes = await makeAppointment({
        medicalFormId,
        appointmentData: { doctorId, date: examDate, startTime, endTime },
      });

      if (appointmentRes?.error) {
        alert(appointmentRes.error || "Đặt lịch thất bại!");
        return;
      }

      const appointmentId =
        appointmentRes?.appointment?._id ||
        appointmentRes?.data?._id ||
        appointmentRes?._id;

      if (!appointmentId) {
        alert("Không thể lấy thông tin lịch hẹn!");
        return;
      }

      const paymentRes = await createStripePayment(appointmentId);

      if (paymentRes?.error) {
        alert("Không thể tạo link thanh toán!");
        return;
      }

      if (paymentRes?.clientSecret) {
        setClientSecret(paymentRes.clientSecret);
        setShowConfirm(false);
        setShowPayment(true);
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
          <option value="" disabled>-- Chọn bác sĩ --</option>
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
            { daysOfWeek: [1, 2, 3, 4, 5, 6], startTime: "08:00", endTime: "12:30" },
            { daysOfWeek: [1, 2, 3, 4, 5, 6], startTime: "13:30", endTime: "17:00" },
          ]}
          selectConstraint="businessHours"
          events={doctorEvents}
          selectOverlap={false}
          select={(info) => {
            const duration = (info.end.getTime() - info.start.getTime()) / (1000 * 60);
            if (duration === 30) {
              setDoctorEvents((prev) => prev.filter((e) => e.id !== "selected-slot"));
              setDoctorEvents((prev) => [...prev, {
                id: "selected-slot",
                title: "Đang chọn",
                start: info.startStr,
                end: info.endStr,
                backgroundColor: "#22c55e",
                borderColor: "#16a34a",
                editable: false,
              }]);
              setSelectedSlot({ start: info.startStr, end: info.endStr });
            } else {
              alert(`Vui lòng chọn đúng 30 phút. Bạn đã chọn ${duration} phút.`);
            }
            info.view.calendar.unselect();
          }}
          selectAllow={(selectInfo) => {
            const { start, end } = selectInfo;
            if (start < new Date()) return false;
            return !doctorEvents.some((event) => {
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
          onClick={() => { if (!selectedSlot || !doctorId) return; setShowConfirm(true); }}
          disabled={isProcessing || !selectedSlot || !doctorId}
        >
          {isProcessing ? "Đang xử lý..." : "Xác nhận đặt lịch"}
        </button>
      </div>

      {/* Modal xác nhận */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[380px]">
            <h2 className="text-lg font-semibold mb-2">Xác nhận đặt lịch</h2>
            <p className="text-sm text-gray-600 mb-4">
              Sau khi xác nhận, bạn sẽ thanh toán qua Stripe để hoàn tất đặt lịch.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
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

      {/* Modal thanh toán Stripe */}
      {showPayment && clientSecret && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[480px]">
            <h2 className="text-lg font-semibold mb-4">Thanh toán</h2>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm
                onSuccess={() => {
                  setShowPayment(false);
                  setSelectedSlot(null);
                  setRefreshKey((prev) => prev + 1);
                  alert("Đặt lịch và thanh toán thành công!");
                }}
                onClose={() => setShowPayment(false)}
              />
            </Elements>
          </div>
        </div>
      )}
    </>
  );
}