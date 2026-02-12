import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchMyPendingLoans = createAsyncThunk(
    'pendingLoans/fetchMyPendingLoans',
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('accessToken');

            const res = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/employee/loan/getMyPendingLoans`,
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
                error.response?.data?.message || 'Failed to fetch pending loans'
            );
        }
    }
);



const pendingLoanSlice = createSlice({
    name: 'pendingLoans',
    initialState: {
        loans: [],
        loading: false,
        error: null,
        page: 1,
        limit: 10,
        totalPages: 0,
        totalCount: 0,
        role: null,
    },
    reducers: {
        setPage(state, action) {
            state.page = action.payload;
        },
        setLimit(state, action) {
            state.limit = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyPendingLoans.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyPendingLoans.fulfilled, (state, action) => {
                state.loading = false;

                const { loans, pagination, role } = action.payload;

                state.loans = loans;
                state.page = pagination.currentPage;
                state.limit = pagination.limit;
                state.totalPages = pagination.totalPages;
                state.totalCount = pagination.totalCount;
                state.role = role;
            })

            .addCase(fetchMyPendingLoans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setPage, setLimit } = pendingLoanSlice.actions;
export default pendingLoanSlice.reducer;
