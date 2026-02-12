import { Box, Chip, Grid, Typography } from "@mui/material";

const KYCVerification = () => (
  <Grid container spacing={2}>
    {[
      'Photo ID Proof',
      'Address Proof',
      'Income Proof',
      'Photo',
      'Video KYC',
      'Signature (Optional)',
    ].map((doc) => (
      <Grid item xs={12} key={doc}>
        <Box display="flex" justifyContent="space-between">
          <Typography>{doc}</Typography>
          <Chip label="Verified" size="small" color="success" />
        </Box>
      </Grid>
    ))}
  </Grid>
);
export default KYCVerification;