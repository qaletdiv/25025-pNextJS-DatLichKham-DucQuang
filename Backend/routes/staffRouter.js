import express from "express";
import {
  getDetailForm,
  getAllMedicalForm,
  updateMedicalForm,
} from "../controllers/staffController.js";
import { authorize } from "../middlewares/Authorize/Authorize.js";
import { authenticatedToken } from "../middlewares/AuthenticatedToken/AuthenticatedToken.js";

export const staffRouter = express.Router();

staffRouter.get(
  "/",
  authenticatedToken,
  authorize("staff"),
  getAllMedicalForm
);

staffRouter.get(
  "/:id",
  authenticatedToken,
  authorize("staff"),
  getDetailForm
);

staffRouter.put(
  "/update-form/:id",
  authenticatedToken,
  authorize("staff"),
  updateMedicalForm
);
