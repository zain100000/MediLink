import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import CONFIG from '../config/Config';

const {BASE_URL} = CONFIG;

const getToken = async rejectWithValue => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('Patient is not authenticated.');
    return token;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch token.');
  }
};

export const getPatient = createAsyncThunk(
  'patient/getPatient',
  async (patientId, {rejectWithValue}) => {
    try {
      const token = await getToken(rejectWithValue);
      const response = await axios.get(
        `${BASE_URL}/patient/get-patient-by-id/${patientId}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      return response.data.patient;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const updatePatient = createAsyncThunk(
  'patient/updatePatient',
  async ({patientId, formData}, {rejectWithValue}) => {
    try {
      const token = await getToken(rejectWithValue);

      const response = await axios.patch(
        `${BASE_URL}/patient/update-patient/${patientId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response.data.patient;
    } catch (error) {
      console.error(
        '❌ Patient update failed:',
        error.response?.data || error.message,
      );
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);


const patientSlice = createSlice({
  name: 'patient',
  initialState: {
    patient: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearPatient: state => {
      state.patient = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Get patient
      .addCase(getPatient.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.patient = action.payload;
      })
      .addCase(getPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update patient
      .addCase(updatePatient.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.loading = false;
        state.patient = action.payload;
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {clearPatient} = patientSlice.actions;
export default patientSlice.reducer;
