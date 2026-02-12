import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';



/* ===============================
   ASYNC THUNK
   =============================== */
export const fetchLoanDetailsById = createAsyncThunk(
    'loanDetails/fetchById',
    async (loanId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/manager/getLoanDetails/${loanId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return res.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || 'Failed to fetch loan details'
            );
        }
    }
);

/* ===============================
   SLICE
   =============================== */
const loanDetailsSlice = createSlice({
    name: 'loanDetails',
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {
        resetLoanDetails: (state) => {
            state.data = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLoanDetailsById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLoanDetailsById.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchLoanDetailsById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetLoanDetails } = loanDetailsSlice.actions;
export default loanDetailsSlice.reducer;
