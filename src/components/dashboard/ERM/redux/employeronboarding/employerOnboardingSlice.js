// store/slices/employerOnboardingSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const initialState = {
  loading: false,
  error: null,
  data: null,
  verificationLoading: false,
  panVerified: false,
  gstVerified: false,
  emailVerified: false,
  partners: {
    loading: false,
    error: null,
    data: [],
  },
};



const employerOnboardingSlice = createSlice({
  name: 'employerOnboarding',
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
    verificationStart(state) {
      state.verificationLoading = true;
      state.error = null;
    },
    verificationSuccess(state, action) {
      state.verificationLoading = false;
      const { type } = action.payload;
      if (type === 'pan') state.panVerified = true;
      if (type === 'gst') state.gstVerified = true;
      if (type === 'email') state.emailVerified = true;
    },
    verificationFailure(state, action) {
      state.verificationLoading = false;
      state.error = action.payload;
    },
    clearState(state) {
      state.loading = false;
      state.error = null;
      state.data = null;
      state.verificationLoading = false;
      state.panVerified = false;
      state.gstVerified = false;
      state.emailVerified = false;
    },

    fetchPartnersStart(state) {
      state.partners.loading = true;
      state.partners.error = null;
    },
    fetchPartnersSuccess(state, action) {
      state.partners.loading = false;
      state.partners.data = action.payload;
    },
    fetchPartnersFailure(state, action) {
      state.partners.loading = false;
      state.partners.error = action.payload;
    },
  },
});

export const {
  submitStart,
  submitSuccess,
  submitFailure,
  verificationStart,
  verificationSuccess,
  verificationFailure,
  clearState,
  fetchPartnersStart,
  fetchPartnersSuccess,
  fetchPartnersFailure,
} = employerOnboardingSlice.actions;

// 🔁 Thunk to verify PAN/GST
export const verifyPanGst = (formData, filterType) => async (dispatch) => {
  dispatch(verificationStart());

  try {
    const accessToken = localStorage.getItem('accessToken');

    const payload = {
      filterType: filterType, // 'pan' or 'gst'
      businessName: formData.employerName,
      pan: filterType === 'pan' ? formData.pan : '',
      gst: filterType === 'gst' ? formData.gstin : '',
    };

    const response = await axios.patch(
      'https://api.earnplus.net/api/v1/associate/associateSubAdmin/verifyGSTAndPAN',
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    enqueueSnackbar(`${filterType.toUpperCase()} verified successfully!`, { variant: 'success' });
    dispatch(verificationSuccess({ type: filterType, data: response.data }));
  } catch (error) {
    const message = error.response?.data?.message || `Failed to verify ${filterType.toUpperCase()}`;
    enqueueSnackbar(message, { variant: 'error' });
    dispatch(verificationFailure(message));
  }
};

// 🔁 Thunk to submit employer data
export const submitEmployerData = (formData, callback) => async (dispatch) => {
  dispatch(submitStart());

  try {
    const accessToken = localStorage.getItem('accessToken');

    // Create FormData for file uploads
    const submitData = new FormData();

    // Append text fields
    submitData.append('name', formData.employerName);
    submitData.append('email', formData.adminEmail);
    submitData.append('mobile', formData.adminPhone);
    submitData.append('altMobile', formData.alternateContact || '');
    submitData.append('gst', formData.gstin || '');
    submitData.append('pan', formData.pan);
    submitData.append('cin', formData.cin || '');
    submitData.append('portal', formData.portal);
    submitData.append('legalIdentity', formData.legalType?.value || '');


    // Append files
    if (formData.signedMasterAgreement) {
      submitData.append('signedMasterAgreement', formData.signedMasterAgreement);
    }
    if (formData.kycDocuments) {
      submitData.append('kycDocuments', formData.kycDocuments);
    }
    if (formData.boardResolution) {
      submitData.append('boardResolution', formData.boardResolution);
    }
    if (formData.onboardingSOP) {
      submitData.append('onboardingSOP', formData.onboardingSOP);
    }
    if (formData.additionalDoc) {
      submitData.append('additionalDoc', formData.additionalDoc);
    }

    const response = await axios.post(
      'https://api.earnplus.net/api/v1/associate/associateSubAdmin/addEmployerByAssociateSubAdmin',
      submitData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    enqueueSnackbar('Employer onboarded successfully!', { variant: 'success' });
    dispatch(submitSuccess(response.data));

    if (typeof callback === 'function') callback();
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to onboard employer';
    enqueueSnackbar(message, { variant: 'error' });
    dispatch(submitFailure(message));
  }
};

export const fetchPartners = () => async (dispatch) => {
  dispatch(fetchPartnersStart());
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(
      'https://api.earnplus.net/api/v1/associate/associateSubAdmin/getEmployersByAssociateSubAdmin',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    dispatch(fetchPartnersSuccess(response?.data?.data));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch partners';
    dispatch(fetchPartnersFailure(message));
  }
};


export default employerOnboardingSlice.reducer;