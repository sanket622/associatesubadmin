import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchVariantProductDetail } from '../../../redux/varient/variantSingleSlice';

export const updateVariantProductDraft = createAsyncThunk(
    'variantProduct/updateDraft',
    async (
        { endpoint, payload, callback },
        { rejectWithValue, dispatch }
    ) => {
        try {
            const createdVariantId = localStorage.getItem('createdVariantId');
            const accessToken = localStorage.getItem('accessToken');

            const res = await axios.patch(
                `${process.env.REACT_APP_BACKEND_URL}/associate/variantProductUpdateDraft/${endpoint}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            callback?.();
            dispatch(fetchVariantProductDetail(createdVariantId));

            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const updateVariantProductDraftSlice = createSlice({
    name: 'updateVariantProductDraft',
    initialState: {
        loading: false,
        error: null,
        lastUpdatedEndpoint: null,
    },
    reducers: {
        clearVariantError: (state) => {
            state.error = null;
        },
        resetVariantDraftState: (state) => {
            state.loading = false;
            state.error = null;
            state.lastUpdatedEndpoint = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateVariantProductDraft.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateVariantProductDraft.fulfilled, (state, action) => {
                state.loading = false;
                state.lastUpdatedEndpoint = action.meta.arg.endpoint;
            })
            .addCase(updateVariantProductDraft.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearVariantError, resetVariantDraftState } = updateVariantProductDraftSlice.actions;

export default updateVariantProductDraftSlice.reducer;