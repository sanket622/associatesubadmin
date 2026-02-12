
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Button,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FormProvider, useForm } from 'react-hook-form';

import RHFTextField from '../../subcompotents/RHFTextField';
import RHFAutocomplete from '../../subcompotents/RHFAutocomplete';
import Label from '../../subcompotents/Label';

const FilterModal = ({ open, onClose, onApply }) => {
    const methods = useForm({
        defaultValues: {
            amountRange: null,
            loanType: null,
            assignedTo: null,
            dateFrom: '',
            dateTo: '',
        },
    });

    const { handleSubmit, reset } = methods;

    const submitHandler = (data) => {
        onApply(data);
        onClose();
    };

    const handleCancel = () => {
        reset();
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="xs" slotProps={{
            paper: {
                sx: {
                    borderRadius: 5,
                },
            },
        }}>
            <DialogTitle sx={{ background: '#E5E5FF' }}>
                Filter
                <IconButton
                    onClick={handleCancel}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <DialogContent>
                        <Box display="flex" flexDirection="column" gap={2}>
                            {/* Amount Range */}
                            <Box>
                                <Label>Amount Range</Label>
                                <RHFAutocomplete
                                    name="amountRange"
                                    placeholder="Select amount range"
                                    options={[
                                        { label: '0 - 1 Lakh', value: '0-1L' },
                                        { label: '1 - 5 Lakh', value: '1-5L' },
                                        { label: '5 Lakh+', value: '5L+' },
                                    ]}
                                    getOptionLabel={(opt) => opt.label}
                                />
                            </Box>


                            <Box>
                                <Label>Loan Type</Label>
                                <RHFAutocomplete
                                    name="loanType"
                                    placeholder="Select loan type"
                                    options={[
                                        { label: 'Personal Loan', value: 'personal' },
                                        { label: 'Business Loan', value: 'business' },
                                    ]}
                                    getOptionLabel={(opt) => opt.label}
                                />
                            </Box>


                            <Box>
                                <Label>Assigned To</Label>
                                <RHFAutocomplete
                                    name="assignedTo"
                                    placeholder="Select user"
                                    options={[
                                        { label: 'Operation Manager', value: 'manager' },
                                        { label: 'Admin', value: 'admin' },
                                    ]}
                                    getOptionLabel={(opt) => opt.label}
                                />
                            </Box>


                            <Box>
                                <Label>Date From</Label>
                                <RHFTextField name="dateFrom" type="date" />
                            </Box>

                            <Box>
                                <Label>Date To</Label>
                                <RHFTextField name="dateTo" type="date" />
                            </Box>
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button variant="outlined" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button variant="contained" type="submit">
                            Apply
                        </Button>
                    </DialogActions>
                </form>
            </FormProvider>
        </Dialog>
    );
};

export default FilterModal;
