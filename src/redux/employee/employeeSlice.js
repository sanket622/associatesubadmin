import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    formData: {},
    countries: [],
    states: [],
    districts: [],
    workLocations: [],
    contractTypes: [],
    paymentCycles: [],
    loading: false,
    error: null,
    success: false,    
    errors: {},  
};

const employeeSlice = createSlice({
    name: 'employee',
    initialState,
    reducers: {
        updateFormField: (state, action) => {
            const { field, value } = action.payload;
            state.formData[field] = value;
        },
        setCountries: (state, action) => {
            state.countries = action.payload;
        },
        setStates: (state, action) => {
            state.states = action.payload;
        },
        setDistricts: (state, action) => {
            state.districts = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setSuccess: (state, action) => {
            state.success = action.payload;
        },
        resetForm: (state) => {
            state.formData = {};
        },
        setWorkLocations: (state, action) => {
            state.workLocations = action.payload;
        },
        setContractTypes: (state, action) => {
            state.contractTypes = action.payload;
        },
        setPaymentCycles: (state, action) => {
            state.paymentCycles = action.payload;
        },
        setErrors: (state, action) => {
            state.errors = action.payload; 
        },
    },
});

export const {
    updateFormField,
    setCountries,
    setStates,
    setDistricts,
    setWorkLocations,
    setContractTypes,
    setPaymentCycles,
    setLoading,
    setError,
    setErrors,
    setSuccess,
    resetForm,
    
} = employeeSlice.actions;

// ✅ Export reducer as default
export default employeeSlice.reducer;

// ✅ Thunk functions using the above action creators
const getToken = () => localStorage.getItem("accessToken");

export const fetchCountries = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const res = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/associate/location/getAllCountries`,
            { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        const countries = res.data.data.map(c => ({ id: c.id, label: c.countryName }));
        dispatch(setCountries(countries));
    } catch (err) {
        dispatch(setError(err.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export const fetchStates = (countryId) => async (dispatch) => {
    try {
        const res = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/associate/location/getStatesByCountry/${countryId}`,
            { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        const states = res.data.data.map(s => ({ id: s.id, label: s.stateName }));
        dispatch(setStates(states));
    } catch (err) {
        dispatch(setError(err.message));
    }
};

export const fetchDistricts = (stateId) => async (dispatch) => {
    try {
        const res = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/associate/location/getDistrictsByState/${stateId}`,
            { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        const districts = res.data.data.map(d => ({ id: d.id, label: d.districtName }));
        dispatch(setDistricts(districts));
    } catch (err) {
        dispatch(setError(err.message));
    }
};

export const fetchWorkLocations = () => async (dispatch) => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/employer/auth/getEmployerWorkLocations`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        const formatted = res.data.data.map(loc => ({
            id: loc.id,
            label: loc.workspaceName,
        }));
        dispatch(setWorkLocations(formatted));
    } catch (err) {
        dispatch(setError(err.message));
    }
};

export const fetchPaymentCyclesByContractType = (contractTypeId) => async (dispatch) => {
    console.log(contractTypeId)
    const getEmployerContractCombinations = `${process.env.REACT_APP_BACKEND_URL}/employer/auth/getEmployerContractCombinations`
    try {
        const res = await axios.get(`${getEmployerContractCombinations}?contractTypeId=${contractTypeId}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        const formatted = res.data.data.map(p => ({
            id: p.id,
            label: p.name,
        }));
        dispatch(setPaymentCycles(formatted));
    } catch (err) {
        dispatch(setError(err.message));
    }
};



export const fetchContractTypes = () => async (dispatch) => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/employer/auth/getEmployerContractTypes`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        const formatted = res.data.data.map(ct => ({
            id: ct.id,
            label: ct.contractTypeId, 
        }));
        dispatch(setContractTypes(formatted));
    } catch (err) {
        dispatch(setError(err.message));
    }
};


export const submitEmployee = (formData) => async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

   
    const payload = {
        employeeName: `${formData?.firstName} ${formData?.lastName}`,
        mobile: formData?.mobile,
        email: formData?.email,
        dob: formData?.dob,
        maritalStatus: formData?.maritalStatus?.value || formData?.maritalStatus,
        gender: formData?.gender?.value || formData?.gender,
        nationality: formData?.nationality,
        country: formData?.country?.id || formData?.country,
        panNo: formData?.panNo,
        aadharNo: formData?.aadharNo,
        address: formData?.address,
        city: formData?.city?.label || formData?.city,
        state: formData?.state?.id || formData?.state,
        pincode: formData?.pincode,
        employeeId: formData?.employeeId,
        dateJoined: formData?.dateJoined,
        jobTitle: formData?.jobTitle,
        department: formData?.department,
        workLocation: formData?.workLocation?.id || formData.workLocation,
        contractType: formData?.contractType?.id || formData.contractType,
        paymentCycle: formData?.paymentCycle?.label || formData.paymentCycle,
        accName: formData?.accName,
        accNumber: formData?.accNumber,
        bankName: formData?.bankName,
        ifsc: formData?.ifsc,
    };

    try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/employer/auth/addEmployeeByEmployer`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );
    
        dispatch(setSuccess(true));
        dispatch(resetForm());
    
        return response.data; 
      } catch (err) {
        dispatch(setError(err.message));
        throw err; 
      } finally {
        dispatch(setLoading(false));
      }
    };