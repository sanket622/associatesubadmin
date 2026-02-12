import { Grid, Typography } from "@mui/material";

const BasicDetails = () => (
    <Grid container spacing={3}>
        {[
            ['Credit Score', '742'],
            ['Loan Amount', '₹3,50,000'],
            ['Monthly Income', '₹42,500'],
            ['Employment', 'ABC Fintech Pvt. Ltd.'],
            ['Applied On', '12/08/2025'],
            ['Mobile No', '+91 98765 32145'],
            ['Address', '789 Ring Road, Ahmedabad'],
            ['Email ID', 'rohan.pandit@example.com'],
        ].map(([l, v]) => (
            <Grid item xs={12} md={4} key={l}>
                <Typography variant="caption">{l}</Typography>
                <Typography fontWeight={600}>{v}</Typography>
            </Grid>
        ))}
    </Grid>
);
export default BasicDetails;