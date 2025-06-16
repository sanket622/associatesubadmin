import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button
} from '@mui/material';
import RHFTextField from '../../subcompotents/RHFTextField';
import Label from '../../subcompotents/Label';
import {
    fetchEmployers,
    submitAssignment,
    clearAllErrors
} from '../../../redux/varient/employerAssignmentSlice';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from '../../subcompotents/FormProvider';
import RHFAutocomplete from '../../subcompotents/RHFAutocomplete';
import { useSnackbar } from 'notistack';

const AssignPartner = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { variantId } = useParams();
    const { enqueueSnackbar } = useSnackbar();

    const {
        employers,
        loadingEmployers,
        submittingAssignment,
        errorAssignment,
        assignmentSubmission
    } = useSelector((state) => state.employerAssignment);

    const AssignSchema = Yup.object().shape({
        selectedEmployer: Yup.object().required('Employer is required'),
        effectiveDate: Yup.string().required('Effective date is required'),
        endDate: Yup.string().nullable(),
        notes: Yup.string().nullable(),
    });

    const methods = useForm({
        resolver: yupResolver(AssignSchema),
        defaultValues: {
            selectedEmployer: null,
            effectiveDate: '',
            endDate: '',
            notes: '',
        },
    });

    const { handleSubmit, reset, watch } = methods;
    const selectedEmployer = watch('selectedEmployer');

    useEffect(() => {
        dispatch(fetchEmployers());
        return () => dispatch(clearAllErrors());
    }, [dispatch]);


  const onSubmit = (formData) => {
  dispatch(submitAssignment(
    { ...formData, variantId }, // 🧠 includes variantProductId in payload
    { enqueueSnackbar, navigate, reset }
  ));
};


    const onError = (e) => console.log(e);

    const handleCancel = () => reset();

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
            <div className="max-w-7xl mx-auto p-6 bg-white">
                {/* Header */}
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">👤</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-blue-600">Assign Employer</h1>
                </div>

                {/* Employer Selection Panel */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-blue-600 mb-6">Employer Selection Panel</h2>
                    <div className="mb-6">
                        <Label>Search Employer</Label>
                        <RHFAutocomplete
                            name="selectedEmployer"
                            placeholder="Type to search employers..."
                            options={employers}
                            getOptionLabel={(option) => option?.name || ''}
                            loading={loadingEmployers}
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                    <div>
                                        <div className="font-medium">{option.name}</div>
                                        <div className="text-sm text-gray-500">
                                            {option.email} | {option.mobile} | ID: {option.employerId}
                                        </div>
                                    </div>
                                </li>
                            )}
                        />
                    </div>

                    {/* Selected Employer Details */}
                    {selectedEmployer && (
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Selected Employer Details</h3>
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead sx={{ background: '#F5F5FF' }}>
                                            <TableRow>
                                                {['Name', 'Email', 'Mobile', 'Employer ID', 'Status'].map((header) => (
                                                    <TableCell key={header} sx={{ fontSize: '14px', color: '#0000FF' }}>
                                                        {header}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>{selectedEmployer.name}</TableCell>
                                                <TableCell>{selectedEmployer.email}</TableCell>
                                                <TableCell>{selectedEmployer.mobile}</TableCell>
                                                <TableCell>{selectedEmployer.employerId}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded-full text-xs ${selectedEmployer.isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {selectedEmployer.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>
                    )}
                </div>

                {/* Assignment Action Panel */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-blue-600 mb-6">Assignment Action Panel</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <Label>Assignment Effective Date *</Label>
                            <RHFTextField name="effectiveDate" type="date" />
                        </div>
                        <div>
                            <Label>End Date (Optional)</Label>
                            <RHFTextField name="endDate" type="date" />
                        </div>
                    </div>
                    <div className="mb-6">
                        <Label>Add Employer Notes</Label>
                        <RHFTextField name="notes" multiline rows={4} />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-end">
                    <Button
                        onClick={handleCancel}
                        variant="outlined"
                        color="error"
                        sx={{
                            px: 6, py: 1, fontWeight: 500, borderRadius: 2,
                            '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.05)', borderColor: '#f44336' },
                            '&:focus': { outline: 'none', boxShadow: '0 0 0 4px rgba(244, 67, 54, 0.3)' }
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        disabled={submittingAssignment}
                        sx={{
                            background: "#0000FF", color: "white", px: 6, py: 0.5, borderRadius: 2,
                            fontSize: "16px", fontWeight: 500, textTransform: "none",
                            "&:hover": { background: "#0000FF" }
                        }}
                    >
                        {submittingAssignment ? 'Submitting...' : 'Submit'}
                    </Button>
                </div>
            </div>
        </FormProvider>
    );
};

export default AssignPartner;
