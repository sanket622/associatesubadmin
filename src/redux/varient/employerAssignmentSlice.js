// store/slices/employerAssignmentSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
  employers: [],                 // Employer list
  assignedPartners: [],         // Partners already assigned to a variant
  loadingEmployers: false,      // Loading flag for employers
  loadingAssignedPartners: false, // Loading flag for assigned partners
  submittingAssignment: false,  // Flag when assignment is being submitted
  assignmentSubmission: null,   // Response after submission
  errorEmployers: null,         // Error for fetching employers
  errorAssignedPartners: null,  // Error for fetching assigned partners
  errorAssignment: null,        // Error when submitting assignment
};

const employerAssignmentSlice = createSlice({
  name: 'employerAssignment',
  initialState,
  reducers: {
    // Employers
    fetchEmployersStart: (state) => {
      state.loadingEmployers = true;
      state.errorEmployers = null;
    },
    fetchEmployersSuccess: (state, action) => {
      state.loadingEmployers = false;
      state.employers = action.payload;
    },
    fetchEmployersFailure: (state, action) => {
      state.loadingEmployers = false;
      state.errorEmployers = action.payload;
    },

    // Assigned Partners
    fetchAssignedPartnersStart: (state) => {
      state.loadingAssignedPartners = true;
      state.errorAssignedPartners = null;
    },
    fetchAssignedPartnersSuccess: (state, action) => {
      state.loadingAssignedPartners = false;
      state.assignedPartners = action.payload;
    },
    fetchAssignedPartnersFailure: (state, action) => {
      state.loadingAssignedPartners = false;
      state.errorAssignedPartners = action.payload;
    },

    // Assignment Submission
    assignmentSubmitStart: (state) => {
      state.submittingAssignment = true;
      state.errorAssignment = null;
    },
    assignmentSubmitSuccess: (state, action) => {
      state.submittingAssignment = false;
      state.assignmentSubmission = action.payload;
    },
    assignmentSubmitFailure: (state, action) => {
      state.submittingAssignment = false;
      state.errorAssignment = action.payload;
    },

    // Clear errors
    clearAllErrors: (state) => {
      state.errorEmployers = null;
      state.errorAssignedPartners = null;
      state.errorAssignment = null;
    },
  },
});

export const {
  fetchEmployersStart,
  fetchEmployersSuccess,
  fetchEmployersFailure,
  fetchAssignedPartnersStart,
  fetchAssignedPartnersSuccess,
  fetchAssignedPartnersFailure,
  assignmentSubmitStart,
  assignmentSubmitSuccess,
  assignmentSubmitFailure,
  clearAllErrors,
} = employerAssignmentSlice.actions;


// Fetch employers for autocomplete
export const fetchEmployers = () => async (dispatch) => {
  const token = localStorage.getItem('accessToken');
  dispatch(fetchEmployersStart());
  try {
    const response = await axios.get('https://api.earnplus.net/api/v1/employer/auth/getEmployers', {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(fetchEmployersSuccess(response.data?.data || []));
  } catch (error) {
    dispatch(fetchEmployersFailure(error.message));
  }
};

// Fetch assigned partners for a variant
export const fetchAssignedPartners = (variantId) => async (dispatch) => {
  const token = localStorage.getItem('accessToken');
  dispatch(fetchAssignedPartnersStart());
  try {
    const response = await axios.get(
      `https://api.earnplus.net/api/v1/associate/variantProduct/getAssignedEmployers/${variantId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch(fetchAssignedPartnersSuccess(response.data?.data || []));
  } catch (error) {
    dispatch(fetchAssignedPartnersFailure(error.message));
  }
};


// Submit assignment
// In employerAssignmentSlice.js

export const submitAssignment =
  (formData, { enqueueSnackbar, navigate, reset }) =>
  async (dispatch) => {
    const accessToken = localStorage.getItem('accessToken');
    dispatch(assignmentSubmitStart());

    try {
      const payload = {
        employerId: formData.selectedEmployer?.id,
        variantProductId: formData.variantId,
        assignmentDate: formData.effectiveDate,
        endDate: formData.endDate || null,
        employerNote: formData.notes || '',
      };

      const response = await axios.patch(
        'https://api.earnplus.net/api/v1/associate/variantProduct/assignVariantProductToEmployer',
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        dispatch(assignmentSubmitSuccess(response.data));

        // ✅ UI side-effects here:
        enqueueSnackbar('Assignment submitted successfully', { variant: 'success' });
        if (typeof reset === 'function') reset();
        if (typeof navigate === 'function') navigate(-1);
      } else {
        const msg = response.data.message || 'Submission failed';
        dispatch(assignmentSubmitFailure(msg));
        enqueueSnackbar(`Submission failed: ${'Variant product is already assigned to employer'}`, { variant: 'error' });
      }
    } catch (error) {
      dispatch(assignmentSubmitFailure(error.message));
      enqueueSnackbar(`Submission error: ${error.message}`, { variant: 'error' });
    }
  };



export default employerAssignmentSlice.reducer;