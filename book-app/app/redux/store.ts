import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/app/redux/slices/auth/auth.slices";
import medicalReducer from "@/app/redux/slices/staff-medical/medical.slices";
import departmentReducer from "@/app/redux/slices/department/department.slices";
import patientReducer from "@/app/redux/slices/patient-medical/patients.slices"
import patienAppointmentReducer from "@/app/redux/slices/patient-appointment/patientAppointment.slices"
import doctorReducer from "@/app/redux/slices/doctor/doctors.slices"

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      medical: medicalReducer,
      department: departmentReducer,
      patientMedical: patientReducer,
      patientAppointment: patienAppointmentReducer,
      doctor: doctorReducer
    },
  });
};
