"use client";

import {
  Calendar,
  Clock,
  User,
  FileText,
  Video,
  Banknote,
  Hash,
  CheckCircle2,
} from "lucide-react";

interface Pill {
  _id: string;
  name: string;
  description: string;
  unit: string;
  price: number;
}

interface Medicine {
  _id: string;
  pill: Pill;
  dosage: string;
  quantity: number;
  instruction: string;
}

interface Prescription {
  _id: string;
  medicines: Medicine[];
  note: string;
}

interface AppointmentDetailData {
  _id: string;
  scheduleId: Schedule;
  medicalForm: string;
  prescription: Prescription | null;
  status: string;
  medicalStatus: string;
  meetingUrl: string;
  price: number;
  createdAt: string;
  __v: number;
}

type AppointmentProp = {
  id: string;
  data: AppointmentDetailData;
};

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  approved: { label: "Approved", color: "#16a34a", bg: "#dcfce7" },
  pending: { label: "Pending", color: "#d97706", bg: "#fef3c7" },
  rejected: { label: "Rejected", color: "#dc2626", bg: "#fee2e2" },
  cancelled: { label: "Cancelled", color: "#6b7280", bg: "#f3f4f6" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

function formatCreatedAt(dateStr: string) {
  return new Date(dateStr).toLocaleString("vi-VN");
}

export default function AppointmentDetail({ id, data }: AppointmentProp) {
  const status = statusConfig[data.status] ?? statusConfig["pending"];

  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        maxWidth: 680,
        margin: "2rem auto",
        padding: "0 1rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
          borderRadius: "20px 20px 0 0",
          padding: "2rem 2.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <p
            style={{
              color: "#94a3b8",
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Appointment Detail
          </p>
          <h1
            style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}
          >
            Lịch Khám Bệnh
          </h1>
          <p
            style={{
              color: "#64748b",
              fontSize: 12,
              marginTop: 6,
              fontFamily: "monospace",
            }}
          >
            #{id.slice(-8).toUpperCase()}
          </p>
        </div>
        <span
          style={{
            background: status.bg,
            color: status.color,
            padding: "6px 14px",
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <CheckCircle2 size={14} />
          {status.label}
        </span>
      </div>

      {/* Body */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderTop: "none",
          borderRadius: "0 0 20px 20px",
          padding: "2rem 2.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        {/* Schedule Section */}
        <Section title="Thông tin lịch hẹn">
          <Row
            icon={<Calendar size={15} />}
            label="Ngày khám"
            value={formatDate(data.scheduleId.date)}
          />
          <Row
            icon={<Clock size={15} />}
            label="Giờ khám"
            value={`${data.scheduleId.startTime} – ${data.scheduleId.endTime}`}
          />
          <Row
            icon={<User size={15} />}
            label="Mã bác sĩ"
            value={data.scheduleId.doctorId}
            mono
          />
          <Row
            icon={<Hash size={15} />}
            label="Mã lịch"
            value={data.scheduleId._id}
            mono
          />
        </Section>

        <Divider />

        {/* Appointment Info */}
        <Section title="Thông tin cuộc hẹn">
          <Row
            icon={<FileText size={15} />}
            label="Mã phiếu khám"
            value={data.medicalForm}
            mono
          />
          <Row
            icon={<Video size={15} />}
            label="Link cuộc họp"
            value={
              <a
                href={data.meetingUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "#2563eb",
                  textDecoration: "none",
                  fontWeight: 500,
                  wordBreak: "break-all",
                }}
              >
                {data.meetingUrl}
              </a>
            }
          />
        </Section>

        <Divider />

        {data.prescription && (
          <>
            <Divider />
            <Section title="Toa thuốc">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {data.prescription.medicines.map((medicine) => (
                  <div
                    key={medicine._id}
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: 10,
                      padding: "10px 14px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontWeight: 600,
                          color: "#1e293b",
                          fontSize: 14,
                          marginBottom: 2,
                        }}
                      >
                        {medicine.pill.name}
                      </p>
                      <p style={{ color: "#64748b", fontSize: 12 }}>
                        {medicine.dosage} · {medicine.quantity}{" "}
                        {medicine.pill.unit}
                      </p>
                      <p
                        style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}
                      >
                        {medicine.instruction}
                      </p>
                    </div>
                    <span
                      style={{
                        background: "#eff6ff",
                        color: "#2563eb",
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: 999,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {/* {formatPrice(medicine.pill.price * medicine.quantity)} */}
                    </span>
                  </div>
                ))}

                {/* Tổng tiền thuốc */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 4px",
                    borderTop: "1px dashed #e2e8f0",
                    marginTop: 4,
                  }}
                >
                  {/* <span style={{ color: "#64748b", fontSize: 13 }}>
                    Tổng tiền thuốc
                  </span>
                  <span
                    style={{ fontWeight: 700, color: "#1e293b", fontSize: 14 }}
                  >
                    {formatPrice(
                      data.prescription.medicines.reduce(
                        (sum, m) => sum + m.pill.price * m.quantity,
                        0,
                      ),
                    )}
                  </span> */}
                </div>

                {/* Ghi chú */}
                {data.prescription.note && (
                  <p
                    style={{
                      color: "#64748b",
                      fontSize: 13,
                      fontStyle: "italic",
                    }}
                  >
                    📝 {data.prescription.note}
                  </p>
                )}
              </div>
            </Section>
          </>
        )}

        {/* Price */}
        <div
          style={{
            background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
            border: "1px solid #bbf7d0",
            borderRadius: 12,
            padding: "1rem 1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#15803d",
              fontWeight: 600,
            }}
          >
            <Banknote size={18} />
            <span>Phí khám</span>
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: "#15803d" }}>
            {formatPrice(data.price)}
          </span>
        </div>
        {/* Footer */}
        <p
          style={{
            textAlign: "right",
            color: "#94a3b8",
            fontSize: 12,
            marginTop: 4,
          }}
        >
          Tạo lúc: {formatCreatedAt(data.createdAt)}
        </p>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "#94a3b8",
          marginBottom: 12,
        }}
      >
        {title}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {children}
      </div>
    </div>
  );
}

function Divider() {
  return (
    <hr
      style={{
        border: "none",
        borderTop: "1px solid #f1f5f9",
        margin: "0.25rem 0",
      }}
    />
  );
}

function Row({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <span
        style={{
          color: "#64748b",
          marginTop: 2,
          flexShrink: 0,
          background: "#f8fafc",
          borderRadius: 6,
          padding: 5,
          display: "flex",
          alignItems: "center",
        }}
      >
        {icon}
      </span>
      <div style={{ flex: 1 }}>
        <p style={{ color: "#94a3b8", fontSize: 11, marginBottom: 2 }}>
          {label}
        </p>
        <p
          style={{
            color: "#1e293b",
            fontSize: 14,
            fontWeight: 500,
            fontFamily: mono ? "monospace" : "inherit",
            wordBreak: "break-all",
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
