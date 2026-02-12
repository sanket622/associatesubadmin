import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Typography,
} from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import React from 'react';

const DisbursalAssignModal = ({ open, onClose, loanId, onSuccess }) => {

    const { enqueueSnackbar } = useSnackbar();
    const [form, setForm] = React.useState({
        assignTo: 'Finance',
        action: 'APPROVE',
        remarks: '',
    });

    const handleSubmit = async () => {
        const token = localStorage.getItem('accessToken');

        try {
            const res = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/loanApproval/processLoanApproval/${loanId}`,
                {
                    assignTo: form.assignTo,
                    action: form.action,
                    remarks: form.remarks,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );


            enqueueSnackbar(
                res?.data?.message || 'Assignment updated successfully',
                { variant: 'success' }
            );

            onSuccess?.();
        } catch (error) {

            enqueueSnackbar(
                error?.response?.data?.message || 'Something went wrong. Please try again.',
                { variant: 'error' }
            );
        }
    };


    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>  Assign loan </DialogTitle>

            <DialogContent>
                {/* <Typography fontSize={12} color="text.secondary" mb={2}>
                    Assign loan 
                </Typography> */}

                <TextField
                    select
                    fullWidth
                    label="Assign To"
                    margin="normal"
                    value={form.assignTo}
                    onChange={(e) =>
                        setForm({ ...form, assignTo: e.target.value })
                    }
                >
                    <MenuItem value="Disbursal">Disbursal</MenuItem>
                </TextField>

                <TextField
                    select
                    fullWidth
                    label="Action"
                    margin="normal"
                    value={form.action}
                    onChange={(e) =>
                        setForm({ ...form, action: e.target.value })
                    }
                >
                    <MenuItem value="APPROVE">Approve</MenuItem>
                    <MenuItem value="REJECT">Reject</MenuItem>
                </TextField>

                <TextField
                    label="Remarks"
                    multiline
                    rows={3}
                    fullWidth
                    margin="normal"
                    value={form.remarks}
                    onChange={(e) =>
                        setForm({ ...form, remarks: e.target.value })
                    }
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" type="button" onClick={handleSubmit}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DisbursalAssignModal;
