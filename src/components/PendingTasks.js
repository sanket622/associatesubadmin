import { Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';


export function PendingTasks() {
    const tasks = Array(5).fill('Overdue Repayment');


    return (
        <Card
            sx={{
                boxShadow: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <CardContent style={{ padding: 5, paddingTop: 10, paddingLeft: 10, }}>
                <Typography variant="subtitle1" fontWeight={600} >Pending Tasks</Typography>
                <List dense>
                    {tasks.map((task, i) => (
                        <ListItem key={i} style={{ backgroundColor: "#FBFBFB", margin: 5, padding: 5, borderRadius: 5 }}>
                            <ListItemIcon><WarningAmberIcon color="warning" /></ListItemIcon>
                            <ListItemText primary={task} style={{ padding: 2 }} />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
}