"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "@/utils/axiosClient";
import {
  MedicalForm,
  CreateMedicalFormPayload,
} from "@/lib/MedicalForm/MedicalFormType/MedicalForm";
import { MedicalFormListResponse } from "@/lib/MedicalForm/MedicalFormItemType/MedicalFormItem";
const initialState = {
  medicalFormCreate: null,
  medicalList: [],
  medicalForm: null,
  medicalFormUpdate: null,
  loading: false,
  error: null,
};

export const getAllMedicalForm = createAsyncThunk<MedicalFormListResponse>(
  "medicals/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/staffs");
      return response.data.forms;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi lấy danh sách phiếu"
      );
    }
  }
);


export const getDetailMedicalForm = createAsyncThunk<MedicalForm>(
  "medicals/getDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/staffs/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi tạo phiếu khám"
      );
    }
  }
);

export const createMedicalForm = createAsyncThunk<
  MedicalForm,
  CreateMedicalFormPayload
>(
  "medicals/createMedicalForm",
  async ({ description, images, pastMedicalHistory }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("pastMedicalHistory", pastMedicalHistory);
      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await axiosClient.post(
        "/patients/create-form",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi tạo phiếu khám"
      );
    }
  }
);

export const updateMedicalForm = createAsyncThunk(
  "medicals/updateMedicalForm",
  async (
    data: { id: string; status: string; rejectedMessage?: string; department?: string },
    { rejectWithValue }
  ) => {
    try {
      const { id, ...body } = data;
      console.log("Sending update request:", { id, body });
      const response = await axiosClient.put(`/staffs/update-form/${id}`, body);
      return response.data;
    } catch (error: any) {
      console.log("Update error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Lỗi cập nhật phiếu khám"
      );
    }
  }
)

const medicalSlice = createSlice({
  name: "medicals",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(createMedicalForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMedicalForm.fulfilled, (state, action) => {
        state.loading = false;
        state.medicalFormCreate = action.payload;
      })
      .addCase(createMedicalForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi tạo phiếu";
      })
      .addCase(getAllMedicalForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMedicalForm.fulfilled, (state, action) => {
        state.loading = false;
        state.medicalList = action.payload;
      })
      .addCase(getAllMedicalForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi lấy danh sách";
      })
      .addCase(getDetailMedicalForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDetailMedicalForm.fulfilled, (state, action) => {
        state.loading = false;
        state.medicalForm = action.payload.medicalForm;
      })
      .addCase(getDetailMedicalForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi lấy chi tiết phiếu";
      })
      .addCase(updateMedicalForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMedicalForm.fulfilled, (state, action) => {
        state.loading = false;
        state.medicalFormUpdate = action.payload;
      })
      .addCase(updateMedicalForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi lấy chi tiết phiếu";
      });
  },
});

export default medicalSlice.reducer;
