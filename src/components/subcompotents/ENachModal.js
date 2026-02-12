import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { primaryBtnSx } from './UtilityService';

const ENachModal = ({ open, onClose, loanId }) => {
    const [loading, setLoading] = useState(false);

    const callSampleApi = async (type) => {
        try {
            setLoading(true);

            await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/sample/${type}`,
                { loanId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                }
            );

            enqueueSnackbar(`${type} triggered successfully`, {
                variant: 'success',
            });
        } catch (error) {
            enqueueSnackbar(
                error?.response?.data?.message || 'Something went wrong',
                { variant: 'error' }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle>Banking Activation</DialogTitle>

            <DialogContent>
                <Stack direction="row"
                    spacing={2}
                    mt={1}
                    alignItems="center"
                    justifyContent="center">
                    <Button
                        variant="contained"
                        onClick={() => callSampleApi('enach')}
                        disabled={loading}
                        sx={primaryBtnSx}
                    >
                        Activate E-NACH
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() => callSampleApi('penny-drop')}
                        disabled={loading}
                        sx={primaryBtnSx}
                    >
                        Activate Penny Drop
                    </Button>

                    {loading && (
                        <Stack alignItems="center">
                            <CircularProgress size={24} />
                        </Stack>
                    )}
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ENachModal;
