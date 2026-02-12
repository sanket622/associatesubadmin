import {
    Grid,
    Paper,
    Typography,
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
import ReusableTable from '../ReusableTable';

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

const paymentHistoryColumns = [
    { key: 'credit', label: 'Credits' },
    {
        key: 'status',
        label: 'Status',
        render: (value) => (
            <Typography sx={{ color: 'green', fontWeight: 500 }}>
                {value}
            </Typography>
        ),
    },
];

const paymentHistory = [
    {
        credit: 'HDFC Credit Card',
        status: 'On Time',
    },
    {
        credit: 'ICICI Personal Loan',
        status: 'On Time',
    },
    {
        credit: 'Axis Bank Auto Loan',
        status: 'Delayed',
    },
];


const creditInquiryColumns = [
    { key: 'credit', label: 'Credits' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status' },
];

const creditInquiries = [
    {
        credit: 'HDFC Credit Card',
        date: '01/11/2025',
        status: 'Hard',
    },
    {
        credit: 'Paytm Postpaid',
        date: '05/11/2025',
        status: 'Soft',
    },
    {
        credit: 'Bajaj Finserv',
        date: '10/11/2025',
        status: 'Hard',
    },
];


const dpdColumns = [
    { key: 'account', label: 'Account' },
    { key: 'type', label: 'Type' },
    { key: 'd30', label: '30 DPD' },
    { key: 'd60', label: '60 DPD' },
    { key: 'd90', label: '90+ DPD' },
    {
        key: 'status',
        label: 'Status',
        render: () => <Chip label="Active" size="small" color="success" />,
    },
];

const dpdHistory = [
    {
        account: 'HDFC Credit Card',
        type: 'Credit Card',
        d30: 0,
        d60: 0,
        d90: 0,
    },
    {
        account: 'ICICI Personal Loan',
        type: 'Personal Loan',
        d30: 1,
        d60: 0,
        d90: 0,
    },
    {
        account: 'Axis Auto Loan',
        type: 'Auto Loan',
        d30: 0,
        d60: 1,
        d90: 0,
    },
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


            <ReusableTable
                title="Payment History"
                columns={paymentHistoryColumns}
                data={paymentHistory}
            />


            <Paper sx={{ mt: 3, borderRadius: 2 }}>
                <ReusableTable
                    title="Credit Inquiries"
                    columns={creditInquiryColumns}
                    data={creditInquiries}
                />

            </Paper>


            <Paper sx={{ mt: 3, borderRadius: 2 }}>
                <ReusableTable
                    title="DPD History"
                    columns={dpdColumns}
                    data={dpdHistory}
                />

            </Paper>
        </>
    );
};

export default CRIFBureau;
