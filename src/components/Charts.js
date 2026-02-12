
import { Card, CardContent, Typography } from '@mui/material';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    PieLabelRenderProps,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
} from 'recharts';


const data = [
    { name: 'Loan Repayments', value: 75 },
    { name: 'Disbursed Loans', value: 25 },

];

const lineData = [
    { month: 'Jan', loan: 20, repay: 30 },
    { month: 'Feb', loan: 40, repay: 35 },
    { month: 'Mar', loan: 30, repay: 50 },
    { month: 'Apr', loan: 60, repay: 40 },
    { month: 'May', loan: 20, repay: 30 },
];

const barData = [
    { name: 'Alice', value: 50 },
    { name: 'Bob', value: 60 },
    { name: 'John', value: 75 },
    { name: 'Emma', value: 80 },
];


const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
}) => {
    if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
        return null;
    }

    const radius = outerRadius + 15; 
    
    const x = cx + radius * Math.cos(-(midAngle || 0) * RADIAN);
    const y = cy + radius * Math.sin(-(midAngle || 0) * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="#1f2937" 
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
        >
            {`${((percent || 1) * 100).toFixed(0)}%`}
        </text>
    );
};





export function LoanPieChart({ isAnimationActive = true }) {
    return (
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
                <Typography variant="subtitle1" fontWeight={600}>
                    Loan Disbursement Trends
                </Typography>

                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <defs>
                            <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#70AEFF" />
                                <stop offset="100%" stopColor="#DEFBFD" />

                            </linearGradient>

                            <linearGradient id="orangeGradient" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#FFFBF6" />
                                <stop offset="100%" stopColor="#FF9F19" />
                            </linearGradient>
                        </defs>
                        <Pie
                            data={data}
                            outerRadius={80}
                            labelLine={false}
                            label={renderCustomizedLabel}
                            dataKey="value"
                            isAnimationActive={isAnimationActive}
                        >
                            <Cell fill="url(#blueGradient)" />
                            <Cell fill="url(#orangeGradient)" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}


export function PortfolioLineChart() {
    return (
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
                <Typography variant="subtitle1" fontWeight={600}>
                    Portfolio Health
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={lineData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="loan" stroke="#1976d2" />
                        <Line type="monotone" dataKey="repay" stroke="#4caf50" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export function ComplianceBarChart() {
    return (
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
                <Typography variant="subtitle1" fontWeight={600}>
                    Product Compliance
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={barData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#1976d2" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
