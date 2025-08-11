import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONFIG from '../config/Config';

const {BASE_URL} = CONFIG;

export const registerPatient = createAsyncThunk(
  'patient/registerPatient',
  async (formData, {rejectWithValue}) => {
    try {
      console.log('Sending patient register request...');
      const response = await axios.post(
        `${BASE_URL}/patient/signup-patient`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const {success, message, patient} = response.data;

      return {
        success,
        message,
        patient,
      };
    } catch (error) {
      const errData = error.response?.data || {
        message: 'Network Error - Could not reach server',
      };
      console.error('Patient registration error:', errData);
      return rejectWithValue(errData);
    }
  },
);

export const loginPatient = createAsyncThunk(
  'patient/loginPatient',
  async (loginData, {rejectWithValue}) => {
    console.log('🚀 loginPatient called with:', loginData);

    try {
      const response = await axios.post(
        `${BASE_URL}/patient/signin-patient`,
        loginData,
      );
      console.log('✅ Patient login response:', response.data);

      const {token, data} = response.data;

      const patient = {
        id: data.id,
        email: data.email,
      };
      console.log('👤 Parsed patient:', patient);
      console.log('🔑 Token received:', token);

      await AsyncStorage.setItem('authToken', token);
      console.log('💾 Token saved to AsyncStorage');

      return {patient, token};
    } catch (error) {
      console.error(
        '❌ Patient login error:',
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

export const logoutPatient = createAsyncThunk(
  'patient/logoutPatient',
  async (_, {rejectWithValue}) => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      const response = await axios.post(
        `${BASE_URL}/patient/logout-patient`,
        {},
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );

      return response.data;
    } catch (error) {
      console.error(
        'Patient logout API Error:',
        error?.response?.data || error.message,
      );
      return rejectWithValue(
        error?.response?.data || {message: 'Unknown error occurred.'},
      );
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    patient: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // Register
      .addCase(registerPatient.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.patient = action.payload.patient;
        state.token = action.payload.token || null;
      })
      .addCase(registerPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginPatient.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.patient = action.payload.patient;
        state.token = action.payload.token;
      })
      .addCase(loginPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutPatient.pending, state => {
        state.loading = true;
      })
      .addCase(logoutPatient.fulfilled, state => {
        state.loading = false;
        state.patient = null;
        state.token = null;
      })
      .addCase(logoutPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
