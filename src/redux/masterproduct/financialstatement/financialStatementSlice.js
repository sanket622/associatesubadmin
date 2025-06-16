import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const initialState = {
    loading: false,
    error: null,
    data: null,
    editFinancialData: null
};

const financialStatementSlice = createSlice({
    name: 'financialStatement',
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
        setEditFinancialData(state, action) {
            state.editFinancialData = action.payload
        }
    },
});

export const {
    submitStart,
    submitSuccess,
    submitFailure,
    clearState,
    setEditFinancialData
} = financialStatementSlice.actions;

export const submitFinancialStatement = (formData, callback) => async (dispatch) => {
    dispatch(submitStart());

    try {
        const accessToken = localStorage.getItem('accessToken');
        const masterProductId = localStorage.getItem('createdProductId');

        const payload = {
            masterProductId: masterProductId,
            minMonthlyCredit: Number(formData.minimumMonthlyCredit),
            minAverageBalance: Number(formData.minimumAverageBalance),
            salaryCreditPattern: formData.salaryPattern?.id,
            bouncesLast3Months: Number(formData.bouncesOrCharges),
            netIncomeRecognition: formData.incomeRecognitionMethod?.id,
            cashDepositsCapPercent: Number(formData.cashDepositsCap),
            statementSources: [formData.statementSource?.id],
            accountTypes: [formData.accountType?.id],
            pdfParsingRequired: formData.pdfParsingOrJsonRequired === 'yes',
        };

        // Remove undefined/NaN
        Object.keys(payload).forEach(key => {
            if (payload[key] === undefined || Number.isNaN(payload[key])) {
                delete payload[key];
            }
        });

        const response = await axios.post(
            'https://api.earnplus.net/api/v1/associate/masterProduct/createFinancialStatements',
            payload,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );

        enqueueSnackbar('Financial statement submitted successfully!', { variant: 'success' });
        dispatch(submitSuccess(response.data));

        if (typeof callback === 'function') callback();

    } catch (error) {
        console.error(error);
        const message = error.response?.data?.message || 'Failed to submit financial statement';
        enqueueSnackbar(message, { variant: 'error' });
        dispatch(submitFailure(message));
    }
};


export default financialStatementSlice.reducer;
