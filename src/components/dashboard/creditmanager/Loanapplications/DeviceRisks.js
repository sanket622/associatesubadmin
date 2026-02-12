import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from '@mui/material';

const DeviceRisks = () => {
  return (
    <Box>
     
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Typography variant="caption">Overall Risk Level</Typography>
          <Typography fontWeight={600}>Low</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="caption">Device Reuse Count</Typography>
          <Typography fontWeight={600}>3 Devices</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="caption">IP Risk Score</Typography>
          <Typography fontWeight={600}>12/100</Typography>
        </Grid>
      </Grid>

     
      <Typography fontWeight={600} mb={2}>
        Device Information :
      </Typography>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Typography variant="caption">Device ID</Typography>
          <Typography fontWeight={600}>
            A1B2C3D4E5-98F7-4432-A833-FF8822C99AC
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="caption">Device Model</Typography>
          <Typography fontWeight={600}>Samsung Galaxy S21</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="caption">OS Version</Typography>
          <Typography fontWeight={600}>Android 13</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="caption">App Version</Typography>
          <Typography fontWeight={600}>v5.2.1</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="caption">First Seen</Typography>
          <Typography fontWeight={600}>14 March 2024</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="caption">Last Seen</Typography>
          <Typography fontWeight={600}>23 November 2025</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="caption">Root / Jailbreak</Typography>
          <Typography fontWeight={600}>No</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="caption">Emulator</Typography>
          <Typography fontWeight={600}>No</Typography>
        </Grid>
      </Grid>

      
      <Typography fontWeight={600} mb={2}>
        IP Address Analysis :
      </Typography>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Typography variant="caption">IP Address</Typography>
          <Typography fontWeight={600}>182.76.52.101</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="caption">ISP</Typography>
          <Typography fontWeight={600}>Jio Fiber</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="caption">Location</Typography>
          <Typography fontWeight={600}>
            Mumbai, Maharashtra, India
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="caption">VPN / Proxy</Typography>
          <Typography fontWeight={600}>None Detected</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="caption">Tor Network</Typography>
          <Typography fontWeight={600}>No</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="caption">IP Reputation</Typography>
          <Typography fontWeight={600}>
            Clean / No Suspicious Activity
          </Typography>
        </Grid>
      </Grid>

    
      <Paper sx={{ borderRadius: 2 }}>
        <Typography px={2} py={1.5} fontWeight={600}>
          Device History
        </Typography>

        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F5F7FF' }}>
              <TableCell>Application ID</TableCell>
              <TableCell>Applicant Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Decision</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell>LN20251200234</TableCell>
              <TableCell>Rajesh Kumar Sharma</TableCell>
              <TableCell>15/11/2025</TableCell>
              <TableCell>
                <Chip
                  label="Under Review"
                  size="small"
                  sx={{
                    backgroundColor: '#E8F0FE',
                    color: '#1A73E8',
                    fontWeight: 500,
                  }}
                />
              </TableCell>
              <TableCell>Pending</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default DeviceRisks;
