import { Card, CardContent, Typography, Box } from '@mui/material';


export default function StatCard({ title, value, change, icon, changeType = 'up' }) {
    const isUp = changeType === 'up';


    return (
        <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
            <CardContent sx={{ display: 'flex', height: '100%' }}>
                <Box
                    sx={{
                        width: 'auto',
                        // height: '100%',
                        borderRadius: 1.5,
                        backgroundColor: '#EEF2FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {icon}
                </Box>


                <Box flex={1}>
                    <Typography variant="body2" color="text.secondary">
                        {title}
                    </Typography>
                    <Typography variant="h5" fontWeight={600}>
                        {value}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{ color: isUp ? 'success.main' : 'error.main' }}
                    >
                        {isUp ? '▲' : '▼'} {change} This month
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}