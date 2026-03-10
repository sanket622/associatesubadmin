import { useState } from 'react';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DialerPage = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={600}>Dialer</Typography>
        <Button onClick={() => navigate('/customer-management')} sx={{ textTransform: 'none' }}>
          Back To Tickets
        </Button>
      </Box>
      <TextField
        label="Phone Number"
        fullWidth
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+91 98XXXXXX12"
      />
      <Box mt={2}>
        <Button variant="contained" sx={{ textTransform: 'none' }}>Call</Button>
      </Box>
    </Paper>
  );
};

export default DialerPage;
