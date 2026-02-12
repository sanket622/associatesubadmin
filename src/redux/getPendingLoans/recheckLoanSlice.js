import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchRecheckLoans = createAsyncThunk(
    'recheckLoans/fetchRecheckLoans',
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('accessToken');

            const res = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/manager/getRecheckLoans`,
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
                error.response?.data?.message || 'Failed to fetch recheck loans'
            );
        }
    }
);

const recheckLoanSlice = createSlice({
    name: 'recheckLoans',
    initialState: {
        loans: [],
        loading: false,
        error: null,
        page: 1,
        limit: 10,
        totalPages: 0,
        totalCount: 0,
    },
    reducers: {
        setRecheckPage(state, action) {
            state.page = action.payload;
        },
        setRecheckLimit(state, action) {
            state.limit = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecheckLoans.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRecheckLoans.fulfilled, (state, action) => {
                state.loading = false;

                const { loans, pagination } = action.payload;

                state.loans = loans;
                state.page = pagination.currentPage;
                state.limit = pagination.limit;
                state.totalPages = pagination.totalPages;
                state.totalCount = pagination.totalCount;
            })
            .addCase(fetchRecheckLoans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setRecheckPage, setRecheckLimit } = recheckLoanSlice.actions;
export default recheckLoanSlice.reducer;
