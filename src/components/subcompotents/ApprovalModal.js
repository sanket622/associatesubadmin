
import SendIcon from '@mui/icons-material/Send';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from '@mui/material';

const ApprovalModal = ({
    open,
    onClose,
    onConfirm,
    entityLabel = 'item',
}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Submit for Approval</DialogTitle>

            <DialogContent>
                <Typography>
                    Are you sure you want to submit this {entityLabel} for approval?
                    Once submitted, it cannot be edited until reviewed.
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="outlined">
                    Cancel
                </Button>

                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="primary"
                    startIcon={<SendIcon />}
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ApprovalModal;