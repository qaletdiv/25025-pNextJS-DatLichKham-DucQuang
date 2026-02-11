"use server";

import { cookies } from "next/headers";

export const getAllMedicalForm = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { error: "Bạn cần đăng nhập để thực hiện chức năng này" };
    }
    const response = await fetch(`http://localhost:5000/api/v1/staffs/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      return {
        error:
          errorData.message || "Có lỗi xảy ra khi lấy danh sách phiếu khám",
      };
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching medical form:", error);
    return { error: "Có lỗi xảy ra khi kết nối đến server" };
  }
};

export const getDetailMedicalForm = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { error: "Bạn cần đăng nhập để thực hiện chức năng này" };
    }
    const response = await fetch(`http://localhost:5000/api/v1/staffs/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      return {
        error:
          errorData.message || "Có lỗi xảy ra khi lấy danh sách phiếu khám",
      };
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching medical form:", error);
    return { error: "Có lỗi xảy ra khi kết nối đến server" };
  }
};

export const updateMedicalForm = async (
  formId: string,
  status: "approved" | "rejected",
  department?: string,
  rejectedMessage?: string
) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { error: "Bạn cần đăng nhập để thực hiện chức năng này" };
    }

    const body: {
      status: string;
      department?: string;
      rejectedMessage?: string;
    } = { status };

    if (status === "approved" && department) {
      body.department = department;
    }

    if (status === "rejected" && rejectedMessage) {
      body.rejectedMessage = rejectedMessage;
    }

    const response = await fetch(
      `http://localhost:5000/api/v1/staffs/update-form/${formId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Có lỗi xảy ra khi cập nhật phiếu khám",
      };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating medical form:", error);
    return { error: "Có lỗi xảy ra khi kết nối đến server" };
  }
};


export const getAllDepartments = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { error: "Bạn cần đăng nhập để thực hiện chức năng này" };
    }

    const response = await fetch(
      "http://localhost:5000/api/v1/departments",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Có lỗi xảy ra khi lấy danh sách khoa",
      };
    }

    const result = await response.json();
    return { departments: result.departments || [] };
  } catch (error) {
    console.error("Error fetching departments:", error);
    return { error: "Có lỗi xảy ra khi kết nối đến server" };
  }
};