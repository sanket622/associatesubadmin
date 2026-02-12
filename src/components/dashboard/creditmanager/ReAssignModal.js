
import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    Button,
    IconButton,
} from '@mui/material';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { FormProvider, useForm } from 'react-hook-form';
import RHFAutocomplete from '../../subcompotents/RHFAutocomplete';
import RHFTextField from '../../subcompotents/RHFTextField';
import Label from '../../subcompotents/Label';

const MODAL_CONFIG = {
    reassign: {
        title: 'Re-Assign',
        label: 'Select Credit Manager',
        buttonText: 'Re-Assign',
        fieldName: 'creditManager',
    },
    askDocument: {
        title: 'Request Missing Document',
        label: 'Select Document Type',
        buttonText: 'Send Request',
        fieldName: 'documentType',
    },
    approvePanel: {
        title: 'Approve Panel',
    },
    viewReason: {
        title: 'View Reason',
    },
    decline: {
        title: 'Reason for Decline',
    },
};

const getSchema = (type) => {
    if (type === 'reassign') {
        return yup.object({
            creditManager: yup
                .object()
                .nullable()
                .required('Credit Manager is required'),
        });
    }

    if (type === 'askDocument') {
        return yup.object({
            documentType: yup
                .array()
                .min(1, 'At least one document is required')
                .required(),

        });
    }

    if (type === 'approvePanel') {
        return yup.object({
            status: yup
                .object()
                .nullable()
                .required('Status is required'),

            loanAmount: yup
                .object()
                .nullable()
                .required('Loan Amount is required'),

            interestRate: yup
                .object()
                .nullable()
                .required('Interest Rate is required'),

            tenure: yup
                .object()
                .nullable()
                .required('Tenure is required'),

            remarks: yup
                .string()
                .trim()
                .required('Remarks are required'),
        });
    }


    return yup.object({});
};



const ReAssignModal = ({
    open,
    onClose,
    onSubmit,
    options = [],
    type,
    headerbg
}) => {
    const schema = getSchema(type);
    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            creditManager: null,
            documentType: [],
            status: null,
            loanAmount: null,
            interestRate: null,
            tenure: null,
            remarks: '',
        },
    });
    const { handleSubmit, reset } = methods;

    const config = MODAL_CONFIG[type];

    const handleClose = () => {
        reset();
        onClose();
    };
    const approveOptions = [
        { id: 'APPROVE', name: 'Approve' },
        { id: 'REJECT', name: 'Reject' },
    ];

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth slotProps={{
            paper: {
                sx: {
                    borderRadius: 5,
                },
            },
        }}>
            <DialogContent sx={{ p: 0 }}>
                <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    px={2}
                    py={1.5}
                    bgcolor={headerbg ? headerbg : "#F5F7FF"}
                >
                    <IconButton size="small" onClick={handleClose}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography fontWeight={600}>
                        {type === 'confirm' ? 'Confirmation' : config?.title}
                    </Typography>
                </Box>

                <FormProvider {...methods}>
                    {type === 'confirm' && (
                        <Box p={3} textAlign="center">
                            <Typography fontWeight={600} mb={1}>
                                Are you sure you want to send the agreement now?
                            </Typography>

                            <Typography variant="body2" color="text.secondary" mb={3}>
                                The agreement will be immediately sent and cannot be recalled.
                            </Typography>

                            <Box style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }} gap={2} >
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<CloseIcon />}
                                    onClick={handleClose}
                                >
                                    No
                                </Button>

                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<CheckIcon />}
                                    onClick={() => {
                                        onSubmit();
                                        handleClose();
                                    }}
                                >
                                    Yes
                                </Button>
                            </Box>
                        </Box>
                    )}


                    {type !== 'confirm' && type !== 'approvePanel' && type !== 'viewReason' && type !== 'decline' && config && (

                        <Box p={2}>
                            <Label>{config.label}</Label>

                            <RHFAutocomplete
                                name={config.fieldName}
                                options={options}
                                multiple={type === 'askDocument'}
                                getOptionLabel={(opt) => opt?.name || ''}
                            />


                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3 }}
                                onClick={handleSubmit(onSubmit)}
                            >
                                {config.buttonText}
                            </Button>
                        </Box>

                    )}

                    {type === 'approvePanel' && (
                        <Box p={2}>
                            <Label>Status</Label>
                            <RHFAutocomplete
                                name="status"
                                options={approveOptions}
                                getOptionLabel={(o) => o?.name || ''}
                            />

                            <Label sx={{ mt: 2 }}>Loan Amount</Label>
                            <RHFAutocomplete
                                name="loanAmount"
                                options={approveOptions}
                                getOptionLabel={(o) => o?.name || ''}
                            />

                            <Label sx={{ mt: 2 }}>Interest Rate</Label>
                            <RHFAutocomplete
                                name="interestRate"
                                options={approveOptions}
                                getOptionLabel={(o) => o?.name || ''}
                            />

                            <Label sx={{ mt: 2 }}>Tenure</Label>
                            <RHFAutocomplete
                                name="tenure"
                                options={approveOptions}
                                getOptionLabel={(o) => o?.name || ''}
                            />

                            <Label sx={{ mt: 2 }}>Remarks</Label>
                            <RHFTextField
                                name="remarks"
                                placeholder="Message"
                                multiline
                                rows={3}
                            />

                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3 }}
                                onClick={handleSubmit(onSubmit)}
                            >
                                Submit
                            </Button>
                        </Box>
                    )}

                    {type === 'viewReason' && (
                        <Box p={3}>
                            <Typography fontWeight={600} mb={1}>
                                Reason for Send Back
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                Document mismatch found during verification. Please re-upload the correct document.
                            </Typography>

                            {/* <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3 }}
                                onClick={handleClose}
                            >
                                Close
                            </Button> */}
                        </Box>
                    )}

                    {type === 'decline' && (
                        <Box p={3}>
                            <Typography fontWeight={600} mb={1}>
                                Reason for Decline
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                Document mismatch found during verification. Please re-upload the correct document.
                            </Typography>

                            {/* <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3 }}
                                onClick={handleClose}
                            >
                                Close
                            </Button> */}
                        </Box>
                    )}



                </FormProvider>

            </DialogContent>
        </Dialog>
    );
};

export default ReAssignModal;
