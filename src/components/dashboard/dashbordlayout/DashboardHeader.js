import Grid from '@mui/material/Grid';
import StatCard from '../../StatCard';
import { PendingTasks } from '../../PendingTasks';
import { LoanPieChart, PortfolioLineChart, ComplianceBarChart } from '../../Charts';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentsIcon from '@mui/icons-material/Payments';
import SpeedIcon from '@mui/icons-material/Speed';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import VerifiedIcon from '@mui/icons-material/Verified';


const statCards = [
    {
        title: 'Total Employers',
        value: '500',
        change: '+15',
        icon: <PeopleIcon sx={{ color: '#6366F1' }} />,
    },
    {
        title: 'Total Loan Disbursed',
        value: '₹500',
        change: '₹4500',
        icon: <AccountBalanceIcon sx={{ color: '#6366F1' }} />,
    },
    {
        title: 'Total Repayments Processed',
        value: '₹500',
        change: '+11',
        icon: <PaymentsIcon sx={{ color: '#6366F1' }} />,
    },
    {
        title: 'Portfolio Limits',
        value: '50%',
        change: '+1%',
        icon: <SpeedIcon sx={{ color: '#6366F1' }} />,
    },
    {
        title: 'Employers Reporting Issue',
        value: '50%',
        change: '+1%',
        icon: <ReportProblemIcon sx={{ color: '#6366F1' }} />,
    },
    {
        title: 'Compliance Score',
        value: '499',
        change: '-1',
        changeType: 'down',
        icon: <VerifiedIcon sx={{ color: '#6366F1' }} />,
    },
];


export default function Dashboard() {
    return (
        <Grid container spacing={2} alignItems="stretch">
           
            <Grid item xs={12} md={7} sx={{ display: 'flex' }}>
                <Grid
                    container
                    spacing={2}
                    sx={{ height: '100%' }}  
                    alignItems="stretch"
                >
                    {statCards.map((card, index) => (
                        <Grid key={index} item xs={12} sm={6} md={4}>
                            <StatCard {...card} />
                        </Grid>
                    ))}
                </Grid>
            </Grid>

           
            <Grid item xs={12} md={5} >
                <PendingTasks />
            </Grid>

         
            <Grid item xs={12} md={4}>
                <LoanPieChart />
            </Grid>

            <Grid item xs={12} md={8}>
                <PortfolioLineChart />
            </Grid>

            <Grid item xs={12}>
                <ComplianceBarChart />
            </Grid>
        </Grid>

    );
}