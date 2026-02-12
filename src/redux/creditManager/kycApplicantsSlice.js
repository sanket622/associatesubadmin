// redux/kycApplicantsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// const STATIC_VKYC_ID = '711b61e3-7ee8-48ab-a183-5a3deeca204b';

export const fetchKycApplicantDetails = createAsyncThunk(
    'kycApplicants/fetchDetails',
    async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('accessToken');

            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/manager/getVKYCPendingLoans?page=${page}&limit=${limit}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = await response.json();

            if (!result?.success) {
                return rejectWithValue(result?.message);
            }

            return result.data; // ✅ RETURN FULL DATA
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);



const kycApplicantsSlice = createSlice({
    name: 'kycApplicants',
    initialState: {
        details: [],
        pagination: {
            currentPage: 1,
            totalPages: 0,
            totalCount: 0,
            limit: 10,
        },
        loading: false,
        error: null,
    },

    reducers: {
        clearKycDetails(state) {
            state.details = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchKycApplicantDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchKycApplicantDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.details = action.payload.loans;
                state.pagination = action.payload.pagination;
            })

            .addCase(fetchKycApplicantDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch VKYC details';
            });
},
});

export const { clearKycDetails } = kycApplicantsSlice.actions;
export default kycApplicantsSlice.reducer;
