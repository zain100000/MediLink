import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import CONFIG from "../config/Config";

const { BACKEND_API_URL } = CONFIG;

const getToken = () => localStorage.getItem("authToken");

export const getAppointments = createAsyncThunk(
  "appointment/getAppointments",
  async (_, { rejectWithValue }) => {
    const token = getToken();
    if (!token) return rejectWithValue("Doctor is not authenticated.");

    try {
      const response = await axios.get(
        `${BACKEND_API_URL}/appointment/get-all-appointments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.appointments;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred.");
    }
  }
);

export const getAppointmentById = createAsyncThunk(
  "appointment/getAppointmentById",
  async (appointmentId, { rejectWithValue }) => {
    const token = getToken();
    if (!token) return rejectWithValue("Doctor is not authenticated.");

    try {
      const response = await axios.get(
        `${BACKEND_API_URL}/appointment/get-appointment-by-id/${appointmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.appointment;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred.");
    }
  }
);

export const updateAppointment = createAsyncThunk(
  "appointment/updateAppointment",
  async ({ appointmentId, updatedData }, { rejectWithValue }) => {
    const token = getToken();
    if (!token) return rejectWithValue("Doctor is not authenticated.");

    try {
      const response = await axios.patch(
        `${BACKEND_API_URL}/appointment/update-appointment/${appointmentId}`,
        { status: updatedData.status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.appointment;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred.");
    }
  }
);

const appointmentSlice = createSlice({
  name: "appointments",
  initialState: {
    appointments: [],
    loading: false,
    error: null,
  },
  reducers: {
    setAppointments: (state, action) => {
      state.appointments = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(getAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAppointmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAppointmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(getAppointmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointment = action.payload;
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setAppointments } = appointmentSlice.actions;
export default appointmentSlice.reducer;
