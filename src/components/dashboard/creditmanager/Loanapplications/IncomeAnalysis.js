import {
    Grid, Paper, Table, Tooltip, Typography,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const cashflow = [
    { month: 'Jan', debit: 600, credit: 500 },
    { month: 'Feb', debit: 500, credit: 600 },
    { month: 'Mar', debit: 650, credit: 550 },
    { month: 'Apr', debit: 700, credit: 650 },
];

const expenses = [
    { name: 'EMI', value: 45000 },
    { name: 'Rent', value: 35000 },
    { name: 'Food', value: 42000 },
    { name: 'Others', value: 30000 },
];

const dpdHistory = [
    { date: '30 October 2025', company: 'Tech Solutions Pvt Ltd', salary: 30000 },
];




const IncomeAnalysis = () => (
    <>
        <Grid container spacing={3} mb={3}>
            {[
                ['Average Monthly Income', '₹42,500'],
                ['Salary Credits', '₹42,500'],
                ['Average Balance', '₹18,300'],
                ['Bounce Rate', '2%'],
                ['Account Age', '3 Years 8 Months'],
                ['Monthly Transactions', '26'],
            ].map(([l, v]) => (
                <Grid item xs={12} md={4} key={l}>
                    <Typography variant="caption">{l}</Typography>
                    <Typography fontWeight={600}>{v}</Typography>
                </Grid>
            ))}
        </Grid>

        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                    <Typography fontWeight={600}>Monthly Cashflow</Typography>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={cashflow}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line dataKey="credit" stroke="#4caf50" />
                            <Line dataKey="debit" stroke="#f44336" />
                        </LineChart>
                    </ResponsiveContainer>
                </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                    <Typography fontWeight={600}>Expense Categories</Typography>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={expenses}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#1976d2" />
                        </BarChart>
                    </ResponsiveContainer>
                </Paper>


            </Grid>
            <Grid item xs={12} md={12}>
                <Paper sx={{ mt: 1, borderRadius: 2 }}>
                    <Typography px={2} py={1} fontWeight={600}>
                        Salary Credit History
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell>Salary</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dpdHistory.map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>{row.company}</TableCell>
                                    <TableCell>{row.salary}</TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Grid>

        </Grid>
    </>
);
export default IncomeAnalysis;