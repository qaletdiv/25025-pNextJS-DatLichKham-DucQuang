// import axios from "axios";
// import crypto from "crypto";
// import MomoPayment from "../models/PaymentMomo.js";
// import Appointment from "../models/Appointment.js";
// import Account from "../models/Account.js";

// const partnerCode = "MOMO";
// const accessKey = "F8BBA842ECF85";
// const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
// const endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";

// // SỬA: Nên lưu trong .env
// const redirectUrl =
//   process.env.MOMO_REDIRECT_URL ||
//   "https://4ca4-2402-800-63a6-ea9b-599f-dd3e-a9a4-207a.ngrok-free.app/api/payments-momo/momo-return";
// const ipnUrl =
//   process.env.MOMO_IPN_URL ||
//   "https://4ca4-2402-800-63a6-ea9b-599f-dd3e-a9a4-207a.ngrok-free.app/api/payments-momo/momo-ipn";

// export const createPaymentMomo = async (req, res) => {
//   try {
//     const { appointmentId } = req.body;

//     if (!appointmentId) {
//       return res.status(400).json({
//         success: false,
//         message: "Thiếu appointmentId",
//       });
//     }

//     const appointment = await Appointment.findById(appointmentId);

//     if (!appointment) {
//       return res.status(404).json({
//         success: false,
//         message: "Không tìm thấy lịch khám",
//       });
//     }

//     const amount = appointment.price;

//     // SỬA: Tạo orderId và requestId unique hơn
//     const timestamp = Date.now();
//     const randomStr = Math.random().toString(36).substring(2, 9);
//     const orderId = `APT_${appointmentId}_${timestamp}_${randomStr}`;
//     const requestId = `${partnerCode}_${timestamp}_${randomStr}`;

//     const orderInfo = `Thanh toan lich kham ${appointmentId}`; // Bỏ dấu tiếng Việt
//     const extraData = "";
//     const requestType = "captureWallet";

//     // Kiểm tra xem có payment pending nào chưa
//     const existingPayment = await MomoPayment.findOne({
//       appointmentId,
//       status: "pending",
//     });

//     if (existingPayment) {
//       // Xóa payment cũ hoặc cập nhật
//       await MomoPayment.deleteOne({ _id: existingPayment._id });
//     }

//     // Tạo payment record
//     await MomoPayment.create({
//       appointmentId,
//       amount,
//       orderId,
//       requestId,
//       status: "pending",
//     });

//     // SỬA: Tạo rawSignature theo đúng thứ tự alphabet
//     const rawSignature =
//       `accessKey=${accessKey}` +
//       `&amount=${amount}` + // SỬA: Dùng number, không convert sang string
//       `&extraData=${extraData}` +
//       `&ipnUrl=${ipnUrl}` +
//       `&orderId=${orderId}` +
//       `&orderInfo=${orderInfo}` +
//       `&partnerCode=${partnerCode}` +
//       `&redirectUrl=${redirectUrl}` +
//       `&requestId=${requestId}` +
//       `&requestType=${requestType}`;

//     console.log("=== MOMO DEBUG ===");
//     console.log("OrderId:", orderId);
//     console.log("RequestId:", requestId);
//     console.log("Amount:", amount, typeof amount);
//     console.log("RawSignature:", rawSignature);

//     const signature = crypto
//       .createHmac("sha256", secretKey)
//       .update(rawSignature)
//       .digest("hex");

//     console.log("Signature:", signature);

//     // SỬA: Request body với amount là number
//     const requestBody = {
//       partnerCode,
//       accessKey,
//       requestId,
//       amount: amount, // SỬA: Phải là number, không phải string
//       orderId,
//       orderInfo,
//       redirectUrl,
//       ipnUrl,
//       extraData,
//       requestType,
//       signature,
//       lang: "vi",
//     };

//     console.log("Request Body:", JSON.stringify(requestBody, null, 2));

//     const response = await axios.post(endpoint, requestBody, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     console.log("MoMo Response:", response.data);

//     if (response.data.resultCode === 0) {
//       return res.status(200).json({
//         success: true,
//         payUrl: response.data.payUrl,
//         orderId,
//         message: "Tạo link thanh toán thành công",
//       });
//     }

//     // Log lỗi từ MoMo
//     console.error("MoMo Error:", response.data);

