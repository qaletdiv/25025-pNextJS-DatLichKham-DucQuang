import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "@/utils/axiosClient";

const initialState = {
  schedules: [],
  loading: false,
  error: null,
};

export const getAllSchedules = createAsyncThunk(
  "doctorSchedule/getAllSchedules",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/doctors/schedules");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi lấy danh sách lich khám",
      );
    }
  },
);

export const updateAppointmentMeetUrl = createAsyncThunk(
  "doctorAppointment/updateAppointmentMeetUrl",
  async (
    { id, meetingUrl }: { id: string; meetingUrl: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosClient.patch(
        `/doctors/appointments/${id}/meeting-url`,
        { meetingUrl },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Cập nhật link thất bại");
    }
  },
);

const doctorSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload.schedules;
        state.error = null;
      })
      .addCase(getAllSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAppointmentMeetUrl.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAppointmentMeetUrl.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.data;
        state.schedules.forEach((schedule) => {
          const idx = schedule.appointments.findIndex(
            (app) => app._id === updated._id,
          );
          if (idx !== -1) {
            schedule.appointments[idx].meetingUrl = updated.meetingUrl;
            schedule.appointments[idx].updatedAt = updated.updatedAt;
          }
        });
      })
      .addCase(updateAppointmentMeetUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default doctorSlice.reducer;
