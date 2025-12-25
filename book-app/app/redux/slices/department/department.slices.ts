import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "@/utils/axiosClient";
import { DepartmentType } from "@/lib/DepartmentType/DepartmentItemType/DepartmentType";
const initialState = {
    departments: [],
    loading: false,
    error: null
}

export const getAllDepartment = createAsyncThunk<DepartmentType>
    ("departments/getAllDepartment", async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get("/departments")
            return response.data
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Không thể lấy danh sách chuyên khoa"
            )
        }
    })



const departmentSlice = createSlice({
    name: "departments",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllDepartment.fulfilled, (state, action: any) => {
                state.loading = false;
                state.departments = action.payload.departments;
                state.error = null;
            })
            .addCase(getAllDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Lỗi lấy danh sách chuyên khoa";
            })

    }
})

export default departmentSlice.reducer