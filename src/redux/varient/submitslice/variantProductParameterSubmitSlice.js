import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const initialState = {
    loading: false,
    error: null,
    data: null,
    editVarientParameterData: null,
};

const variantProductParameterSubmitSlice = createSlice({
    name: 'variantProductParameterSubmit',
    initialState,
    reducers: {
        submitStart(state) {
            state.loading = true;
            state.error = null;
        },
        submitSuccess(state, action) {
            state.loading = false;
            state.data = action.payload;
        },
        submitFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        clearSubmitState(state) {
            state.loading = false;
            state.error = null;
            state.data = null;
        },
        setEditVarientParameterData(state, action) {
            state.editVarientParameterData = action.payload
        },
    },
});

export const {
    submitStart,
    submitSuccess,
    submitFailure,
    clearSubmitState,
    setEditVarientParameterData,
} = variantProductParameterSubmitSlice.actions;

export const submitVariantProductParameter = (formData, callback) => async (dispatch) => {
    dispatch(submitStart());

    try {
        const accessToken = localStorage.getItem('accessToken');
        const variantId = localStorage.getItem('createdVariantId');


        const payload = {
            variantProductId: variantId,
            minLoanAmount: Number(formData.minimumLoanAmount),
            maxLoanAmount: Number(formData.maximumLoanAmount),
            minTenureMonths: Number(formData.minTenureMonths),
            maxTenureMonths: Number(formData.maxTenureMonths),
            interestRateMin: Number(formData.interestRateMin),
            interestRateMax: Number(formData.interestRateMax),
            processingFeeValue: Number(formData.processingFeeValue?.value || 0),
            latePaymentFeeType: formData.latePaymentFeeType.id,
            latePaymentFeeValue: Number(formData.latePaymentFeeValue),
            penalInterestApplicable: formData.penalInterestRateApplicable === 'yes',
            prepaymentFeeValue: Number(formData.prepaymentFeeValue),
            penalInterestRate: Number(formData.penalInterestRate),
            minAge: Number(formData.minimumAge),
            maxAge: Number(formData.maximumAge),
            interestRateType: formData.interestRateType?.id || '',
            processingFeeType: formData.processingFeeType?.id || '',
            prepaymentFeeType: formData.prepaymentFeeType?.id || '',
            emiFrequency: formData.emiFrequency?.id || '',

        };

        const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/associate/variantProduct/createVariantProductParameter`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        enqueueSnackbar('Variant parameters submitted successfully!', { variant: 'success' });
        dispatch(submitSuccess(response.data));

        if (typeof callback === 'function') callback();
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to submit variant parameters';
        enqueueSnackbar(message, { variant: 'error' });
        dispatch(submitFailure(message));
    }
};

export default variantProductParameterSubmitSlice.reducer;
