import {
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

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from 'recharts';

const creditTrend = [
    { month: 'Jan', score: 780 },
    { month: 'Feb', score: 720 },
    { month: 'Mar', score: 680 },
    { month: 'Apr', score: 730 },
    { month: 'May', score: 690 },
    { month: 'Jun', score: 640 },
    { month: 'Jul', score: 610 },
    { month: 'Aug', score: 560 },
    { month: 'Sep', score: 520 },
    { month: 'Oct', score: 560 },
    { month: 'Nov', score: 580 },
    { month: 'Dec', score: 500 },
];

const creditMix = [
    { name: 'Credit Cards', value: 2.5 },
    { name: 'Personal Loans', value: 2.1 },
    { name: 'Auto Loans', value: 2.7 },
    { name: 'Home Loans', value: 1.0 },
    { name: 'Others', value: 2.3 },
];

const paymentHistory = [
    { credit: 'HDFC Credit Card', status: 'On Time' },
    { credit: 'HDFC Credit Card', status: 'On Time' },
];

const creditInquiries = [
    { credit: 'HDFC Credit Card', date: '01/11/2025', status: 'Hard' },
    { credit: 'Paytm', date: '01/11/2025', status: 'Hard' },
];

const dpdHistory = [
    { account: 'HDFC Credit Card', type: 'Credit Card', d30: 0, d60: 0, d90: 0 },
    { account: 'HDFC Credit Card', type: 'Credit Card', d30: 0, d60: 0, d90: 0 },
    { account: 'HDFC Credit Card', type: 'Credit Card', d30: 0, d60: 0, d90: 0 },
    { account: 'HDFC Credit Card', type: 'Credit Card', d30: 0, d60: 0, d90: 0 },
];


const CRIFBureau = () => {
    return (
        <>
           
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, borderRadius: 2 }}>
                        <Typography fontWeight={600} mb={1}>
                            Credit Score Trend (Last 12 Months)
                        </Typography>
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={creditTrend}>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    dataKey="score"
                                    stroke="#f44336"
                                    strokeWidth={2}
                                    dot
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, borderRadius: 2 }}>
                        <Typography fontWeight={600} mb={1}>
                            Credit Mix
                        </Typography>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={creditMix}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#5c6cff" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>

          
            <Paper sx={{ mt: 3, borderRadius: 2 }}>
                <Typography px={2} py={1} fontWeight={600}>
                    Payment History
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Credits</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paymentHistory.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell>{row.credit}</TableCell>
                                <TableCell sx={{ color: 'green', fontWeight: 500 }}>
                                    {row.status}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

          
            <Paper sx={{ mt: 3, borderRadius: 2 }}>
                <Typography px={2} py={1} fontWeight={600}>
                    Credit Inquiries
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Credits</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {creditInquiries.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell>{row.credit}</TableCell>
                                <TableCell>{row.date}</TableCell>
                                <TableCell sx={{ fontWeight: 500 }}>
                                    {row.status}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

         
            <Paper sx={{ mt: 3, borderRadius: 2 }}>
                <Typography px={2} py={1} fontWeight={600}>
                    DPD History
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Account</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>30 DPD</TableCell>
                            <TableCell>60 DPD</TableCell>
                            <TableCell>90+ DPD</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dpdHistory.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell>{row.account}</TableCell>
                                <TableCell>{row.type}</TableCell>
                                <TableCell>{row.d30}</TableCell>
                                <TableCell>{row.d60}</TableCell>
                                <TableCell>{row.d90}</TableCell>
                                <TableCell>
                                    <Chip label="Active" size="small" color="success" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </>
    );
};

export default CRIFBureau;
