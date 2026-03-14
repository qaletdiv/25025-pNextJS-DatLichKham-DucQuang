"use server";

import { cookies } from "next/headers";

export const getSchedule = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { error: "Bạn cần đăng nhập để thực hiện chức năng này" };
    }
    const response = await fetch(
      "http://localhost:5000/api/v1/doctors/schedules",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Có lỗi xảy ra khi lấy danh sách lịch khám",
      };
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return { error: "Có lỗi xảy ra khi kết nối đến server" };
  }
};

export async function updateMeetingUrl(appointmentId: string, meetingUrl: string) {
  try {
   const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { error: "Bạn cần đăng nhập để thực hiện chức năng này" };
    }

    const response = await fetch(
      `http://localhost:5000/api/v1/doctors/appointments/${appointmentId}/meeting-url`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ meetingUrl }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || "Có lỗi xảy ra khi cập nhật link meeting" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error updating meeting URL:", error);
    return { error: "Có lỗi xảy ra khi cập nhật link meeting" };
  }
}



export const getPills = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const response = await fetch("http://localhost:5000/api/v1/pills/", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) return { pills: [] };
  return response.json();
};

export const createPrescription = async (data: {
  appointmentId: string;
  medicines: Array<{
    pill: string;
    dosage: string;
    quantity: number;
    instruction: string;
  }>;
  note: string;
}) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const response = await fetch(
    "http://localhost:5000/api/v1/doctors/prescriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) return { error: "Kê toa thất bại" };
  return response.json();
};