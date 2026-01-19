"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "@/utils/axiosClient";
import { type AuthType } from "@/lib/AuthType/AuthType";
import { type SignupType } from "@/lib/SignupType/SignupType";
import { type SigninType } from "@/lib/SiginType/SiginType";

const initialState: AuthType = {
  account: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  loading: false,
  error: null,
};

export const signup = createAsyncThunk<
  SignupType,
  { username: string; email: string; password: string }
>("auth/signup", async ({ username, email, password }, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post("/accounts", {
      username,
      email,
      password,
    });
    const { token } = response.data;
    localStorage.setItem("token", token);
    document.cookie = `accessToken=${token}; path=/`;
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Lỗi đăng ký");
  }
});

export const signin = createAsyncThunk<
  SigninType,
  { email: string; password: string }
>("auth/signin", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post("/accounts/login", {
      email,
      password,
    });
    const { token } = response.data;
    localStorage.setItem("token", token);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Lỗi đăng ký");
  }
});

const authSlice = createSlice({
  name: "auths",
  initialState,
  reducers: {
    
    logout: (state) => {
      state.account = null;
      state.token = null;
      state.loading = false;
      state.error = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        document.cookie = "accessToken=; path=/; max-age=0";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi đăng ký";
      })
      .addCase(signin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.account = action.payload.account;
      })
      .addCase(signin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi đăng nhập";
      });
  },
});

export default authSlice.reducer;

export const { logout } = authSlice.actions;