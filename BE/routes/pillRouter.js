import express from "express";
import { createPill, getPills } from "../controllers/pillController.js";
import { authenticatedToken } from "../middlewares/AuthenticatedToken/AuthenticatedToken.js";
import { authorize } from "../middlewares/Authorize/Authorize.js";
export const pillRouter = express.Router();

pillRouter.post("/", authenticatedToken, authorize("doctor"), createPill);
pillRouter.get("/", authenticatedToken, authorize("doctor"), getPills);
