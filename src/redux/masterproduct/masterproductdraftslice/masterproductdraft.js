import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchProductDetails } from '../../../redux/masterproduct/tableslice/productsSlice';

export const updateMasterProductDraft = createAsyncThunk(
    'masterProduct/updateDraft',
    async (
        { endpoint, payload, callback },
        { rejectWithValue, dispatch }
    ) => {
        try {
            const masterProductId = localStorage.getItem('createdProductId');
            const accessToken = localStorage.getItem('accessToken');
            const res = await axios.patch(
                `${process.env.REACT_APP_BACKEND_URL}/associate/masterProductUpdateDraft/${endpoint}`,
                payload,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            callback?.();
            dispatch(fetchProductDetails(masterProductId));
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const updateMasterProductDraftSlice = createSlice({
    name: 'updateMasterProductDraft',
    initialState: {
        loading: false,
        error: null,
        lastUpdatedEndpoint: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateMasterProductDraft.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMasterProductDraft.fulfilled, (state, action) => {
                state.loading = false;
                state.lastUpdatedEndpoint = action.meta.arg.endpoint;
            })
            .addCase(updateMasterProductDraft.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default updateMasterProductDraftSlice.reducer;