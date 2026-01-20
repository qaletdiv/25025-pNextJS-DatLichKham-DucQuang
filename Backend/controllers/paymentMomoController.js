import axios from "axios";
import crypto from "crypto";
import MomoPayment from "../models/PaymentMomo.js";
import Appointment from "../models/Appointment.js";

const partnerCode = "MOMO";
const accessKey = "F8BBA842ECF85";
const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
const endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";

const redirectUrl =
  "https://2e768c6db4e0.ngrok-free.app/api/payments-momo/momo-return";
const ipnUrl = "https://2e768c6db4e0.ngrok-free.app/api/payments-momo/momo-ipn";

export const createPaymentMomo = async (req, res) => {
  try {
    const { appointmentId  } = req.body;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu appointmentId hoặc amount",
      });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lịch khám",
      });
    }

    const amount = appointment.price;
    const amountStr = amount.toString();

    const orderId = `APPOINTMENT_${appointmentId}_${Date.now()}`;
    const requestId = partnerCode + Date.now();
    const orderInfo = `Thanh toán lịch khám ${appointmentId}`;
    const extraData = "";
    const requestType = "captureWallet";

   
    await MomoPayment.create({
      appointmentId,
      amount,
      orderId,
      requestId,
      status: "pending",
    });

    
    const rawSignature =
      `accessKey=${accessKey}` +
      `&amount=${amountStr}` +
      `&extraData=${extraData}` +
      `&ipnUrl=${ipnUrl}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&partnerCode=${partnerCode}` +
      `&redirectUrl=${redirectUrl}` +
      `&requestId=${requestId}` +
      `&requestType=${requestType}`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    
    const requestBody = {
      partnerCode,
      accessKey,
      requestId,
      amount: amountStr,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData,
      requestType,
      signature,
      lang: "vi",
    };

    const response = await axios.post(endpoint, requestBody, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.data.resultCode === 0) {
      return res.status(200).json({
        success: true,
        payUrl: response.data.payUrl,
        orderId,
        message: "Tạo link thanh toán thành công",
      });
    }

    return res.status(400).json({
      success: false,
      message: response.data.message || "Lỗi từ MoMo",
      resultCode: response.data.resultCode,
    });
  } catch (error) {
    console.error("Lỗi tạo thanh toán MoMo:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};


export const momoReturn = async (req, res) => {
  const { resultCode, orderId, message } = req.query;
  try {
    const payment = await MomoPayment.findOne({ orderId });
    
    if (payment && resultCode === "0" && payment.status !== "success") {
      payment.status = "success";
      await payment.save();

      await Appointment.findByIdAndUpdate(payment.appointmentId, {
        paymentStatus: "paid",
        status: "approved",
      });
    }

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    
    if (resultCode === "0") {
      return res.redirect(
        `${frontendUrl}/patient/appointment/payment-success?orderId=${orderId}`
      );
    } else {
      return res.redirect(
        `${frontendUrl}/patient/appointment/payment-failed?orderId=${orderId}&message=${encodeURIComponent(message || "Thanh toán thất bại")}`
      );
    }
  } catch (error) {
    console.error("Lỗi xử lý momoReturn:", error);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    return res.redirect(
      `${frontendUrl}/patient/appointment/payment-failed?message=${encodeURIComponent("Có lỗi xảy ra")}`
    );
  }
};

export const momoIpn = async (req, res) => {
  const { orderId, resultCode, transId } = req.body;

  const payment = await MomoPayment.findOne({ orderId });
  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }
  if (payment.status === "success") {
    return res.status(200).json({ status: "ALREADY_PROCESSED" });
  }

  if (resultCode === 0) {
    payment.status = "success";
    payment.transId = transId;
    payment.ipnReceived = true;
    await payment.save();

    await Appointment.findByIdAndUpdate(payment.appointmentId, {
      paymentStatus: "paid",
      status: "approved", 
    });

  } else {
    payment.status = "failed";
    await payment.save();
  }
  res.status(200).json({ status: "OK" });
};

