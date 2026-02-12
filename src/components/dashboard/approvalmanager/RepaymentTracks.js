import { useNavigate } from 'react-router-dom';
import { Button, Paper } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ReusableTable from '../../subcompotents/ReusableTable';

const sampleData = Array.from({ length: 12 }).map((_, index) => ({
  id: index + 1,
  LoanId: '000000001',
  name: 'Rajesh Kumar',
  Loantype: 'Personal Loan',
  Loanamount: '₹1500000',
  paid: '₹5,00,000',
  remaining: '₹10,00,000',
  nextDue: '12/5/2024',
}));

const RepaymentTracks = () => {
  const navigate = useNavigate();

  const columns = [
    { key: 'LoanId', label: 'Loan ID' },
    { key: 'name', label: 'Customer Name' },
    { key: 'Loantype', label: 'Loan Type' },
    { key: 'Loanamount', label: 'Loan Amount' },
    { key: 'paid', label: 'Paid' },
    { key: 'remaining', label: 'Remaining' },
    { key: 'nextDue', label: 'Next Due' },
    {
      key: 'action',
      label: 'Action',
      align: 'right',
      render: () => (
        <Button size="small" onClick={() => navigate('/repayment-details')}>
          <VisibilityOutlinedIcon sx={{ color: '#6B7280' }} />
        </Button>
      ),
    },
  ];

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      <ReusableTable
        title="Re-Payments"
        columns={columns}
        data={sampleData}
        showSearch
        showFilter
      />
    </Paper>
  );
};

export default RepaymentTracks;
