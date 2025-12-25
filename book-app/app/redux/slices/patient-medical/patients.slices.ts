import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "@/utils/axiosClient";

interface PatientMedicalState {
  medicalList: any[];
  medicalDetail: any | null;
  doctorsDepartment: any | null;
  schedule: any[];
  appointments: any;
  loading: boolean;
  error: string | null;
}

const initialState: PatientMedicalState = {
  medicalList: [],
  medicalDetail: null,
  doctorsDepartment: [],
  schedule: [],
  appointments: {},
  loading: false,
  error: null,
};

export const getAllMedicals = createAsyncThunk(
  "patientMedical/getAllMedicals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/patients/get-forms");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi lấy danh sách phiếu"
      );
    }
  }
);

export const getDetailMedical = createAsyncThunk(
  "patientMedical/getDetailMedical",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/patients/get-form/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi lấy chi tiết phiếu"
      );
    }
  }
);

export const doctorsByDepartment = createAsyncThunk(
  "patientDoctor/doctorsByDepartment",
  async (departmentId: string, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`http://localhost:5000/api/v1/patients/get-doctors/${departmentId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi lấy danh sách bác sĩ theo khoa"
      );
    }
})

export const doctorSchedule = createAsyncThunk(
  "patientDoctorSchedule/doctorSchedule",
  async (doctorId: string, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`http://localhost:5000/api/v1/patients/get-doctor-schedules/${doctorId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi lấy lịch khám bệnh của bác sĩ"
      );
    }
})

export const makeAppointment = createAsyncThunk(
  "patientMakeAppointment/makeAppointment",
  async ( {medicalFormId, appointmentData},{ rejectWithValue }) => {
    try {
      const response = await axiosClient.post(`http://localhost:5000/api/v1/patients/appointments/${medicalFormId}`, appointmentData);
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi đặt lịch khám bệnh"
      );
    }
  }
)
 
const patientSlice = createSlice({
  name: "patientMedical",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllMedicals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMedicals.fulfilled, (state, action) => {
        state.loading = false;
        state.medicalList = action.payload.forms || action.payload;
        state.error = null;
      })
      .addCase(getAllMedicals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getDetailMedical.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDetailMedical.fulfilled, (state, action) => {
        state.loading = false;
        state.medicalDetail = action.payload;
        state.error = null;
      })
      .addCase(getDetailMedical.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(doctorsByDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(doctorsByDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorsDepartment = action.payload;
        state.error = null;
      })
      .addCase(doctorsByDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(doctorSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(doctorSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.schedule = action.payload;
        state.error = null;
      })
      .addCase(doctorSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export default patientSlice.reducer;
