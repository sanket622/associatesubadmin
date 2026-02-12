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

const DeviceRisks = ({ data }) => {
    /* ===============================
       SAMPLE DATA FALLBACK
       (will be replaced by API data)
       =============================== */
    const {
        overallRisk = 'Low',
        deviceReuseCount = '3 Devices',
        ipRiskScore = '12/100',

        deviceInfo = {
            deviceId: 'A1B2C3D4E5-98F7-4432-A833-FF8822C99AC',
            model: 'Samsung Galaxy S21',
            os: 'Android 13',
            appVersion: 'v5.2.1',
            firstSeen: '14 March 2024',
            lastSeen: '23 November 2025',
            rooted: 'No',
            emulator: 'No',
        },

        ipAnalysis = {
            ip: '182.76.52.101',
            isp: 'Jio Fiber',
            location: 'Mumbai, Maharashtra, India',
            vpn: 'None Detected',
            tor: 'No',
            reputation: 'Clean',
        },

        deviceHistory = [
            {
                applicationId: 'LN20251200234',
                name: 'Rajesh Kumar Sharma',
                date: '15/11/2025',
                status: 'Under Review',
                decision: 'Pending',
            },
        ],
    } = data || {};

    return (
        <Box>
            {/* Summary */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}>
                    <Typography variant="caption">Overall Risk Level</Typography>
                    <Typography fontWeight={600}>{overallRisk}</Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Typography variant="caption">Device Reuse Count</Typography>
                    <Typography fontWeight={600}>{deviceReuseCount}</Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Typography variant="caption">IP Risk Score</Typography>
                    <Typography fontWeight={600}>{ipRiskScore}</Typography>
                </Grid>
            </Grid>

            {/* Device Info */}
            <Typography fontWeight={600} mb={2}>
                Device Information
            </Typography>

            <Grid container spacing={3} mb={3}>
                {Object.entries(deviceInfo).map(([key, value]) => (
                    <Grid item xs={12} md={4} key={key}>
                        <Typography variant="caption">
                            {key.replace(/([A-Z])/g, ' $1')}
                        </Typography>
                        <Typography fontWeight={600}>{value}</Typography>
                    </Grid>
                ))}
            </Grid>

            {/* IP Analysis */}
            <Typography fontWeight={600} mb={2}>
                IP Address Analysis
            </Typography>

            <Grid container spacing={3} mb={3}>
                {Object.entries(ipAnalysis).map(([key, value]) => (
                    <Grid item xs={12} md={4} key={key}>
                        <Typography variant="caption">
                            {key.replace(/([A-Z])/g, ' $1')}
                        </Typography>
                        <Typography fontWeight={600}>{value}</Typography>
                    </Grid>
                ))}
            </Grid>

            {/* Device History */}
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
                        {deviceHistory.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell>{row.applicationId}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.date}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={row.status}
                                        size="small"
                                        color="info"
                                    />
                                </TableCell>
                                <TableCell>{row.decision}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
};

export default DeviceRisks;
