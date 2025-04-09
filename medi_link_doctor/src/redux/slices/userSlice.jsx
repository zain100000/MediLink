import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import CONFIG from "../config/Config";

const { BACKEND_API_URL } = CONFIG;

const getToken = () => localStorage.getItem("authToken");

export const getDoctor = createAsyncThunk(
  "doctor/getDoctor",
  async (userId, { rejectWithValue }) => {
    const token = getToken();
    if (!token) return rejectWithValue("Doctor is not authenticated.");

    try {
      const response = await axios.get(
        `${BACKEND_API_URL}/doctor/get-doctor-by-id/${userId}`, // Update URL
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.doctor; // Return the single super admin
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred.");
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    superAdmin: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.doctor = action.payload;
      })
      .addCase(getDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
