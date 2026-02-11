"use server";

import { cookies } from "next/headers";
import {
  type createMedicalFormResponse,
  type fetchMedicalFormsResponse,
  type fetchDetailMedicalFormResponse,
} from "@/app/types/Api/MedicalFormType";

export const createMedicalForm = async (
  formData: FormData,
): Promise<createMedicalFormResponse | { error: string }> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { error: "Bạn cần đăng nhập để thực hiện chức năng này" };
    }

    const response = await fetch(
      "http://localhost:5000/api/v1/patients/create-form",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.message || "Có lỗi xảy ra khi tạo phiếu khám" };
    }

    const result: createMedicalFormResponse = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating medical form:", error);
    return { error: "Có lỗi xảy ra khi kết nối đến server" };
  }
};

export const fetchMedicalForm = async (): Promise<
  fetchMedicalFormsResponse | { error: string }
> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { error: "Bạn cần đăng nhập để thực hiện chức năng này" };
    }
    const response = await fetch(
      "http://localhost:5000/api/v1/patients/get-forms",
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
        error:
          errorData.message || "Có lỗi xảy ra khi lấy danh sách phiếu khám",
      };
    }
    const data: fetchMedicalFormsResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching medical form:", error);
    return { error: "Có lỗi xảy ra khi kết nối đến server" };
  }
};

export const fetchDetailMedicalForm = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const response = await fetch(
      `http://localhost:5000/api/v1/patients/get-form/${id}`,
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
        error: errorData.message || "Có lỗi xảy ra khi chi tiết phiếu khám",
      };
    }
    const data: fetchDetailMedicalFormResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching medical form:", error);
    return { error: "Có lỗi xảy ra khi kết nối đến server" };
  }
};

export const fetchDoctorByDepartment = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const response = await fetch(
      `http://localhost:5000/api/v1/patients/get-doctors/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching doctor by department:", error);
    return { error: "Có lỗi xảy ra khi kết nối đến server" };
  }
};

export const getDoctorScheduleByDoctor = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { error: "Bạn cần đăng nhập để thực hiện chức năng này" };
    }

    const response = await fetch(
      `http://localhost:5000/api/v1/patients/get-doctor-schedules/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      return {
        error: errorData.message || "Có lỗi xảy ra khi lấy lịch bác sĩ",
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching doctor schedule:", error);
    return { error: "Có lỗi xảy ra khi kết nối đến server" };
  }
};

export async function makeAppointment({
  medicalFormId,
  appointmentData,
}: {
  medicalFormId: string;
  appointmentData: {
    doctorId: string;
    date: string;
    startTime: string;
    endTime: string;
  };
}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { error: "Bạn cần đăng nhập để thực hiện chức năng này" };
    }

    const response = await fetch(
      `http://localhost:5000/api/v1/patients/appointments/${medicalFormId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: appointmentData.doctorId,
          date: appointmentData.date,
          startTime: appointmentData.startTime,
          endTime: appointmentData.endTime,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.message || "Không thể tạo lịch khám" };
    }

    const data = await response.json();

    return {
      success: true,
      appointment: data.appointment,
      message: data.message,
    };
  } catch (error) {
    console.error("Error making appointment:", error);
    return { error: "Có lỗi xảy ra khi đặt lịch" };
  }
}

export const createMoMoPayment = async (appointmentId: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { error: "Bạn cần đăng nhập để thực hiện chức năng này" };
    }

    const response = await fetch(
      "http://localhost:5000/api/payments-momo/create-payment-momo",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          appointmentId,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Có lỗi xảy ra khi tạo thanh toán",
      };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating MoMo payment:", error);
    return { error: "Có lỗi xảy ra khi kết nối đến server" };
  }
};

export const fetchAppointment = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { error: "Bạn cần đăng nhập để thực hiện chức năng này" };
    }
    const response = await fetch(
      "http://localhost:5000/api/v1/patients/appointments",
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
        error: errorData.message || "Có lỗi xảy ra khi tạo thanh toán",
      };
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating MoMo payment:", error);
    return { error: "Có lỗi xảy ra khi kết nối đến server" };
  }
};
