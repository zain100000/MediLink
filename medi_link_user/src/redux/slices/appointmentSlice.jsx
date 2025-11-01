import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONFIG from '../config/Config';

const {BASE_URL} = CONFIG;

// Helper: fetch token from AsyncStorage
const getToken = async () => {
  const token = await AsyncStorage.getItem('authToken');
  return token;
};

// 🟢 Create Appointment
export const createAppointment = createAsyncThunk(
  'appointment/createAppointment',
  async (appointmentData, {rejectWithValue}) => {
    try {
      const token = await getToken();
      if (!token) return rejectWithValue('Patient not authenticated.');

      const response = await axios.post(
        `${BASE_URL}/appointment/create-appointment`,
        appointmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.appointment;
    } catch (error) {
      console.error(
        'Error creating appointment:',
        error.response?.data || error.message,
      );
      return rejectWithValue(
        error.response?.data || {
          message: 'Network Error - Could not reach server',
        },
      );
    }
  },
);

// 🔵 Get All Appointments
export const getAppointments = createAsyncThunk(
  'appointment/getAppointments',
  async (_, {rejectWithValue}) => {
    try {
      const token = await getToken();
      if (!token) return rejectWithValue('Patient not authenticated.');

      const response = await axios.get(
        `${BASE_URL}/appointment/get-all-appointments`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );

      return response.data.appointments;
    } catch (error) {
      console.error(
        'Error fetching appointments:',
        error.response?.data || error.message,
      );
      return rejectWithValue(
        error.response?.data || {
          message: 'Network Error - Could not reach server',
        },
      );
    }
  },
);

// 🟣 Get Appointment By ID
export const getAppointmentById = createAsyncThunk(
  'appointment/getAppointmentById',
  async (appointmentId, {rejectWithValue}) => {
    try {
      const token = await getToken();
      if (!token) return rejectWithValue('Patient not authenticated.');

      const response = await axios.get(
        `${BASE_URL}/appointment/get-appointment-by-id/${appointmentId}`,
        {headers: {Authorization: `Bearer ${token}`}},
      );

      return response.data.appointment;
    } catch (error) {
      console.error(
        'Error fetching appointment by ID:',
        error.response?.data || error.message,
      );
      return rejectWithValue(
        error.response?.data || {
          message: 'Network Error - Could not reach server',
        },
      );
    }
  },
);

// 🟠 Update Appointment Status
export const updateAppointment = createAsyncThunk(
  'appointment/updateAppointment',
  async ({appointmentId, updatedData}, {rejectWithValue}) => {
    try {
      const token = await getToken();
      if (!token) return rejectWithValue('Patient not authenticated.');

      const response = await axios.patch(
        `${BASE_URL}/appointment/update-appointment/${appointmentId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.appointment;
    } catch (error) {
      console.error(
        'Error updating appointment:',
        error.response?.data || error.message,
      );
      return rejectWithValue(
        error.response?.data || {
          message: 'Network Error - Could not reach server',
        },
      );
    }
  },
);

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState: {
    appointments: [],
    appointment: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAppointmentError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Create Appointment
      .addCase(createAppointment.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments.push(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Appointments
      .addCase(getAppointments.pending, state => {
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

      // Get Appointment by ID
      .addCase(getAppointmentById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAppointmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.appointment = action.payload;
      })
      .addCase(getAppointmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Appointment
      .addCase(updateAppointment.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.appointments.findIndex(
          a => a._id === action.payload._id,
        );
        if (index !== -1) state.appointments[index] = action.payload;
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {clearAppointmentError} = appointmentSlice.actions;
export default appointmentSlice.reducer;
