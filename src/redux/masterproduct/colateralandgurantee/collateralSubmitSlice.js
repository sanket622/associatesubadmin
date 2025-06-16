import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const initialState = {
    loading: false,
    error: null,
    data: null,
    editCollateralGuranteeData: null
};

const collateralSubmitSlice = createSlice({
    name: 'collateralSubmit',
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
        clearState(state) {
            state.loading = false;
            state.error = null;
            state.data = null;
        },
        setEditCollateralGuranteeData(state, action) {
            state.editCollateralGuranteeData = action.payload
        }
    },
});

export const {
    submitStart,
    submitSuccess,
    submitFailure,
    clearState,
    setEditCollateralGuranteeData,
} = collateralSubmitSlice.actions;

export const submitCollateralData = (formData, callback) => async (dispatch) => {
    dispatch(submitStart());

    try {
        const accessToken = localStorage.getItem('accessToken');
        const productId = localStorage.getItem('createdProductId');

        // Prepare payload based on your form data and API contract
        const payload = {
            masterProductId: productId,
            collateralType: formData.collateralType?.id || null,
            collateralValue: Number(formData.collateralValue),
            collateralValuationDate: formData.collateralValuationDate,
            collateralDocs: formData.collateralOwnershipDocs
                ? formData.collateralOwnershipDocs.map(doc => doc.id)
                : [],
            collateralOwnerName: formData.collateralOwnerName,
            ownershipVerified: formData.ownershipVerified?.id || null,
            guarantorRequired: formData.guarantorRequired?.id === 'TRUE',
            guarantorName: formData.guarantorName,
            guarantorRelationship: formData.guarantorRelationship?.id || null,
            guarantorPAN: formData.guarantorPan,
            guarantorCreditBureau: formData.guarantorCreditBureau?.id || null,
            guarantorCreditScore: Number(formData.guarantorCreditScore),
            guarantorMonthlyIncome: Number(formData.guarantorMonthlyIncome),
            guarantorIncomeProofTypes: formData.guarantorIncomeProofType ? [formData.guarantorIncomeProofType.id] : [],
            guarantorVerificationStatus: formData.guarantorVerificationStatus?.id || null,
        };

        const response = await axios.post(
            'https://api.earnplus.net/api/v1/associate/masterProduct/createCollateral',
            payload,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        enqueueSnackbar('Collateral data submitted successfully!', { variant: 'success' });
        dispatch(submitSuccess(response.data));

        if (typeof callback === 'function') callback();
    } catch (error) {
        console.error(error);
        const message = error.response?.data?.message || 'Failed to submit collateral data';
        enqueueSnackbar(message, { variant: 'error' });
        dispatch(submitFailure(message));
    }
};

export default collateralSubmitSlice.reducer;
