import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchLoanManagerHistory = createAsyncThunk(
    'loanManagerHistory/fetchLoanManagerHistory',
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('accessToken');

            const res = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/manager/getManagerLoanHistory`,
                {
                    params: { page, limit },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return res.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch loan manager history'
            );
        }
    }
);

const loanManagerHistorySlice = createSlice({
    name: 'loanManagerHistory',
    initialState: {
        rows: [],
        loading: false,
        error: null,
        page: 1,
        limit: 10,
        totalPages: 0,
        totalCount: 0,
    },
    reducers: {
        setLoanManagerHistoryPage(state, action) {
            state.page = action.payload;
        },
        setLoanManagerHistoryLimit(state, action) {
            state.limit = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLoanManagerHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLoanManagerHistory.fulfilled, (state, action) => {
                state.loading = false;

                const { history, pagination } = action.payload;

                state.rows = history || [];
                state.page = pagination?.currentPage || 1;
                state.limit = pagination?.limit || 10;
                state.totalPages = pagination?.totalPages || 0;
                state.totalCount = pagination?.totalCount || 0;
            })
            .addCase(fetchLoanManagerHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    setLoanManagerHistoryPage,
    setLoanManagerHistoryLimit,
} = loanManagerHistorySlice.actions;

export default loanManagerHistorySlice.reducer;
