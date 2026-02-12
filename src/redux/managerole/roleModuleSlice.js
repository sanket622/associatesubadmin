import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    roles: [],
    modules: [],
    associateSubAdmins: [],   // new: table data
    loading: false,
    error: null,
    success: false,
    totalCount: 0,
    totalPages: 0,
};

const roleModuleSlice = createSlice({
    name: 'roleModule',
    initialState,
    reducers: {
        // existing role/module reducers...
        fetchRolesStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchRolesSuccess(state, action) {
            state.roles = action.payload;
            state.loading = false;
        },
        fetchRolesFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        fetchModulesStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchModulesSuccess(state, action) {
            state.modules = action.payload;
            state.loading = false;
        },
        fetchModulesFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        submitAssignRoleStart(state) {
            state.loading = true;
            state.error = null;
            state.success = false;
        },
        submitAssignRoleSuccess(state) {
            state.loading = false;
            state.success = true;
        },
        submitAssignRoleFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.success = false;
        },
        resetAssignRoleState(state) {
            state.success = false;
            state.error = null;
        },

        // new reducers for Associate Sub Admins
        fetchSubAdminsStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchSubAdminsSuccess(state, action) {
            state.associateSubAdmins = action.payload.data;     
            state.totalCount = action.payload.total || 0;        
            state.totalPages = action.payload.totalPages || 1; 
            state.loading = false;
          },
          
        fetchSubAdminsFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        updateSubAdminStart(state) {
            state.loading = true;
            state.error = null;
            state.success = false;
        },
        updateSubAdminSuccess(state, action) {
            // update subAdmin in list
            const updated = action.payload;
            const index = state.associateSubAdmins.findIndex(admin => admin.id === updated.id);
            if (index !== -1) {
                state.associateSubAdmins[index] = updated;
            }
            state.loading = false;
            state.success = true;
        },
        updateSubAdminFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.success = false;
        },

        deleteSubAdminStart(state) {
            state.loading = true;
            state.error = null;
        },
        deleteSubAdminSuccess(state, action) {
            const deletedId = action.payload;
            state.associateSubAdmins = state.associateSubAdmins.filter(admin => admin.id !== deletedId);
            state.loading = false;
        },
        deleteSubAdminFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        updateStatusStart(state) {
            state.loading = true;
            state.error = null;
            state.success = false;
        },
        updateStatusSuccess(state, action) {
            const { id, isActive } = action.payload;
            const index = state.associateSubAdmins.findIndex(admin => admin.id === id);
            if (index !== -1) {
                state.associateSubAdmins[index].isActive = isActive;
            }
            state.loading = false;
            state.success = true;
        },
        updateStatusFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.success = false;
        },
    },
});

export const {
    fetchRolesStart,
    fetchRolesSuccess,
    fetchRolesFailure,
    fetchModulesStart,
    fetchModulesSuccess,
    fetchModulesFailure,
    submitAssignRoleStart,
    submitAssignRoleSuccess,
    submitAssignRoleFailure,
    resetAssignRoleState,

    fetchSubAdminsStart,
    fetchSubAdminsSuccess,
    fetchSubAdminsFailure,

    updateSubAdminStart,
    updateSubAdminSuccess,
    updateSubAdminFailure,

    deleteSubAdminStart,
    deleteSubAdminSuccess,
    deleteSubAdminFailure,

    updateStatusStart,
    updateStatusSuccess,
    updateStatusFailure,
} = roleModuleSlice.actions;

// Thunk-like dispatchers

export const fetchRoles = () => async (dispatch) => {
    dispatch(fetchRolesStart());
    try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/associate/roleModule/getAllRoles`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(fetchRolesSuccess(res.data.data));
    } catch (err) {
        dispatch(fetchRolesFailure(err.message));
    }
};

export const fetchModulesByRole = (roleId) => async (dispatch) => {
    dispatch(fetchModulesStart());
    try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/associate/roleModule/getModulesByRole/${roleId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(fetchModulesSuccess(res.data.data));
    } catch (err) {
        dispatch(fetchModulesFailure(err.message));
    }
};

export const submitAssignRole = (formData) => async (dispatch) => {
    dispatch(submitAssignRoleStart());
    try {
        const token = localStorage.getItem('accessToken');
        const payload = {
            name: formData.userName,
            email: formData.email,
            mobile: formData.mobile,
            role: formData.role.id,
            modules: formData.module.map((m) => m.id),
            password: formData.password,
        };
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/associate/associateSubAdmin/createAssociateSubAdmin`, payload, {
            headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(submitAssignRoleSuccess());
    } catch (err) {
        dispatch(submitAssignRoleFailure(err.message));
    }
};

// New thunk-like dispatchers for Associate Sub Admins

// Fetch table data
export const fetchAssociateSubAdmins = (page = 1, limit = 10) => async (dispatch) => {
    dispatch(fetchSubAdminsStart());
    try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/associate/associateSubAdmin/getAssociateSubAdmins?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(fetchSubAdminsSuccess(res.data.data));
    } catch (err) {
        dispatch(fetchSubAdminsFailure(err.message));
    }
};


// Update/Edit sub admin
export const updateAssociateSubAdmin = (id, updateData) => async (dispatch) => {
    dispatch(updateSubAdminStart());
    try {
        const token = localStorage.getItem('accessToken');
        await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/associate/associateSubAdmin/updateAssociateSubAdmin/${id}`,
            updateData,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
       
        dispatch(updateSubAdminSuccess({ ...updateData, id }));
    } catch (err) {
        dispatch(updateSubAdminFailure(err.message));
    }
};

// Delete sub admin by id
export const deleteAssociateSubAdmin = (id) => async (dispatch) => {
    dispatch(deleteSubAdminStart());
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/associate/associateSubAdmin/deleteSubAdmin/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
         
        }
      );
      dispatch(deleteSubAdminSuccess(id));
      return { success: true };
    } catch (err) {
      dispatch(deleteSubAdminFailure(err.message));
      return { error: err.message };
    }
  };
  
  export const updateAssociateSubAdminStatus = (id, isActive) => async (dispatch) => {
    dispatch(updateStatusStart());
    try {
      const token = localStorage.getItem('accessToken');
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/associate/associateSubAdmin/deactivateAssociateSubAdmin/${id}`,
        { isActive },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(updateStatusSuccess({ id, isActive }));
      return { success: true };
    } catch (err) {
      dispatch(updateStatusFailure(err.message));
      return { error: err.message };
    }
  };
  

export default roleModuleSlice.reducer;
