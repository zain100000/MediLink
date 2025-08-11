import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import CONFIG from '../config/Config';

const {BASE_URL} = CONFIG;

const getToken = async rejectWithValue => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('User is not authenticated.');
    return token;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch token.');
  }
};

export const getAllDoctors = createAsyncThunk(
  'doctor/getAllDoctors',
  async (_, {rejectWithValue}) => {
    try {
      const token = await getToken(rejectWithValue);
      const response = await axios.get(`${BASE_URL}/doctor/get-all-doctors`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      return response.data.doctors;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const doctorSlice = createSlice({
  name: 'doctor',
  initialState: {
    doctors: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearDoctors: state => {
      state.doctors = [];
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAllDoctors.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(getAllDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {clearDoctors} = doctorSlice.actions;
export default doctorSlice.reducer;
