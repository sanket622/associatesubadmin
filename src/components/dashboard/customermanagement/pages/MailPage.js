import { useState } from 'react';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MailPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ to: '', subject: '', message: '' });

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={600}>Mail</Typography>
        <Button onClick={() => navigate('/customer-management')} sx={{ textTransform: 'none' }}>
          Back To Tickets
        </Button>
      </Box>
      <TextField
        label="To"
        fullWidth
        margin="dense"
        value={form.to}
        onChange={(e) => setForm((prev) => ({ ...prev, to: e.target.value }))}
      />
      <TextField
        label="Subject"
        fullWidth
        margin="dense"
        value={form.subject}
        onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
      />
      <TextField
        label="Message"
        fullWidth
        margin="dense"
        multiline
        minRows={5}
        value={form.message}
        onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
      />
      <Box mt={2}>
        <Button variant="contained" sx={{ textTransform: 'none' }}>Send</Button>
      </Box>
    </Paper>
  );
};

export default MailPage;
