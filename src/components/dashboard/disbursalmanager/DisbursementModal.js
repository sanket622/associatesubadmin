import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import axios from 'axios';

export default function DisbursementModal({ open, onClose, loanId, onDisburseSuccess }) {
    const { enqueueSnackbar } = useSnackbar();

    const [form, setForm] = useState({
        accountholderName: '',
        bankAccountNumber: '',
        ifsc: '',
        bankName: '',
        accountType: '',
    });

    const handleSubmit = async () => {
        const token = localStorage.getItem('accessToken');

        try {
            const res = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/loanApproval/addLoanBankDetails/${loanId}`,
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            enqueueSnackbar(
                res?.data?.message || 'Bank details added successfully',
                { variant: 'success' }
            );

            onClose();
            onDisburseSuccess?.();
        } catch (error) {
            enqueueSnackbar(
                error?.response?.data?.message ||
                    'Failed to add bank details. Please try again.',
                { variant: 'error' }
            );
        }
    };

    const isFormIncomplete =
    !form.accountholderName ||
    !form.bankAccountNumber ||
    !form.ifsc ||
    !form.bankName ||
    !form.accountType;


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Disbursement Details</DialogTitle>

            <DialogContent>
                <TextField
                    label="Account Holder Name"
                    fullWidth
                    margin="normal"
                    value={form.accountholderName}
                    onChange={(e) =>
                        setForm({ ...form, accountholderName: e.target.value })
                    }
                />

                <TextField
                    label="Account Number"
                    fullWidth
                    margin="normal"
                    value={form.bankAccountNumber}
                    onChange={(e) =>
                        setForm({ ...form, bankAccountNumber: e.target.value })
                    }
                />

                <TextField
                    label="IFSC Code"
                    fullWidth
                    margin="normal"
                    value={form.ifsc}
                    onChange={(e) =>
                        setForm({ ...form, ifsc: e.target.value })
                    }
                />

                <TextField
                    label="Bank Name"
                    fullWidth
                    margin="normal"
                    value={form.bankName}
                    onChange={(e) =>
                        setForm({ ...form, bankName: e.target.value })
                    }
                />

                <TextField
                    label="Account Type"
                    fullWidth
                    margin="normal"
                    value={form.accountType}
                    onChange={(e) =>
                        setForm({ ...form, accountType: e.target.value })
                    }
                />
            </DialogContent>

            <DialogActions>
                <Button variant="contained"   disabled={isFormIncomplete} onClick={handleSubmit}>
                    Disburse
                </Button>
            </DialogActions>
        </Dialog>
    );
}
