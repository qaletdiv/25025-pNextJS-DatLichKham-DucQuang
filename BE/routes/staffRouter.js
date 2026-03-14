import express from "express";
import {
  getDetailForm,
  getAllMedicalForm,
  updateMedicalForm,
} from "../controllers/staffController.js";
import { authorize } from "../middlewares/Authorize/Authorize.js";
import { authenticatedToken } from "../middlewares/AuthenticatedToken/AuthenticatedToken.js";
// import { getPayments } from "../controllers/paymentMomoController.js";
import { getPaymentList, confirmAppointment } from "../controllers/staffController.js";
export const staffRouter = express.Router();

staffRouter.get("/", authenticatedToken, authorize("staff"), getAllMedicalForm);

// staffRouter.get(
//   "/payments",
//   authenticatedToken,
//   authorize("staff"),
//   getPayments,
// );

staffRouter.get("/payments-stripe", authenticatedToken, authorize("staff"), getPaymentList)

staffRouter.get("/:id", authenticatedToken, authorize("staff"), getDetailForm);

staffRouter.put(
  "/update-form/:id",
  authenticatedToken,
  authorize("staff"),
  updateMedicalForm,
);

staffRouter.patch("/appointments/:id/confirm", confirmAppointment);

