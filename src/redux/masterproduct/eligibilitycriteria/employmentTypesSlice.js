// store/slices/employmentTypesSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  employmentTypes: [],
  documents: [],
  loading: false,
  error: null,
  eligibilityCriteriaSubmission: null,
  editEligibilityData:null
};

const employmentTypesSlice = createSlice({
  name: 'employmentTypes',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      if (action.payload.type === 'employmentTypes') {
        state.loading = false;
        state.employmentTypes = action.payload.data;
      } else if (action.payload.type === 'documents') {
        state.loading = false;
        state.documents = action.payload.data;
      }
    },
    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    eligibilityCriteriaSubmitStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    eligibilityCriteriaSubmitSuccess: (state, action) => {
      state.loading = false;
      state.eligibilityCriteriaSubmission = action.payload;
    },
    eligibilityCriteriaSubmitFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setEditEligibilityData: (state, action) => {     
      state.editEligibilityData = action.payload;
    },
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  eligibilityCriteriaSubmitStart,
  eligibilityCriteriaSubmitSuccess,
  eligibilityCriteriaSubmitFailure,
  setEditEligibilityData,
} = employmentTypesSlice.actions;

export const fetchEmploymentTypes = () => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const response = await axios.get('https://api.earnplus.net/api/v1/associate/employment/getAllEmploymentTypes');
    const options = response.data?.data?.map((item) => ({
      id: item.id,
      name: item.name,
    }));
    dispatch(fetchSuccess({ type: 'employmentTypes', data: options }));
  } catch (error) {
    dispatch(fetchFailure(error.message));
  }
};

export const fetchDocuments = () => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const response = await axios.get('https://api.earnplus.net/api/v1/associate/document/getAllDocuments');
    const options = response.data?.data?.map((item) => ({
      id: item.id,
      name: item.name,
    }));
    dispatch(fetchSuccess({ type: 'documents', data: options }));
  } catch (error) {
    dispatch(fetchFailure(error.message));
  }
};

export const submitEligibilityCriteria = (data, callback) => async (dispatch) => {
  const accessToken = localStorage.getItem('accessToken');
  dispatch(eligibilityCriteriaSubmitStart());

  try {
    const productId = localStorage.getItem('createdProductId');

    const requestData = {
      masterProductId: productId,
      minAge: Number(data.minAge),
      maxAge: Number(data.maxAge),
      minMonthlyIncome: Number(data.minMonthlyIncome),
      minBusinessVintage: Number(data.minBusinessVintage),
      minBureauScore: Number(data.minBureauScore),

      bureauType: typeof data.bureauType === 'string' ? data.bureauType : data.bureauType?.id || '',

      documentSubmissionModes: data.documentSubmissionMode
        ? [typeof data.documentSubmissionMode === 'string' ? data.documentSubmissionMode : data.documentSubmissionMode.id]
        : [],

      documentVerificationModes: data.documentVerificationMode
        ? [typeof data.documentVerificationMode === 'string' ? data.documentVerificationMode : data.documentVerificationMode.id]
        : [],

      employmentTypesAllowed: Array.isArray(data.employmentTypeAllowed)
        ? data.employmentTypeAllowed.map(item => typeof item === 'string' ? item : item.id)
        : data.employmentTypeAllowed
          ? [typeof data.employmentTypeAllowed === 'string' ? data.employmentTypeAllowed : data.employmentTypeAllowed.id]
          : [],
    };

    // Handle blacklistFlags only if not empty
    if (Array.isArray(data.blacklistFlags) && data.blacklistFlags.length > 0) {
      requestData.blacklistFlags = data.blacklistFlags.map(item =>
        typeof item === 'string' ? item : item.id
      );
    }

    // Handle minDocumentsRequired only if not empty
    if (Array.isArray(data.minimumDocumentsRequired) && data.minimumDocumentsRequired.length > 0) {
      requestData.minDocumentsRequired = data.minimumDocumentsRequired.map(item =>
        typeof item === 'string' ? item : item.id
      );
    }


    const response = await axios.post(
      'https://api.earnplus.net/api/v1/associate/masterProduct/createEligibilityCriteria',
      requestData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.data.success) {
      dispatch(eligibilityCriteriaSubmitSuccess(response.data));
      if (typeof callback === 'function') {
        callback(); // Proceed to next tab or perform other success logic
      }
    } else {
      dispatch(
        eligibilityCriteriaSubmitFailure(
          response.data.message || 'Failed to submit eligibility criteria'
        )
      );
    }
  } catch (error) {
    dispatch(eligibilityCriteriaSubmitFailure(error.message));
  }
};


export default employmentTypesSlice.reducer;
