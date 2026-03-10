import { useState } from 'react';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const WhatsAppPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ number: '', message: '' });

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={600}>WhatsApp</Typography>
        <Button onClick={() => navigate('/customer-management')} sx={{ textTransform: 'none' }}>
          Back To Tickets
        </Button>
      </Box>
      <TextField
        label="Number"
        fullWidth
        margin="dense"
        placeholder="+91 98XXXXXX12"
        value={form.number}
        onChange={(e) => setForm((prev) => ({ ...prev, number: e.target.value }))}
      />
      <TextField
        label="Message"
        fullWidth
        margin="dense"
        multiline
        minRows={4}
        value={form.message}
        onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
      />
      <Box mt={2}>
        <Button variant="contained" sx={{ textTransform: 'none' }}>Send</Button>
      </Box>
    </Paper>
  );
};

export default WhatsAppPage;
