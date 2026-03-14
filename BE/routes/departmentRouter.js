import express from "express"; 
import {createDepartment, getAllDepartment} from "../controllers/departmentController.js"

export const departmentRouter = express.Router(); 

departmentRouter.get("/", getAllDepartment)
departmentRouter.post("/", createDepartment)