//     return res.status(400).json({
//       success: false,
//       message: response.data.message || "Lỗi từ MoMo",
//       resultCode: response.data.resultCode,
//       details: response.data, // Thêm chi tiết để debug
//     });
//   } catch (error) {
//     console.error(
//       "Lỗi tạo thanh toán MoMo:",
//       error.response?.data || error.message,
//     );
//     return res.status(500).json({
//       success: false,
//       message: "Lỗi server",
//       error: error.response?.data || error.message,
//     });
//   }
// };

// export const momoReturn = async (req, res) => {
//   const { resultCode, orderId, message } = req.query;

//   console.log("=== MOMO RETURN ===");
//   console.log("ResultCode:", resultCode);
//   console.log("OrderId:", orderId);
//   console.log("Message:", message);

//   try {
//     const payment = await MomoPayment.findOne({ orderId });

//     if (!payment) {
//       console.error("Payment not found:", orderId);
//       const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
//       return res.redirect(
//         `${frontendUrl}/patient/appointment/payment-failed?message=${encodeURIComponent("Không tìm thấy giao dịch")}`,
//       );
//     }

//     // SỬA: resultCode là string "0", không phải number 0
//     if (resultCode === "0" && payment.status !== "success") {
//       payment.status = "success";
//       await payment.save();

//       await Appointment.findByIdAndUpdate(payment.appointmentId, {
//         paymentStatus: "paid",
//         status: "approved",
//       });

//       console.log(
//         "Payment success, appointment updated:",
//         payment.appointmentId,
//       );
//     }

//     const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

//     if (resultCode === "0") {
//       return res.redirect(
//         `${frontendUrl}/patient/appointment/payment-success?orderId=${orderId}`,
//       );
//     } else {
//       return res.redirect(
//         `${frontendUrl}/patient/appointment/payment-failed?orderId=${orderId}&message=${encodeURIComponent(message || "Thanh toán thất bại")}`,
//       );
//     }
//   } catch (error) {
//     console.error("Lỗi xử lý momoReturn:", error);
//     const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
//     return res.redirect(
//       `${frontendUrl}/patient/appointment/payment-failed?message=${encodeURIComponent("Có lỗi xảy ra")}`,
//     );
//   }
// };

// export const momoIpn = async (req, res) => {
//   console.log("=== MOMO IPN ===");
//   console.log("IPN Body:", req.body);

//   const { orderId, resultCode, transId } = req.body;

//   try {
//     const payment = await MomoPayment.findOne({ orderId });

//     if (!payment) {
//       console.error("Payment not found in IPN:", orderId);
//       return res.status(404).json({ message: "Payment not found" });
//     }

//     if (payment.status === "success") {
//       console.log("Payment already processed:", orderId);
//       return res.status(200).json({ status: "ALREADY_PROCESSED" });
//     }

//     // SỬA: resultCode có thể là number hoặc string
//     if (resultCode === 0 || resultCode === "0") {
//       payment.status = "success";
//       payment.transId = transId;
//       payment.ipnReceived = true;
//       await payment.save();

//       await Appointment.findByIdAndUpdate(payment.appointmentId, {
//         paymentStatus: "paid",
//         status: "approved",
//       });

//       console.log("IPN: Payment success, appointment updated");
//     } else {
//       payment.status = "failed";
//       await payment.save();
//       console.log("IPN: Payment failed");
//     }

//     res.status(200).json({ status: "OK" });
//   } catch (error) {
//     console.error("Error in IPN:", error);
//     res.status(500).json({ status: "ERROR", message: error.message });
//   }
// };

// export const getPayments = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1 // Trang hiện tại
//     const limit = parseInt(req.query.limit) || 10 // Số item mỗi trang
//     const skip = (page - 1) * limit
//     const [payments, total] = await Promise.all([
//       MomoPayment.find().skip(skip).limit(limit).sort({createdAt: -1}),
//       MomoPayment.countDocuments()
//     ])
//     res.status(200).json({
//       message: "Lấy danh sách giao dịch thanh toán",
//       data: payments,
//       pagination: {
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total/ limit),
//       }
//     });
//   } catch (error) {
//     console.error("Lỗi khi lấy danh sách giao dịch", error);
//     res.status(500).json({ message: "Lỗi server" });
//   }
// };
