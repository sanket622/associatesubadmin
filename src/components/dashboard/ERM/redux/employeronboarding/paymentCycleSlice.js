import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const initialState = {
    loading: false,
    error: null,
    data: null,
    contractTypes: [],
    contractCombinations: [],
};

const paymentCycleSlice = createSlice({
    name: 'paymentCycle',
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
        fetchContractTypesSuccess(state, action) {
            state.contractTypes = action.payload;
        },
        clearPaymentCycleState(state) {
            state.loading = false;
            state.error = null;
            state.data = null;
            state.contractTypes = [];
        },
        getContractCombinationsSuccess(state, action) {
            state.contractCombinations = action.payload;
        },

    },
});

export const {
    submitStart,
    submitSuccess,
    submitFailure,
    fetchContractTypesSuccess,
    clearPaymentCycleState,
    getContractCombinationsSuccess,
} = paymentCycleSlice.actions;

export const submitPaymentCycle = (employerId, contractTypeId, cycleDataList, callback) => async (dispatch) => {
    dispatch(submitStart());

    try {
        const accessToken = localStorage.getItem('accessToken');

        for (const cycleData of cycleDataList) {
            const payload = {
                employerId,
                contractTypeId,
                accuralStartAt: cycleData.startDate,
                accuralEndAt: cycleData.endDate,
                payoutDate: cycleData.payoutDate,
                triggerNextMonth: cycleData.triggerNextMonth,
            };

            const response = await axios.post(
                'https://api.earnplus.net/api/v1/associate/contractCombination/createContractCombination',
                payload,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );
        }

        enqueueSnackbar('Payment cycle(s) submitted successfully!', { variant: 'success' });
        dispatch(submitSuccess({ success: true }));

        if (typeof callback === 'function') callback();

    } catch (error) {
        const message = error.response?.data?.message || 'Failed to submit payment cycle(s)';
        enqueueSnackbar(message, { variant: 'error' });
        dispatch(submitFailure(message));
    }
};

export const fetchContractCombinations = (employerId) => async (dispatch) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(
      `https://api.earnplus.net/api/v1/associate/contractCombination/getContractCombinations/${employerId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const combinations = response.data.data;

    dispatch(getContractCombinationsSuccess(combinations));
    enqueueSnackbar('Contract combinations fetched successfully!', { variant: 'success' });
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch contract combinations';
    enqueueSnackbar(message, { variant: 'error' });
  }
};

export const fetchContractTypes = (employerId) => async (dispatch) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(
            `https://api.earnplus.net/api/v1/employer/auth/getEmployerContractTypes?employerId=${employerId}`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );

        const options = response.data.data.map(item => ({
            label: item.contractType.name,
            value: item.contractType.id,
        }));

        dispatch(fetchContractTypesSuccess(options));
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch contract types';
        enqueueSnackbar(message, { variant: 'error' });
    }
};

export default paymentCycleSlice.reducer;
