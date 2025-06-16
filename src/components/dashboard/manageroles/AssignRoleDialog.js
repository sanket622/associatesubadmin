import React, { useEffect, useState } from 'react';
import {
    Button, IconButton, InputAdornment, Dialog, DialogContent
} from '@mui/material';
import { ArrowBack, Visibility, VisibilityOff } from '@mui/icons-material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller, useWatch } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AutocompleteFieldComponent from '../../subcompotents/AutocompleteFieldComponent';
import TextFieldComponent from '../../subcompotents/TextFieldComponent';
import {
    fetchRoles,
    fetchModulesByRole,
    submitAssignRole,
    resetAssignRoleState,
} from '../../../redux/managerole/roleModuleSlice';
import { useSnackbar } from 'notistack';

const schema = yup.object().shape({
    userName: yup.string().required('User name is required'),
    role: yup.object().nullable().required('Role is required'),
    module: yup.array().min(1, 'At least one module is required'),
    mobile: yup.string().required('Mobile is required'),
    email: yup.string().email().required('Email is required'),
    password: yup.string().required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm your password'),
});

const AssignRoleDialog = ({ onClose, open }) => {
    const dispatch = useDispatch();
    const { roles, modules, success, error } = useSelector((state) => state.roleModule);
    const { enqueueSnackbar } = useSnackbar();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            userName: '',
            role: null,
            module: [],
            mobile: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        resolver: yupResolver(schema),
    });

    const selectedRole = useWatch({ control, name: 'role' });

    useEffect(() => {
        dispatch(fetchRoles());
    }, [dispatch]);

    useEffect(() => {
        if (selectedRole?.id) {
            dispatch(fetchModulesByRole(selectedRole.id));
        }
    }, [selectedRole, dispatch, setValue]);

    useEffect(() => {
        if (success) {
            enqueueSnackbar('Role assigned successfully!', { variant: 'success' });
            reset();
            dispatch(resetAssignRoleState());
            onClose(); // Close dialog on success
        }
        if (error) {
            enqueueSnackbar(error, { variant: 'error' });
            dispatch(resetAssignRoleState());
        }
    }, [success, error, enqueueSnackbar, dispatch, reset, onClose]);

    const onSubmit = (data) => {
        dispatch(submitAssignRole(data));
    };


    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogContent sx={{ padding: 0 }}>
                <div className="mx-auto bg-white rounded-lg shadow-sm">
                    <div className="flex items-center p-4 border-b border-gray-100 bg-[#F9F9FF]">
                        <IconButton onClick={() => onClose(false)} size="small">
                            <ArrowBack className="text-[#0000FF]" />
                        </IconButton>
                        <h1 className="text-lg font-medium text-gray-900 ml-2">Assign Role</h1>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">

                        {/* User Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
                            <Controller
                                name="userName"
                                control={control}
                                render={({ field }) => (
                                    <TextFieldComponent
                                        {...field}
                                        placeholder="Enter User Name"
                                        error={!!errors.userName}
                                        helperText={errors.userName?.message}
                                    />
                                )}
                            />
                        </div>

                        {/* Role Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role Type</label>
                            <Controller
                                name="role"
                                control={control}
                                render={({ field }) => (
                                    <AutocompleteFieldComponent
                                        {...field}
                                        options={roles.map((r) => ({ id: r.id, label: r.roleName }))}
                                        placeholder="Select Role"
                                        error={!!errors.role}
                                        helperText={errors.role?.message}
                                    />
                                )}
                            />
                        </div>

                        {/* Modules */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Define Module</label>
                            <Controller
                                name="module"
                                control={control}
                                render={({ field }) => (
                                    <AutocompleteFieldComponent
                                        {...field}
                                        options={modules.map((m) => ({ id: m.id, label: m.moduleName }))}
                                        placeholder="Select Module"
                                        isMulti // ✅ use isMulti, not multiple
                                        error={!!errors.module}
                                        helperText={errors.module?.message}
                                    />
                                )}
                            />

                        </div>

                        {/* Mobile */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                            <Controller
                                name="mobile"
                                control={control}
                                render={({ field }) => (
                                    <TextFieldComponent
                                        {...field}
                                        placeholder="Enter Mobile No."
                                        error={!!errors.mobile}
                                        helperText={errors.mobile?.message}
                                    />
                                )}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <TextFieldComponent
                                        {...field}
                                        placeholder="Enter Email"
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                    />
                                )}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Enter Password</label>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <TextFieldComponent
                                        {...field}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter Password"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword((s) => !s)} size="small">
                                                        {showPassword ? <VisibilityOff className="text-[#0000FF]" /> : <Visibility className="text-[#0000FF]" />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                    />
                                )}
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <Controller
                                name="confirmPassword"
                                control={control}
                                render={({ field }) => (
                                    <TextFieldComponent
                                        {...field}
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Enter Password"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowConfirmPassword((s) => !s)} size="small">
                                                        {showConfirmPassword ? <VisibilityOff className="text-[#0000FF]" /> : <Visibility className="text-[#0000FF]" />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        error={!!errors.confirmPassword}
                                        helperText={errors.confirmPassword?.message}
                                    />
                                )}
                            />
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            startIcon={<PersonAddIcon />}
                            fullWidth
                            sx={{
                                background: '#0000FF',
                                color: 'white',
                                px: 4,
                                py: 1,
                                borderRadius: 2,
                                fontSize: '16px',
                                fontWeight: 500,
                                textTransform: 'none',
                                '&:hover': { background: '#0000FF' },
                            }}
                        >
                            Assign Role
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AssignRoleDialog;
