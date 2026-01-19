"use server";
import { redirect } from "next/navigation";

export async function payAppointment(formData: FormData) {
  const appointmentId = formData.get("id");

  const response = await fetch(
    "http://localhost:5000/api/payments-momo/create-payment-momo",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointmentId }),
    }
  );

  if (!response.ok) {
    throw new Error("Không thể tạo thanh toán");
  }

  const data = await response.json();

  if (!data.success || !data.payUrl) {
    throw new Error("API trả dữ liệu không hợp lệ");
  }
  redirect(data.payUrl);
}
