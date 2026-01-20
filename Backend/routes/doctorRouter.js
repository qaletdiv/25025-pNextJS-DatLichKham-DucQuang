import express from "express";
import { authorize } from "../middlewares/Authorize/Authorize.js";
import { authenticatedToken } from "../middlewares/AuthenticatedToken/AuthenticatedToken.js";
import {
  createDoctor,
  getSchedule,
  updateAppointmentLink,
} from "../controllers/doctorController.js";
export const doctorRouter = express.Router();

doctorRouter.post("/", authenticatedToken, authorize("doctor"), createDoctor);
doctorRouter.get(
  "/schedules",
  authenticatedToken,
  authorize("doctor"),
  getSchedule,
);
doctorRouter.patch(
  "/appointments/:id/meeting-url",
  authenticatedToken,
  authorize("doctor"),
  updateAppointmentLink,
);
