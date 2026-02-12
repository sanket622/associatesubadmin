import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ✅ THUNK — Fetch Geographies
export const fetchGeographies = createAsyncThunk(
    'geography/fetchGeographies',
    async (_, { rejectWithValue }) => {
        try {
            const accessToken = localStorage.getItem('accessToken');

            const res = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/associate/geography/getAllGeographies`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            return res.data?.data || [];
        } catch (error) {
            return rejectWithValue(
                error.response?.data || 'Failed to fetch geographies'
            );
        }
    }
);

const geographySlice = createSlice({
    name: 'geography',
    initialState: {
        geographies: [],
        loading: false,
        error: null,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchGeographies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchGeographies.fulfilled, (state, action) => {
                state.loading = false;
                state.geographies = action.payload;
            })

            .addCase(fetchGeographies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default geographySlice.reducer;
