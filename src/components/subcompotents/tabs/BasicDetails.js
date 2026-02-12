import { Grid, Typography } from '@mui/material';

const BasicDetails = ({ data }) => {
  const fields = [
    ['Credit Score', data.creditScore],
    ['Loan Amount', data.loanAmount],
    ['Monthly Income', data.income],
    ['Employment', data.employment],
    ['Applied On', data.appliedOn],
    ['Mobile No', data.mobile],
    ['Email ID', data.email],
    ['Address', data.address],
  ];

  return (
    <Grid container spacing={3}>
      {fields.map(([label, value]) => (
        <Grid item xs={12} md={4} key={label}>
          <Typography variant="caption">{label}</Typography>
          <Typography fontWeight={600}>{value}</Typography>
        </Grid>
      ))}
    </Grid>
  );
};

export default BasicDetails;
