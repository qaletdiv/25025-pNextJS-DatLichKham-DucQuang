import { axiosClient } from "@/utils/axiosClient";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  appointments: [],
  error: null,
  loading: false,
};

export const fetchAllAppointment = createAsyncThunk(
  "patientAppointment/getAllAppointment",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/patients/appointments");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi lấy danh sách lịch khám"
      );
    }
  }
);

const patientAppointmentSlice = createSlice({
  name: "patientAppointment",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload.appointments;
      })
      .addCase(fetchAllAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default patientAppointmentSlice.reducer;
