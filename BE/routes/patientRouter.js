import express from "express";
import { createMedicalForm, getAllMedicalForm, getDetailForm, getAllDoctorDepartment, getDoctorWithSchedules} from "../controllers/patientController.js";
import { createAppointment, getAllAppointment, getDetailAppoitment } from "../controllers/appointmentController.js";
import { uploadMultiple } from "../middlewares/uploadCloudinary/uploadCloudinary.js";
import { authorize } from "../middlewares/Authorize/Authorize.js";
import { authenticatedToken } from "../middlewares/AuthenticatedToken/AuthenticatedToken.js";

export const patientRouter = express.Router();

patientRouter.post(
  "/create-form",
  authenticatedToken,
  authorize("patient"),
  uploadMultiple,
  createMedicalForm
);

patientRouter.get("/get-forms", authenticatedToken, authorize("patient"), getAllMedicalForm)
patientRouter.get("/get-form/:id", authenticatedToken, authorize("patient"), getDetailForm)
patientRouter.get("/get-doctors/:id", authenticatedToken, authorize("patient"), getAllDoctorDepartment)
patientRouter.get("/get-doctor-schedules/:id", authenticatedToken, authorize("patient"), getDoctorWithSchedules)
patientRouter.post("/appointments/:id", authenticatedToken, authorize("patient"), createAppointment)
patientRouter.get("/appointments", authenticatedToken, authorize("patient"), getAllAppointment)
patientRouter.get("/appointments/:id", authenticatedToken, authorize("patient"), getDetailAppoitment)