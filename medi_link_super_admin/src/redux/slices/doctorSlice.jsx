import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import CONFIG from "../config/Config";

const { BACKEND_API_URL } = CONFIG;

const getToken = () => localStorage.getItem("authToken");

export const getDoctors = createAsyncThunk(
  "doctor/getDoctors",
  async (_, { rejectWithValue }) => {
    const token = getToken();
    if (!token) return rejectWithValue("Admin is not authenticated.");

    try {
      const response = await axios.get(
        `${BACKEND_API_URL}/doctor/get-all-doctors/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.doctors;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred.");
    }
  }
);

export const getDoctorById = createAsyncThunk(
  "doctor/getDoctorById",
  async (doctorId, { rejectWithValue }) => {
    const token = getToken();
    if (!token) return rejectWithValue("Admin is not authenticated.");

    try {
      const response = await axios.get(
        `${BACKEND_API_URL}/doctor/get-doctor-by-id/${doctorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.doctor;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred.");
    }
  }
);

export const approveDoctor = createAsyncThunk(
  "doctors/approveDoctor",
  async (doctorId, { getState }) => {
    const token = getToken();
    await axios.patch(
      `${BACKEND_API_URL}/super-admin/approve-doctor/${doctorId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const { doctors } = getState().doctors;
    return doctors.map((doctor) =>
      doctor.id === doctorId ? { ...doctor, isActive: "APPROVED" } : doctor
    );
  }
);

export const rejectDoctor = createAsyncThunk(
  "doctors/rejectDoctor",
  async (doctorId, { getState }) => {
    const token = getToken();
    await axios.patch(
      `${BACKEND_API_URL}/super-admin/reject-doctor/${doctorId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const { doctors } = getState().doctors;
    return doctors.map((doctor) =>
      doctor.id === doctorId ? { ...doctor, isActive: "REJECTED" } : doctor
    );
  }
);

export const deleteDoctorProfile = createAsyncThunk(
  "super-admin/deleteDoctor",
  async (doctorId, { getState, rejectWithValue }) => {
    const token = getToken();
    if (!token) return rejectWithValue("Admin is not authenticated.");

    try {
      console.log("Deleting doctor with ID:", doctorId); // Log ID before making the request
      const response = await axios.delete(
        `${BACKEND_API_URL}/super-admin/delete-doctor-profile/${doctorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Response:", response); // Log response from backend

      const { doctors } = getState().doctors;
      return doctors.filter((doctor) => doctor._id !== doctorId);
    } catch (error) {
      console.error("Delete Error:", error.response?.data); // Log error message
      return rejectWithValue(error.response?.data || "An error occurred.");
    }
  }
);

const doctorSlice = createSlice({
  name: "doctors",
  initialState: {
    doctors: [],
    loading: false,
    error: null,
  },
  reducers: {
    setDoctors: (state, action) => {
      state.doctors = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(getDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(approveDoctor.fulfilled, (state, action) => {
        state.doctors = action.payload;
      })
      .addCase(rejectDoctor.fulfilled, (state, action) => {
        state.doctors = action.payload;
      })
      .addCase(deleteDoctorProfile.fulfilled, (state, action) => {
        state.doctors = action.payload;
      })
      .addCase(deleteDoctorProfile.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(getDoctorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctorById.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(getDoctorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setDoctors } = doctorSlice.actions;
export default doctorSlice.reducer;
