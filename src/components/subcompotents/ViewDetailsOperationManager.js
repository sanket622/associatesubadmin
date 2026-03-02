import {
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  DialogActions,
  Card,
  CardContent,
  Alert,
  Divider,
  StepContent,
  Chip,
  StepLabel,
  Step,
  Stepper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CardHeader,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VisibilityOutlinedIcon from '@mui/icons-material/Visibility';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import DescriptionIcon from '@mui/icons-material/Description';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { enqueueSnackbar } from 'notistack';
import { SendIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ReusableTabs from './ReusableTabs';
import ReusableTable from './ReusableTable';
import ReAssignModal from '../dashboard/creditmanager/ReAssignModal';
import DisbursementModal from '../dashboard/disbursalmanager/DisbursementModal';
import DisbursalAssignModal from '../dashboard/disbursalmanager/DisbursalAssignModal';
import {
  fetchLoanDetailsById,
  resetLoanDetails,
} from '../../redux/getPendingLoans/loanDetailsslice';
import {
  fetchCustomerReviewDetails,
  resetCustomerReviewDetails,
} from '../../redux/getPendingLoans/customerReviewDetailsSlice';
import { fetchKycApplicantDetails } from '../../redux/creditManager/kycApplicantsSlice';
import { formatDateTime, hasPermission, ROLE_PERMISSIONS, formatCrifSummary, canViewCreditTab, formatLabel, canViewVkycTab, canViewOtherDocsTab, canViewAATab, canViewLoanApprovedTab, canViewAddBankDetailsTab, canShowLoanApproveButton, canViewSignedDocuments, canViewDisbursalPreview, getAssignToRoles, formatDateVkyc, primaryBtnSx, canViewEmiRepaymentsTab, canViewAgreementTab, canViewBSATxn, canViewBrePolicyTab } from './UtilityService';
import axios from 'axios';
import PaymentApprovalModal from '../dashboard/approvalmanager/PaymentApprovalModal';
import ENachModal from './ENachModal';

const MEDIA_BASE = process.env.REACT_APP_BACKEND_MEDIA;
const isVideoFile = (url = '') =>
  /\.(mp4|webm|ogg|mov)$/i.test(url);

const openVideoInNewTab = (videoUrl) => { window.open(videoUrl, '_blank', 'noopener,noreferrer'); };

// console.log(getAssignToRoles);




const ViewDetailsOperationManager = () => {
  const navigate = useNavigate();
  const { loanId } = useParams();
  const dispatch = useDispatch();
  const [kycForm, setKycForm] = useState({
    status: '',
    comment: '',
  });
  const [verifyForm, setVerifyForm] = useState({
    status: '',
    remarks: '',
    loanAmount: '',
    interestRate: '',
    tenure: '',
    processingFeePercent: '',
    insuranceAmount: '',
    stampDuty: '',
    otherCharges: '',
  });

  const { data: loanData, loading, error } = useSelector(
    (state) => state.loanDetails
  );
  const { data: customerReviewData } = useSelector(
    (state) => state.customerReviewDetails
  );
  // console.log(loanData?.variantId);
  const userRole = localStorage.getItem('role');

  const [activeTab, setActiveTab] = useState(0);
  const [modalType, setModalType] = useState(null);
  const [scReassignOpen, setScReassignOpen] = useState(false);
  const [openAgreementModal, setOpenAgreementModal] = useState(false);
  const [agreementTemplates, setAgreementTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [openDisbursement, setOpenDisbursement] = useState(false);
  const [openDisbursalAssign, setOpenDisbursalAssign] = useState(false);
  const [openPaymentApproval, setOpenPaymentApproval] = useState(false);
  const [openENachModal, setOpenENachModal] = useState(false);
  const [agreementLoading, setAgreementLoading] = useState(false);
  // const [agreementData, setAgreementData] = useState(null);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [bsaCategory, setBsaCategory] = useState('ALL');
  const [overallInflowCategory, setOverallInflowCategory] = useState('ALL');
  const [overallExpenseCategory, setOverallExpenseCategory] = useState('ALL');
  const [showExcel, setShowExcel] = useState(false);
  const [agreements, setAgreements] = useState([]);
  const [showAgreementTable, setShowAgreementTable] = useState(false);
  const [showSixMonthExcel, setShowSixMonthExcel] = useState(false);
  const [verifyAccountLoading, setVerifyAccountLoading] = useState(false);
  const [bankVerificationResult, setBankVerificationResult] = useState(null);
  const [breResult, setBreResult] = useState(
    loanData?.LoanBreScoaring || null
  );


  // const [openCrifPdf, setOpenCrifPdf] = useState(false);
  const [aaData, setAaData] = useState(null);
  const [aaLoading, setAaLoading] = useState(false);

  const location = useLocation();
  const source = location.state?.source;
  const showAllTabs = location.state?.showAllTabs === true;
  const verifiedpage = location.state?.PageName === 'verifiedpage';

  const [scForm, setScForm] = useState({
    assignTo: '',
    action: 'APPROVE',
    remarks: '',
    approvedAmount: '',
    interestRate: '',
    tenure: '',
    interestType: '',
  });


  useEffect(() => {
    if (!loanId) {
      navigate(-1);
      return;
    }

    dispatch(fetchLoanDetailsById(loanId));

    return () => {
      dispatch(resetLoanDetails());
      dispatch(resetCustomerReviewDetails());
    };
  }, [loanId, dispatch, navigate]);



  useEffect(() => {
    if (loanData?.LoanBreScoaring) {
      setBreResult(loanData.LoanBreScoaring);
    }
  }, [loanData?.LoanBreScoaring]);

  const refreshLoanData = useCallback(() => {
    dispatch(fetchLoanDetailsById(loanId));
  }, [dispatch, loanId]);

  // useEffect(() => {
  //   handleGetAgreement();
  // }, [])

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      navigate(-1);
    }
  }, [error, navigate]);



  const {
    employee,
    creditApproved,
    loanCode,
    vkycStatus,
    LoanFormData,
    LoanCreditData,
    LoanVkycData,
    LoanOtherDocs = [],
    approver,
    LoanCamsData,
    LoanCamsConsent = [],
    LoanApprovedData,
    LoanEsignDocuments,
    LoanCharges,
    LoanDisbursalSummary,
    LoanBankDetails,
    LoanApplicationLogs = [],
    LoanEmiDetails,
    LoanRepaymentSchedule = [],
    LoanFinancialData = [],
  } = loanData || {};
  
  const [selectedBank, setSelectedBank] = useState(LoanFinancialData?.[0]?.id || null);

  useEffect(() => {
    if (LoanFinancialData?.length > 0 && !selectedBank) {
      setSelectedBank(LoanFinancialData[0].id);
    }
  }, [LoanFinancialData, selectedBank]);
  // console.log(creditApproved);
  const bsaTxnData = loanData?.LoanCreditData || null;
  const accountNumber =
    bsaTxnData?.bsaTxnData?.data?.entity?.[0]?.acc_no || '-';

  const overallExpense = useMemo(() => {
    return bsaTxnData?.bsaTxnData?.data?.entity?.[0]?.expense ?? {};
  }, [bsaTxnData]);
  const bsaTransactionData = bsaTxnData?.bsaTxnData?.data || null;

  const overall = useMemo(() => {
    return bsaTransactionData?.overall || null;
  }, [bsaTransactionData]);


  const bsaJsonOutput = bsaTxnData?.bsaJsonData || null;


  const normalizeKeyValue = (obj = {}) =>
    Object.entries(obj).map(([key, value]) => ({
      field: key,
      value:
        typeof value === 'object'
          ? JSON.stringify(value, null, 2)
          : value ?? '-',
    }));

  const bsaProfileTable = normalizeKeyValue(
    bsaJsonOutput?.custProfile || {}
  );

  const flattenBsaTxnTable = (bsaData) => {
    if (!bsaData) return [];

    const rows = [];

    const processCategory = (section, accNo = '-') => {
      if (!section) return;

      Object.entries(section).forEach(([category, obj]) => {
        obj.transactions?.forEach((txn) => {
          rows.push({
            account: accNo,
            category,
            amount: txn.amount,
            type: txn.type,
            mode: txn.mode,
            instrument: txn.instrument,
            counterParty: txn.counterParty,
            narration: txn.narration,
            balance: txn.currentBalance,
            txnId: txn.txnId,
            txnTime: formatDateTime(txn.transactionTimestamp),
          });
        });
      });
    };

    // Entity level
    bsaData.entity?.forEach((acc) => {
      processCategory(acc.expense, acc.acc_no);
      processCategory(acc.inflow, acc.acc_no);
    });

    // Overall
    processCategory(bsaData.overall?.expense);
    processCategory(bsaData.overall?.inflow);

    return rows;
  };



  const flattenedTransactions = useMemo(() => {
    if (!overallExpense || !Object.keys(overallExpense).length) return [];

    const rows = [];

    Object.entries(overallExpense).forEach(([category, value]) => {


      (value?.transactions || []).forEach((txn) => {
        rows.push({
          account: accountNumber,
          category,
          amount: txn.amount,
          type: txn.type,
          mode: txn.mode,
          instrument: txn.instrument,
          counterParty: txn.counterParty,
          narration: txn.narration,
          balance: txn.currentBalance,
          txnId: txn.txnId,
          txnTime: formatDateTime(txn.transactionTimestamp),
        });
      });
    });

    return rows;
  }, [overallExpense]);


  const flattenOverallTransactions = (overall, flowType) => {
    if (!overall?.[flowType]) return [];

    return Object.entries(overall[flowType]).flatMap(
      ([category, data]) =>
        (data.transactions || []).map(txn => ({
          flowType: flowType.toUpperCase(),
          category,
          amount: txn.amount,
          txnType: txn.type,
          instrument: txn.instrument,
          mode: txn.mode,
          counterParty: txn.counterParty,
          narration: txn.narration,
          balance: txn.currentBalance,
          txnTime: formatDateTime(txn.transactionTimestamp),
          txnId: txn.txnId,
          reference: txn.reference,
        }))
    );
  };



  const allCategoryOptions = useMemo(() => {
    const inflowCategories = Object.keys(overall?.inflow || {});
    const expenseCategories = Object.keys(overall?.expense || {});

    return [
      'ALL',
      ...new Set([...inflowCategories, ...expenseCategories]),
    ];
  }, [overall]);







  const OVERALL_COLUMNS = [
    { key: 'flowType', label: 'Flow' },
    { key: 'category', label: 'Category' },
    { key: 'amount', label: 'Amount' },
    { key: 'txnType', label: 'Txn Type' },
    { key: 'instrument', label: 'Instrument' },
    { key: 'mode', label: 'Mode' },
    { key: 'counterParty', label: 'Counter Party' },
    { key: 'balance', label: 'Balance' },
    { key: 'txnTime', label: 'Txn Time' },
    { key: 'txnId', label: 'Txn ID' },
    { key: 'reference', label: 'Reference' },
  ];




  const BSA_TXN_COLUMNS = [
    { key: 'account', label: 'Account' },
    { key: 'category', label: 'Category' },
    { key: 'amount', label: 'Amount' },
    { key: 'type', label: 'Type' },
    { key: 'mode', label: 'Mode' },
    { key: 'instrument', label: 'Instrument' },
    { key: 'counterParty', label: 'Counter Party' },
    { key: 'balance', label: 'Balance' },
    { key: 'txnTime', label: 'Txn Time' },
    { key: 'txnId', label: 'Txn ID' },
  ];

  // console.log(bsaTxnData);


  const hasBankDetails = Boolean(LoanBankDetails?.id);
  const bankVerificationFromDetails = Boolean(
    LoanBankDetails?.isVerified ??
    LoanBankDetails?.isAccountVerified ??
    LoanBankDetails?.verified
  );
  const isBankVerified = bankVerificationFromDetails || Boolean(bankVerificationResult?.success);
  const bankVerificationLabel = isBankVerified ? 'Verified' : 'Not Verified';
  const statementData = LoanCreditData?.statementJson?.Account;
  const esignDocs = LoanEsignDocuments || [];

  const pendingDocs = esignDocs.filter(d => d.status === 'PENDING');
  const completedDocs = esignDocs.filter(d => d.status === 'COMPLETED');

  const hasPendingEsign = pendingDocs.length > 0;


  const camsStatus = LoanCamsData?.status;

  const isSendRedirectionDisabled =
    camsStatus === 'CONSENT_RECEIVED' ||
    camsStatus === 'LINK_GENERATED';

  const extractVkycDetails = (vkycSource) => {
    const vkycJson = vkycSource?.vkycJson || vkycSource?.vkycData?.vkycJson;

    if (!vkycJson || typeof vkycJson !== 'object') return null;


    const [referenceId, data] = Object.entries(vkycJson)[0] || [];
    return data ? { ...data, referenceId } : null;

  };



  const EMI_DETAILS_COLUMNS = [
    { key: 'emiAmount', label: 'EMI Amount' },
    { key: 'principalEmi', label: 'Principal EMI' },
    { key: 'interestEmi', label: 'Interest EMI' },
    { key: 'totalInterest', label: 'Total Interest' },
    { key: 'totalPayable', label: 'Total Payable' },
    { key: 'tenure', label: 'Tenure (Months)' },
  ];

  const EMI_SCHEDULE_COLUMNS = [
    { key: 'emiNumber', label: 'EMI No.' },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (v) => formatDateTime(v),
    },
    { key: 'emiAmount', label: 'EMI Amount' },
    { key: 'principalAmount', label: 'Principal' },
    { key: 'interestAmount', label: 'Interest' },
    { key: 'paidAmount', label: 'Amount Paid' },
    { key: 'outstandingPrincipal', label: 'Outstanding Principal' },
    { key: 'status', label: 'Status' },
  ];

  const canViewEmiTab = canViewEmiRepaymentsTab(userRole, {
    LoanEmiDetails,
    LoanRepaymentSchedule,
  });

  const formJson = LoanFormData?.formJsonData || {};
  const {
    basicDetails = {},
    document_uploads = {},
    documents = {},
  } = formJson;
  const customerId =
    loanData?.customerId ||
    loanData?.employee?.customerId ||
    loanData?.employee?.id ||
    loanData?.employeeId ||
    basicDetails?.customerId ||
    null;

  const role = approver?.role?.roleName;

  useEffect(() => {
    if (!customerId) {
      dispatch(resetCustomerReviewDetails());
      return;
    }

    dispatch(fetchCustomerReviewDetails(customerId));
  }, [customerId, dispatch]);

  const normalizeDocumentRows = useMemo(() => {
    const preferredSource =
      Object.keys(document_uploads || {}).length > 0
        ? document_uploads
        : documents;

    const extractPaths = (value) => {
      if (!value) return [];

      if (typeof value === 'string') return [value];

      if (Array.isArray(value)) {
        return value
          .flatMap((item) => extractPaths(item))
          .filter(Boolean);
      }

      if (typeof value === 'object') {
        const candidate =
          value.filePath ||
          value.path ||
          value.url ||
          value.docUrl ||
          value.documentUrl ||
          value.uploadUrl;

        return candidate ? [candidate] : [];
      }

      return [];
    };

    return Object.entries(preferredSource || {})
      .filter(([key]) => key !== 'order')
      .flatMap(([key, value]) => {
        const filePaths = extractPaths(value);

        return filePaths.map((filePath, index) => ({
          name:
            filePaths.length > 1
              ? `${formatLabel(key)} ${index + 1}`
              : formatLabel(key),
          filePath,
        }));
      });
  }, [document_uploads, documents]);

  const getDocumentUrl = (filePath = '') => {
    if (!filePath) return '';
    if (typeof filePath === 'string' && /^https?:\/\//i.test(filePath)) {
      return filePath;
    }
    return `${MEDIA_BASE}${filePath}`;
  };

  const fetchCreditReportForCustomer = async () => {
    try {
      const token = localStorage.getItem('accessToken');

      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/credit/fetchCreditReportCustomer/${loanId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res?.data?.success) {
        enqueueSnackbar(res?.data?.message || 'Failed to fetch credit report', {
          variant: 'error',
        });
      }
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message || 'Something went wrong',
        { variant: 'error' }
      );
    }
  };

  const handleFetchCreditReportAndOpenModal = () => {
    setScReassignOpen(true);
    fetchCreditReportForCustomer();
  };

  const handleOpenAgreementModal = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      setAgreementLoading(true);

      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/associate/agreement/getAgreementTemplateForManager`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAgreementTemplates(res.data?.data || []);
      setOpenAgreementModal(true);
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message || error.message,
        { variant: 'error' }
      );
    } finally {
      setAgreementLoading(false);
    }
  };
  const handleCreateAgreementDraft = async () => {
    try {
      const token = localStorage.getItem('accessToken');

      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/agreement/createAgreementDraft/${loanId}`,
        { templateId: selectedTemplateId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      enqueueSnackbar(res.data.message || 'Agreement draft created', { variant: 'success' });
      setOpenAgreementModal(false);


      setActiveTab(
        viewData.tabs.findIndex(t => t.type === 'agreement')
      );

    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || 'Failed', { variant: 'error' });
    }
  };

  const handleSendAgreementToCustomer = async (id) => {
    const token = localStorage.getItem('accessToken');
    try {
      setAgreementLoading(true);

      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/agreement/sendAgreementToCustomer/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      enqueueSnackbar(
        res?.data?.message || 'Agreement sent successfully',
        { variant: 'success' }
      );
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message || 'Failed to send agreement',
        { variant: 'error' }
      );
    } finally {
      setAgreementLoading(false);
    }
  };

  const handleGetAgreement = async () => {
    try {
      setAgreementLoading(true);

      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/agreement/getAgreementsForManager/${loanId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      const agreementsList = res?.data?.data || [];

      if (!agreementsList.length) {
        enqueueSnackbar('No agreements found', { variant: 'info' });
        return;
      }

      setAgreements(agreementsList);
      setShowAgreementTable(true);
      setAgreementChecked(true);
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message || 'Failed to fetch agreements',
        { variant: 'error' }
      );
    } finally {
      setAgreementLoading(false);
    }
  };

  const handleSendEsign = async (agreementId) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/leegality/sendEsignDocumentToCustomer/${agreementId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      enqueueSnackbar(res?.data?.message || 'eSign request sent successfully', {
        variant: 'success',
      });

      handleGetAgreement();
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message || 'Failed to send eSign request',
        { variant: 'error' }
      );
    }
  };



  const handleDeleteAgreement = async (agreementId) => {
    try {
      setAgreementLoading(true);

      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/agreement/deleteAgreement/${agreementId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      enqueueSnackbar('Agreement deleted successfully', { variant: 'success' });

      // refresh list
      setAgreements(prev => prev.filter(a => a.id !== agreementId));
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message || 'Failed to delete agreement',
        { variant: 'error' }
      );
    } finally {
      setAgreementLoading(false);
    }
  };

  const handleVerifyBankAccount = async () => {
    const bankId = LoanBankDetails?.id;

    if (!bankId) {
      enqueueSnackbar('Bank details are missing. Please add bank details first.', {
        variant: 'warning',
      });
      return;
    }

    try {
      setVerifyAccountLoading(true);
      const token = localStorage.getItem('accessToken');

      const verifyUrl = `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/verifyBank/verifyBankAccount/${bankId}`;
      const authHeaders = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let res;
      try {
        res = await axios.post(verifyUrl, {}, authHeaders);
      } catch (postError) {
        const postStatus = postError?.response?.status;
        if (postStatus === 404 || postStatus === 405) {
          res = await axios.get(verifyUrl, authHeaders);
        } else {
          throw postError;
        }
      }

      const apiSuccess = Boolean(res?.data?.success);
      const statusFromData = res?.data?.data?.status;
      const isVerified =
        typeof statusFromData === 'boolean' ? statusFromData : apiSuccess;
      const message =
        res?.data?.message ||
        (isVerified ? 'Bank account verified successfully' : 'Bank account verification failed');

      setBankVerificationResult({
        success: isVerified,
        message,
      });

      enqueueSnackbar(message, {
        variant: isVerified ? 'success' : 'error',
      });
    } catch (error) {
      const message =
        error?.response?.data?.message || 'Unable to verify bank account';

      setBankVerificationResult({
        success: false,
        message,
      });

      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setVerifyAccountLoading(false);
    }
  };



  const handleSubmitKyc = async () => {
    try {
      const token = localStorage.getItem('accessToken');

      // Map KYC status → loan approval action
      const actionMap = {
        APPROVED: 'APPROVE',
        REJECTED: 'REJECT',
        PENDING: 'PENDING',
      };

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/loanApproval/processLoanApproval/${loanId}`,
        {
          assignTo: 'Senior_Ops',
          action: actionMap[kycForm.status],
          remarks: kycForm.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      enqueueSnackbar('KYC submitted successfully', { variant: 'success' });

      setModalType(null);
      setKycForm({ status: '', comment: '' });
      
      if (source === 'KYC_APPLICANTS') {
        dispatch(fetchKycApplicantDetails({ page: 1, limit: 10 }));
        navigate(-1);
      } else {
        refreshLoanData();
      }
    } catch (err) {
      enqueueSnackbar(
        err?.response?.data?.message || 'Failed to submit KYC',
        { variant: 'error' }
      );
    }
  };

  const handleVerifySubmit = async () => {

    try {

      const token = localStorage.getItem('accessToken');

      const isSeniorCredit =
        userRole === 'Senior_Credit' || userRole === 'Finance';


      const url = isSeniorCredit
        ? `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/loanApproval/approveLoan/${loanId}`
        : `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/loanApproval/processLoanApproval/${loanId}`;

      const payload = isSeniorCredit
        ? {
          interestType: verifyForm.interestType,
          // remarks: verifyForm.remarks,
          approvedAmount: Number(verifyForm.loanAmount),
          interestRate: Number(verifyForm.interestRate),
          tenure: Number(verifyForm.tenure),
          processingFeePercent: Number(verifyForm.processingFeePercent),
          insuranceAmount: Number(verifyForm.insuranceAmount),
          stampDuty: Number(verifyForm.stampDuty),
          otherCharges: Number(verifyForm.otherCharges),
        }
        : {
          action: verifyForm.status,
          remarks: verifyForm.remarks,
          loanAmount: verifyForm.loanAmount,
          interestRate: verifyForm.interestRate,
          tenure: verifyForm.tenure,
        };

      const res = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });


      enqueueSnackbar(res?.data?.message || 'Loan verified successfully', { variant: 'success' });
      setModalType(null);
      setVerifyForm({
        status: '',
        remarks: '',
        loanAmount: '',
        interestRate: '',
        tenure: '',
        processingFeePercent: '',
        insuranceAmount: '',
        stampDuty: '',
        otherCharges: '',
      });
      refreshLoanData();
      // window.location.reload();
    } catch (err) {
      console.log(err);

      enqueueSnackbar(
        err?.response?.data?.message,
        { variant: 'error' }
      );
    }
  };

  const handleSendAARedirection = async () => {
    try {
      const token = localStorage.getItem('accessToken');

      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/aggregator/createAARedirection/${loanId}`,
        { phone: basicDetails?.phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      enqueueSnackbar(res?.data?.message || 'Redirection link sent successfully', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(
        err?.response?.data?.message || 'Failed to send redirection link',
        { variant: 'error' }
      );
    }
  };

  const handleFetchPeriodicData = async () => {
    try {
      setAaLoading(true);
      const token = localStorage.getItem('accessToken');
      const consent = LoanCamsConsent?.find(c => c.purpose === 'TRANSACTION_FETCH');
      const consentId = consent?.consentId;

      if (!consentId) {
        enqueueSnackbar('Consent ID not found', { variant: 'error' });
        return;
      }

      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/aggregator/fetchPeriodicData/${consentId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAaData(res?.data?.data);
      enqueueSnackbar(res?.data?.message || 'data fetched successfully', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(
        err?.response?.data?.message || 'Failed to fetch periodic data',
        { variant: 'error' }
      );
    } finally {
      setAaLoading(false);
    }
  };



  const showSubmitKyc =
    source === 'KYC_APPLICANTS' &&
    hasPermission(ROLE_PERMISSIONS.SUBMIT_KYC);

  const isSeniorCreditLoanApp =
    (userRole === 'Senior_Credit' || userRole === 'Senior_Ops') && source === 'loanapplication';

  const handleAskDocumentSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('accessToken');

      const payload = {
        loanApplicationId: loanId,
        documents: formData.documentType.map(doc => ({
          docName: doc.name,
        })),
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/manager/askAdditionalDocs`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      enqueueSnackbar(response?.data?.message || 'Document request sent successfully', {
        variant: 'success',
      });

      setModalType(null);
      refreshLoanData();
    } catch (err) {
      enqueueSnackbar(
        err?.response?.data?.message || 'Failed to send document request',
        { variant: 'error' }
      );
    }
  };

  const handleSeniorCreditReassign = async () => {
    try {
      const token = localStorage.getItem('accessToken');

      const payload = {
        assignTo: scForm.assignTo,
        action: scForm.action,
        remarks: scForm.remarks,
      };

      // if (scForm.assignTo === 'Finance') {
      //   payload.approvedAmount = scForm.approvedAmount;
      //   payload.interestRate = scForm.interestRate;
      //   payload.tenure = scForm.tenure;
      //   payload.interestType = scForm.interestType;
      // }

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/loanApproval/processLoanApproval/${loanId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      enqueueSnackbar(response?.data?.message || 'Loan reassigned successfully', { variant: 'success' });
      setScReassignOpen(false);
      refreshLoanData();
    } catch (err) {
      enqueueSnackbar(
        err?.response?.data?.message || 'Reassign failed',
        { variant: 'error' }
      );
    }
  };



  // console.log(LoanEsignDocuments);





  const assignOptions =
    getAssignToRoles(role).map((r, i) => ({
      id: i + 1,
      name: r,
    }));

  // console.log(showAllTabs);




  const viewData = useMemo(() => {
    const dynamicTabs = Object.entries(formJson || {})
      .filter(
        ([key]) =>
          key.trim() !== 'documents' && key.trim() !== 'document_uploads'
      )
      .sort(([, a], [, b]) => (a?.order || 999) - (b?.order || 999))
      .map(([sectionKey, sectionData]) => {
        const cleanSectionKey = sectionKey.trim();

        return {
          label: formatLabel(cleanSectionKey),
          type: 'keyValue',
          data: Object.entries(sectionData || {}).reduce(
            (acc, [k, v]) => {
              if (k !== 'order') {
                acc[formatLabel(k.trim())] = v ?? '-';
              }
              return acc;
            },
            {}
          ),
        };
      });

    const vkycSource = customerReviewData?.vkyc?.vkycData || LoanVkycData;
    const vkycDetails = extractVkycDetails(vkycSource);
    const dedupeSummaryRows = Object.entries(customerReviewData?.dedupe?.summary || {}).map(
      ([field, value]) => ({
        field: formatLabel(field),
        value: value ?? '-',
      })
    );
    return {
      name: employee?.employeeName || '-',
      loanId: loanCode || '-',
      tabs: [
        ...dynamicTabs,
        ...(showAllTabs || canViewAATab(userRole, LoanCreditData)
          ? [
            {
              label: 'Account aggregator',
              type: 'aa',
              data: { LoanFinancialData },
            },
          ]
          : []),

        ...(canViewBSATxn(userRole) && bsaTxnData
          ? [
            {
              label: 'BSA Data',
              type: 'bsaTxnOnly',
              data: {
                profile: bsaProfileTable,
                transactions: flattenBsaTxnTable(bsaTransactionData),
              },
            },
          ]
          : []),



        ...(showAllTabs || canViewLoanApprovedTab(userRole, LoanApprovedData)
          ? [
            {
              label: 'Loan Approval',
              type: 'loanApproved',
              data: {
                approved: LoanApprovedData,
                charges: LoanCharges,
                disbursal: LoanDisbursalSummary,
              },
            }

          ]
          : []),


        {
          label: 'Documents',
          type: 'documents',
          data: normalizeDocumentRows,
        },

        ...(
          showAllTabs ||
            (canViewSignedDocuments(userRole) && completedDocs.length > 0)
            ? [
              {
                label: 'Signed Documents',
                type: 'signedDocuments',
                data: completedDocs,
              },
            ]
            : []),

        ...(
          showAllTabs ||
            (canViewVkycTab(userRole, vkycSource) && vkycDetails)
            ? [
              {
                label: 'VKYC',
                type: 'vkyc',
                data: vkycDetails,
              },
            ]
            : []
        ),

        ...(showAllTabs || customerReviewData?.dedupe
          ? [
            {
              label: 'D-Dupe',
              type: 'ddupe',
              data: {
                summary: dedupeSummaryRows,
                loans: customerReviewData?.dedupe?.loans || [],
              },
            },
          ]
          : []),


        ...(showAllTabs || canViewCreditTab(LoanCreditData)
          ? [
            {
              label: 'Credit Report',
              type: 'credit',
              data: {
                pdf: LoanCreditData?.crifPdf,
                summary: formatCrifSummary(
                  LoanCreditData?.crifAccountSummery
                ),
              },
            },
          ]
          : []),

        ...(showAllTabs || canViewOtherDocsTab(userRole, LoanOtherDocs)
          ? [
            {
              label: 'Additional Documents',
              type: 'otherDocs',
              data: LoanOtherDocs,
            },
          ]
          : []),


        ...(showAllTabs || canViewAddBankDetailsTab(userRole)
          ? [
            {
              label: 'Bank Details',
              type: 'bankDetails',
              data: LoanDisbursalSummary,
            },
          ]
          : []),

        ...(canViewAgreementTab(userRole, loanData)
          ? [
            {
              label: 'Agreement',
              type: 'agreement',
              data: {
                loanId: loanData?.id,
              },
            },
          ]
          : []),

        ...(canViewEmiTab
          ? [
            {
              label: 'EMI Repayments',
              type: 'emiRepayments',
              data: {
                emiDetails: LoanEmiDetails,
                repaymentSchedule: LoanRepaymentSchedule,
              },
            },
          ]
          : []),

        ...(showAllTabs || canViewBrePolicyTab(userRole)
          ? [
            {
              label: 'BRE Data',
              type: 'bre-policy',
              data: {
                loanId: loanData?.id,
              },
            },
          ]
          : []),


        {
          label: 'Remarks',
          type: 'remarks',
          data: LoanApplicationLogs,
        }



      ],
    };
  }, [
    formJson,
    normalizeDocumentRows,
    employee,
    loanCode,
    LoanVkycData,
    customerReviewData,
    LoanCreditData,
    userRole,
    LoanOtherDocs,
    LoanApprovedData,
    completedDocs,
    LoanCharges,
    LoanDisbursalSummary,
    LoanApplicationLogs,
    showAllTabs,
    LoanEmiDetails,
    LoanRepaymentSchedule,
    canViewEmiTab,
    loanData,
    bsaTxnData,
    bsaProfileTable,
    bsaTransactionData
  ]);

  useEffect(() => {
    const currentTab = viewData?.tabs?.[activeTab];

    if (currentTab?.type === 'agreement') {
      handleGetAgreement();
    }
  }, [activeTab]);

  const handleModalSubmit = useCallback(
    (formData) => {
      if (modalType === 'confirm') {
        enqueueSnackbar('Agreement Sent', { variant: 'success' });
      }

      if (modalType === 'askDocument') {
        handleAskDocumentSubmit(formData);
        return;
      }

      setModalType(null);
      refreshLoanData();
    },
    [modalType, loanId, refreshLoanData]
  );

  const renderVkycValue = (value) => {
    if (!value) return '-';


    if (
      typeof value === 'string' &&
      (value.startsWith('/9j/') || value.startsWith('iVBOR'))
    ) {
      return (
        <img
          src={`data:image/jpeg;base64,${value}`}
          alt="VKYC"
          style={{
            maxWidth: '250px',
            maxHeight: '250px',
            borderRadius: 6,
            border: '1px solid #ddd',
          }}
        />
      );
    }


    if (typeof value === 'string' && value.startsWith('/uploads/')) {
      const fileUrl = `${MEDIA_BASE}${value}`;

      if (isVideoFile(fileUrl)) {
        return (
          <Button
            sx={primaryBtnSx}
            startIcon={<VisibilityOutlinedIcon />}
            onClick={() => openVideoInNewTab(fileUrl)}
          >
            Agent Video
          </Button>
        );
      }

      return (
        <Button
          size="small"
          sx={primaryBtnSx}
          startIcon={<VisibilityOutlinedIcon />}
          onClick={() => window.open(fileUrl, '_blank')}
        >
          View File
        </Button>
      );
    }


    if (typeof value === 'string' && value.startsWith('http')) {
      if (isVideoFile(value)) {
        return (
          <video
            src={value}
            controls
            style={{
              maxWidth: '100%',
              maxHeight: 250,
              borderRadius: 6,
              border: '1px solid #ddd',
            }}
          />
        );
      }

      return (
        <Button
          size="small"
          sx={primaryBtnSx}
          startIcon={<VisibilityOutlinedIcon />}
          onClick={() => window.open(value, '_blank')}
        >
          View File
        </Button>
      );
    }


    if (typeof value === 'object') {
      return (
        <Grid container spacing={2}>
          {Object.entries(value).map(([k, v]) => (
            <Grid item xs={12} sm={6} key={k}>
              <Typography className="theme-label">
                {formatLabel(k)}
              </Typography>
              <Typography className="theme-values">
                {renderVkycValue(v)}
              </Typography>
            </Grid>
          ))}
        </Grid>
      );
    }

    if (typeof value === 'string' || typeof value === 'number') {
      return (
        <Typography className="theme-values">
          {String(value)}
        </Typography>
      );
    }

  };

  const normalizeVkycData = (vkyc = {}) => ({
    header: {
      name: vkyc?.name || '-',
      email: vkyc?.email || '-',
      mobile: vkyc?.mobileNo || '-',
      status: vkyc?.agentVkycStatus || '-',
    },

    sections: [
      {
        title: 'Personal Information',
        data: {
          Name: vkyc?.name,
          Email: vkyc?.email,
          Mobile: vkyc?.mobileNo,
          Duration: `${vkyc?.duration}s`,
          CallStatus: vkyc?.callStatus,
          Date: formatDateVkyc(vkyc?.vkycDate),
        },
      },
      {
        title: 'PAN Details',
        data: vkyc?.panValidation || {},
      },
      {
        title: 'Aadhaar Details',
        data: (() => {
          const { uniqueId, referenceId, ...cleanAadhaar } = vkyc?.okycData || {};
          return cleanAadhaar;
        })(),
      },

      {
        title: 'Verification Location',
        data: vkyc?.locationInfo || {},
      },
      {
        title: 'Face Match (PAN)',
        type: 'metrics',
        data: {
          confidence: Math.round((vkyc?.fmPanSelfie?.same_face_confidence || 0) * 100),
        },
      },
      {
        title: 'Face Match (Aadhaar)',
        type: 'metrics',
        data: {
          confidence: Math.round((vkyc?.fmAadhaarSelfie?.same_face_confidence || 0) * 100),
        },
      },
      {
        title: 'Liveness',
        type: 'metrics',
        data: {
          confidence: Math.round((vkyc?.fmLiveliness?.liveness_confidence || 0) * 100),
        },
      },
      {
        title: 'Documents',
        data: {
          Selfie: vkyc?.userSelfieUrl,
          PAN: vkyc?.userPanUrl,
          VKYC_PDF: vkyc?.vkycPdfUrl,
          Agent_Video: vkyc?.agentVideoUrl,
        },
      },
      {
        title: 'References',
        data: {
          'Unique ID': vkyc?.uniqueId,
          'Reference ID': vkyc?.referenceId,
        },
      }

    ],
  });


  const renderSafeValue = (value) => {
    if (value === null || value === undefined) return '-';


    if (typeof value === 'string' || typeof value === 'number') {
      return formatDateVkyc(value);
    }


    if (Array.isArray(value)) {
      return value.length;
    }


    if (typeof value === 'object') {
      return Object.keys(value).length;
    }

    return '-';
  };


  const formatActionLabel = (action = '') =>
    action
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());





  const renderTabContent = () => {
    const activeTabData = viewData.tabs[activeTab];

    if (activeTabData.type === 'keyValue') {
      const sectionKey = viewData.tabs[activeTab]?.label?.toLowerCase().replace(/ /g, '_');
      const isDocumentSection = sectionKey === 'document_uploads';
      const isConsentSection = sectionKey === 'declarations_and_consent';

      return (
        <Grid container spacing={3} mt={1}>
          {Object.entries(activeTabData.data).map(([k, v]) => {
            const isDocPath = isDocumentSection && typeof v === 'string' && v.startsWith('/uploads/');
            const isBoolean = typeof v === 'boolean';
            
            return (
              <Grid item xs={12} md={4} key={k}>
                <Typography className="theme-label">
                  {k}
                </Typography>
                {isDocPath ? (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<VisibilityOutlinedIcon />}
                    onClick={() => window.open(`${MEDIA_BASE}${v}`, '_blank')}
                  >
                    View
                  </Button>
                ) : isBoolean || isConsentSection ? (
                  <Box display="flex" alignItems="center" gap={1}>
                    {v ? (
                      <CheckBoxIcon sx={{ color: '#4CAF50', fontSize: 28 }} />
                    ) : (
                      <CheckBoxOutlineBlankIcon sx={{ color: '#9E9E9E', fontSize: 28 }} />
                    )}
                    <Typography className="theme-values">
                      {v ? 'Yes' : 'No'}
                    </Typography>
                  </Box>
                ) : (
                  <Typography className="theme-values">
                    {formatDateTime(v)}
                  </Typography>
                )}
              </Grid>
            );
          })}
        </Grid>
      );
    }

    if (activeTabData.type === 'documents') {
      return (
        <ReusableTable
          title=""
          columns={[
            { key: 'name', label: 'Document Name' },
            {
              key: 'actions',
              label: 'Actions',
              align: 'right',
              render: (_, row) => (
                <>
                  <IconButton
                    size="small"
                    sx={{
                      '& svg': {
                        color: 'var(--theme-btn-bg)',
                      },
                    }}
                    onClick={() =>
                      window.open(getDocumentUrl(row.filePath), '_blank')
                    }
                  >
                    <VisibilityOutlinedIcon color="primary" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{
                      '& svg': {
                        color: 'var(--theme-btn-bg)',
                      },
                    }}
                    onClick={async () => {
                      try {
                        const response = await fetch(getDocumentUrl(row.filePath));
                        const blob = await response.blob();

                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = row.name || 'document';
                        document.body.appendChild(link);
                        link.click();

                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(url);
                      } catch (err) {
                        console.error('Download failed', err);
                      }
                    }}
                  >
                    <DownloadOutlinedIcon color="success" />
                  </IconButton>


                </>
              ),
            },
          ]}
          data={activeTabData.data}
        />
      );
    }



    // if (activeTabData.type === 'credit') {
    //   return (
    //     <Box mt={2}>
    //       <Button
    //         variant="contained"
    //         startIcon={<VisibilityOutlinedIcon />}
    //         onClick={() => setOpenCrifPdf(true)}
    //         sx={{ mb: 2 }}
    //       >
    //         View Credit Report (PDF)
    //       </Button>

    //       {activeTabData.data.summary.map((section) => (
    //         <Box key={section.title} mb={3}>
    //           <Typography fontWeight={600} mb={1}>
    //             {section.title}
    //           </Typography>

    //           <Grid container spacing={2}>
    //             {section.data.map((item, i) => (
    //               <Grid item xs={12} md={4} key={i}>
    //                 <Typography fontSize={12} color="text.secondary">
    //                   {item.label}
    //                 </Typography>
    //                 <Typography fontWeight={600}>
    //                   {item.value}
    //                 </Typography>
    //               </Grid>
    //             ))}
    //           </Grid>
    //         </Box>
    //       ))}
    //     </Box>
    //   );
    // }
    if (activeTabData.type === 'credit') {
      const credit = activeTabData.data;
      // console.log(credit.pdf);


      return (
        <Box mt={2}>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button
              sx={primaryBtnSx}
              startIcon={<VisibilityOutlinedIcon />}
              onClick={() =>
                window.open(
                  `${process.env.REACT_APP_BACKEND_MEDIA}${credit?.pdf}`,
                  '_blank',
                  'noopener,noreferrer'
                )
              }
            >
              View Credit Report
            </Button>
          </Box>

          {activeTabData.data.summary?.length > 0 &&
            activeTabData.data.summary.map((section) => (
              <Box key={section.title} mb={3}>
                <Typography fontWeight={600} mb={1}>
                  {section.title}
                </Typography>

                <Grid container spacing={2}>
                  {section?.data?.map((item, i) => (
                    <Grid item xs={12} md={4} key={i}>
                      <Typography className="theme-label">
                        {item.label}
                      </Typography>
                      <Typography className="theme-values">
                        {item.value}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
        </Box>
      );
    }

    if (activeTabData.type === 'vkyc') {
      const vkyc = normalizeVkycData(activeTabData.data);

      return (
        <Box mt={2} >
          {/* HEADER */}
          <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Box
                  sx={{
                    width: 75,
                    height: 75,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '1px solid #ddd',
                  }}
                >
                  {vkyc?.sections && activeTabData?.data?.userSelfieUrl ? (

                    <img
                      src={`data:image/jpeg;base64,${activeTabData?.data?.okycData?.image}`}
                      alt="User Selfie"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'grey.100',
                      }}
                    >
                      👤
                    </Box>
                  )}
                </Box>

              </Grid>

              <Grid item xs>
                <Typography className="theme-values">{vkyc.header.name || '-'}</Typography>
                <Typography className="theme-label">
                  {vkyc.header.email}
                </Typography>
                <Typography className="theme-label">{vkyc.header.mobile}</Typography>
              </Grid>

              <Grid item>
                <Button
                  size="small"
                  // color="success"
                  sx={primaryBtnSx}
                >
                  {vkyc.header.status || 'Verified'}
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* SECTIONS */}
          <Grid container spacing={3}>
            {vkyc.sections.map((section) => (
              <Grid item xs={12} key={section.title}>
                <Paper sx={{ p: 2, borderRadius: 2, height: 'auto' }}>
                  <CardHeader sx={{ pl: 1, mt: 2, mb: 2 }} title={section.title} />
                  {/* <Typography fontWeight={600} mb={1}>
                    {section.title}
                  </Typography> */}

                  {section?.type === 'metrics' ? (
                    <Grid container spacing={2}>
                      {Object?.entries(section?.data || {}).map(([k, v]) => (
                        <Grid item xs={4} key={k}>
                          <Typography className="theme-label">
                            {formatLabel(k)}
                          </Typography>
                          <Typography className="theme-values">
                            {v}%
                          </Typography>

                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Grid container spacing={2}>
                      {Object.entries(section.data || {}).map(([k, v]) => (
                        <Grid item xs={12} sm={6} key={k}>
                          <Typography className="theme-label">
                            {formatLabel(k)}
                          </Typography>

                          {/* IMAGE / PDF / TEXT */}
                          {renderVkycValue(v)}
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    }

    if (activeTabData.type === 'ddupe') {
      return (
        <Box mt={2}>
          <Paper sx={{ p: 2, borderRadius: 2, mb: 3 }}>
            <ReusableTable
              title="Loan History Summary"
              columns={[
                { key: 'field', label: 'Field' },
                { key: 'value', label: 'Value' },
              ]}
              data={activeTabData?.data?.summary || []}
              showSearch={false}
              showFilter={false}
            />
          </Paper>

          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <ReusableTable
              title="Loan History"
              columns={[
                { key: 'loanCode', label: 'Loan Code' },
                { key: 'loanStatus', label: 'Loan Status' },
                { key: 'internalStatus', label: 'Internal Status' },
                { key: 'customerStatus', label: 'Customer Status' },
                { key: 'vkycStatus', label: 'VKYC Status' },
                { key: 'crifScore', label: 'CRIF Score' },
                {
                  key: 'createdAt',
                  label: 'Created At',
                  render: (value) => formatDateTime(value),
                },
                {
                  key: 'updatedAt',
                  label: 'Updated At',
                  render: (value) => formatDateTime(value),
                },
              ]}
              data={activeTabData?.data?.loans || []}
              showSearch={false}
              showFilter={false}
            />
          </Paper>
        </Box>
      );
    }


    if (activeTabData.type === 'aa') {
      const selectedBankData = LoanFinancialData?.find(bank => bank.id === selectedBank);
      const account = selectedBankData?.statementJson?.Account;
      const summary = account?.Summary;
      const holder = account?.Profile?.Holders?.Holder;
      const transactions = account?.Transactions?.Transaction || [];

      return (
        <Box mt={2}>
          <Box display="flex" gap={2} mb={2}>
            {LoanCreditData?.lastSixMonthStatementPdf && (
              <Button
                sx={primaryBtnSx}
                onClick={() =>
                  window.open(
                    `${process.env.REACT_APP_BACKEND_MEDIA}${LoanCreditData.lastSixMonthStatementPdf}`,
                    '_blank'
                  )
                }
              >
                View 6 Month Statement
              </Button>
            )}

            {LoanCreditData?.lastOneYearStatementPdf && (
              <Button
                sx={primaryBtnSx}
                onClick={() =>
                  window.open(
                    `${process.env.REACT_APP_BACKEND_MEDIA}${LoanCreditData.lastOneYearStatementPdf}`,
                    '_blank'
                  )
                }
              >
                View 1 Year Statement
              </Button>
            )}
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" gap={2} alignItems="center">
              <Button variant="contained" sx={primaryBtnSx} onClick={handleSendAARedirection} disabled={isSendRedirectionDisabled}>
                {camsStatus || 'Send Redirection Link'}
              </Button>
              <Typography variant="body2" color="text.secondary">
                {LoanFinancialData?.length || 0} {LoanFinancialData?.length === 1 ? 'Account' : 'Accounts'} Linked
              </Typography>
            </Box>
            {userRole !== 'Finance' && (
              <Button variant="outlined" sx={primaryBtnSx} onClick={handleFetchPeriodicData}>Fetch Periodic Data</Button>
            )}
          </Box>

          {LoanFinancialData?.length > 0 && (
            <Grid container spacing={2} mb={3}>
              {LoanFinancialData.map((bank) => {
                const isSelected = selectedBank === bank.id;
                return (
                  <Grid item xs={12} sm={6} md={3} key={bank.id}>
                    <Card sx={{ cursor: 'pointer', background: isSelected ? '#003366' : 'white', color: isSelected ? 'white' : '#333', borderRadius: 3, minHeight: 140, border: isSelected ? '3px solid #003366' : '1px solid #e0e0e0', boxShadow: isSelected ? '0 8px 16px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' } }} onClick={() => setSelectedBank(bank.id)}>
                      <CardContent sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="caption" sx={{ opacity: 0.9, textTransform: 'uppercase', letterSpacing: 1 }}>{bank.statementJson?.Account?.Summary?.type || 'Account'}</Typography>
                          <Typography variant="h6" fontWeight={700} mt={0.5}>{bank.fipName}</Typography>
                          <Typography variant="body2" sx={{ opacity: 0.85, mt: 1, letterSpacing: 1 }}>{bank.statementJson?.Account?.maskedAccNumber || 'XXXXXXXXXXXX'}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ opacity: 0.8 }}>Balance</Typography>
                          <Typography variant="h6" fontWeight={600}>₹{bank.statementJson?.Account?.Summary?.currentBalance || '0'}</Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}

          {selectedBankData && (
            <>
              <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={6} md={3}><Card sx={{ background: 'white', border: '1px solid #e0e0e0', borderRadius: 2 }}><CardContent><Typography variant="body2" color="text.secondary" mb={1}>Current Balance</Typography><Typography variant="h5" fontWeight={700} color="text.primary">₹{summary?.currentBalance || '0'}</Typography></CardContent></Card></Grid>
                <Grid item xs={12} sm={6} md={3}><Card sx={{ background: 'white', border: '1px solid #e0e0e0', borderRadius: 2 }}><CardContent><Box display="flex" alignItems="center" gap={1} mb={1}><Typography variant="body2" color="text.secondary">Avg Monthly Balance</Typography><Typography>📊</Typography></Box><Typography variant="h5" fontWeight={700} color="text.primary">₹{summary?.currentBalance || '0'}</Typography></CardContent></Card></Grid>
                <Grid item xs={12} sm={6} md={3}><Card sx={{ background: 'white', border: '1px solid #e0e0e0', borderRadius: 2 }}><CardContent><Box display="flex" alignItems="center" gap={1} mb={1}><Typography variant="body2" color="text.secondary">Total Credit</Typography><Typography>⬆</Typography></Box><Typography variant="h5" fontWeight={700} color="text.primary">₹{transactions.filter(t => t.type === 'CREDIT').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0).toFixed(2)}</Typography></CardContent></Card></Grid>
                <Grid item xs={12} sm={6} md={3}><Card sx={{ background: 'white', border: '1px solid #e0e0e0', borderRadius: 2 }}><CardContent><Box display="flex" alignItems="center" gap={1} mb={1}><Typography variant="body2" color="text.secondary">Total Debit</Typography><Typography>⬇</Typography></Box><Typography variant="h5" fontWeight={700} color="text.primary">₹{transactions.filter(t => t.type === 'DEBIT').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0).toFixed(2)}</Typography></CardContent></Card></Grid>
              </Grid>

              <Card sx={{ mb: 3 }}><CardHeader title={`Account Summary - ${selectedBankData.fipName}`} /><CardContent><Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}><Typography className="theme-label">Statement Period</Typography><Typography className="theme-values">{renderSafeValue(account?.Transactions?.startDate)} to {renderSafeValue(account?.Transactions?.endDate)}</Typography></Grid>
                <Grid item xs={12} sm={6} md={4}><Typography className="theme-label">FI Type</Typography><Typography className="theme-values">{account?.type || '-'}</Typography></Grid>
                <Grid item xs={12} sm={6} md={4}><Typography className="theme-label">Account Type</Typography><Typography className="theme-values">{summary?.type || '-'}</Typography></Grid>
                <Grid item xs={12} sm={6} md={4}><Typography className="theme-label">Status</Typography><Typography className="theme-values">{summary?.status || '-'}</Typography></Grid>
                <Grid item xs={12} sm={6} md={4}><Typography className="theme-label">Current Balance</Typography><Typography className="theme-values">₹{summary?.currentBalance || '0'}</Typography></Grid>
                <Grid item xs={12} sm={6} md={4}><Typography className="theme-label">Branch</Typography><Typography className="theme-values">{summary?.branch || '-'}</Typography></Grid>
                <Grid item xs={12} sm={6} md={4}><Typography className="theme-label">IFSC Code</Typography><Typography className="theme-values">{summary?.ifscCode || '-'}</Typography></Grid>
                <Grid item xs={12} sm={6} md={4}><Typography className="theme-label">Opening Date</Typography><Typography className="theme-values">{renderSafeValue(summary?.openingDate)}</Typography></Grid>
              </Grid></CardContent></Card>

              <Card sx={{ mb: 3 }}><CardHeader title="Account Holder Details" /><CardContent><Grid container spacing={2}>
                {Object.entries(holder || {}).map(([k, v]) => (<Grid item xs={12} md={4} key={k}><Typography className="theme-label">{formatLabel(k)}</Typography><Typography className="theme-values">{renderSafeValue(v)}</Typography></Grid>))}
              </Grid></CardContent></Card>
            </>
          )}

          {selectedBankData && transactions?.length > 0 && (
            <Paper sx={{ p: 2, borderRadius: 2 }}><ReusableTable title="Statement Transactions" columns={[{ key: 'txnId', label: 'Txn ID' }, { key: 'transactionTimestamp', label: 'Transaction Date', render: (v) => renderSafeValue(v) }, { key: 'mode', label: 'Mode' }, { key: 'narration', label: 'Narration' }, { key: 'type', label: 'Type' }, { key: 'amount', label: 'Amount' }, { key: 'currentBalance', label: 'Current Balance' }, { key: 'reference', label: 'Reference' }]} data={transactions} loading={false} showSearch={false} showFilter={false} /></Paper>
          )}
        </Box>
      );
    }

    if (activeTabData.type === 'bsaTxnOnly') {
      const { profile, transactions } = activeTabData.data;
      const overallInflowRows = flattenOverallTransactions(overall, 'inflow');
      const overallExpenseRows = flattenOverallTransactions(overall, 'expense');

      const filteredBsaTransactions =
        bsaCategory === 'ALL'
          ? flattenedTransactions
          : flattenedTransactions.filter(
            (row) => row.category === bsaCategory
          );
      const filteredOverallInflow =
        overallInflowCategory === 'ALL'
          ? overallInflowRows
          : overallInflowRows.filter(
            (row) => row.category === overallInflowCategory
          );
      const filteredOverallExpense =
        overallExpenseCategory === 'ALL'
          ? overallExpenseRows
          : overallExpenseRows.filter(
            (row) => row.category === overallExpenseCategory
          );

      const handleDownloadExcel = (e) => {
        e.stopPropagation();

        const url = `${process.env.REACT_APP_BACKEND_MEDIA}${bsaTxnData?.lastOneYearBsaReport}`;
        const link = document.createElement('a');
        link.href = url;
        link.download = 'BSA_Report.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      const handleDownloadSixMonthExcel = (e) => {
        e.stopPropagation();

        const url = `${process.env.REACT_APP_BACKEND_MEDIA}${bsaTxnData?.lastSixMonthBsaReport}`;
        const link = document.createElement('a');
        link.href = url;
        link.download = 'BSA_Last_6_Month_Report.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };


      return (
        <>
          <Box sx={{ mt: 3 }}>
            {bsaTxnData?.lastOneYearBsaReport && (
              <Button
                size="small"
                sx={primaryBtnSx}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowExcel(true);
                }}
              >
                View Last 1 Year Bsa Report
              </Button>

            )}

            {bsaTxnData?.lastSixMonthBsaReport && (
              <Button
                size="small"
                sx={primaryBtnSx}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSixMonthExcel(true);
                }}
              >
                View Last 6 Months Bsa Report
              </Button>
            )}
          </Box>
          {showExcel && (
            <Accordion sx={{ mt: 3 }} defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  '& .MuiAccordionSummary-content': {
                    margin: 0,
                    width: '100%',
                  },
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                >
                  <Typography fontWeight={600}>
                    BSA Data (Excel View)
                  </Typography>

                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadExcel(e);
                    }}
                  >
                    Download Excel
                  </Button>
                </Box>
              </AccordionSummary>


              <AccordionDetails>
                <Card>
                  <CardHeader title="BSA Data (Excel View)" />
                  <CardContent sx={{ p: 0 }}>
                    <iframe
                      title="BSA Excel Viewer"
                      src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                        `${process.env.REACT_APP_BACKEND_MEDIA}${bsaTxnData.lastOneYearBsaReport}`
                      )}`}
                      width="100%"
                      height="700"
                      frameBorder="0"
                      style={{ border: 'none' }}
                    />
                  </CardContent>
                </Card>
              </AccordionDetails>
            </Accordion>
          )}

          {showSixMonthExcel && (
            <Accordion sx={{ mt: 3 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ bgcolor: '#f9fafb' }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                >
                  <Typography fontWeight={600}>
                    BSA Excel Report (Last 6 Months)
                  </Typography>

                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleDownloadSixMonthExcel}
                  >
                    Download
                  </Button>
                </Box>
              </AccordionSummary>

              <AccordionDetails>
                <Card>
                  <CardHeader title="BSA Data (Excel View)" />
                  <CardContent sx={{ p: 0 }}>
                    <iframe
                      title="BSA Excel Viewer"
                      src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                        `${process.env.REACT_APP_BACKEND_MEDIA}${bsaTxnData?.lastSixMonthBsaReport}`
                      )}`}
                      width="100%"
                      height="700"
                      frameBorder="0"
                      style={{ border: 'none' }}
                    />
                  </CardContent>
                </Card>
              </AccordionDetails>
            </Accordion>
          )}




          {/* CUSTOMER PROFILE */}
          <Card sx={{ mb: 3, mt: 3 }}>
            <CardHeader title="Customer Profile" />
            <CardContent>
              <Grid container spacing={2}>
                {profile.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.field}>
                    <Typography className="theme-label">
                      {formatLabel(item.field)}
                    </Typography>
                    <Typography className="theme-values">
                      {item.field === 'dob'
                        ? formatDateTime(item.value)
                        : item.value ?? '-'}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>


          {/* <FormControl sx={{ minWidth: 220, mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categoryOptions.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}

          {overall && (
            <Box mb={4}>
              {/* Overall Summary */}
              <Card sx={{ mb: 3 }}>
                <CardHeader title="Overall Summary" />
                <CardContent>
                  {/* <Typography variant="h6">Overall Summary</Typography> */}
                  <Grid container spacing={2} mt={1}>
                    <Grid item xs={6}>
                      <Typography className="theme-label">Total Inflow</Typography>
                      <Typography className="theme-values">
                        ₹{overall.totalInflow}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography className="theme-label">Total Expense</Typography>
                      <Typography className="theme-values">
                        ₹{overall.totalExpense}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          )}


          {/* BSA Transactions Accordion */}
          <Accordion sx={{ mt: 3 }}>
            <AccordionSummary sx={{
              background: 'var(--theme-btn-bg)',
              color: '#fff',
              borderRadius: '4px',
              // minHeight: 48,
              fontSize: '10px',

              '& .MuiAccordionSummary-content': {
                margin: 0,
                fontWeight: 600,
              },

              '& .MuiAccordionSummary-expandIconWrapper': {
                color: '#fff',
              },

              '&:hover': {
                filter: 'brightness(0.92)',
              },

              '&.Mui-expanded': {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              },
            }} expandIcon={<ExpandMoreIcon />}>

              <CardHeader sx={{ pl: 0 }} title="BSA Transactions" />
              {/* <Typography fontWeight={600}>
                BSA Transactions
              </Typography> */}
            </AccordionSummary>

            <AccordionDetails>
              <FormControl sx={{ minWidth: 220, mb: 2, mt: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={bsaCategory}
                  label="Category"
                  onChange={(e) => setBsaCategory(e.target.value)}
                >
                  {allCategoryOptions.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <ReusableTable
                columns={BSA_TXN_COLUMNS}
                data={filteredBsaTransactions}
                showSearch={false}
              />
            </AccordionDetails>
          </Accordion>


          {overall && (
            <Box mb={4}>
              {/* Overall Inflow Accordion */}
              <Accordion sx={{ mt: 2 }}>
                <AccordionSummary sx={{
                  background: 'var(--theme-btn-bg)',
                  color: '#fff',
                  borderRadius: '4px',
                  // minHeight: 48,
                  fontSize: '10px',

                  '& .MuiAccordionSummary-content': {
                    margin: 0,
                    fontWeight: 600,
                  },

                  '& .MuiAccordionSummary-expandIconWrapper': {
                    color: '#fff',
                  },

                  '&:hover': {
                    filter: 'brightness(0.92)',
                  },

                  '&.Mui-expanded': {
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  },
                }} expandIcon={<ExpandMoreIcon />}>
                  <CardHeader sx={{ pl: 0 }} title="Overall Inflow Transactions" />
                  {/* <Typography fontWeight={600}>
                    Overall Inflow Transactions
                  </Typography> */}
                </AccordionSummary>
                <AccordionDetails>
                  <FormControl sx={{ minWidth: 220, mb: 2, mt: 2 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={overallInflowCategory}
                      label="Category"
                      onChange={(e) => setOverallInflowCategory(e.target.value)}
                    >
                      {allCategoryOptions.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <ReusableTable
                    columns={OVERALL_COLUMNS}
                    data={filteredOverallInflow}
                    showSearch={false}
                  />
                </AccordionDetails>
              </Accordion>

              {/* Overall Expense Accordion */}
              <Accordion sx={{ mt: 2 }}>
                <AccordionSummary sx={{
                  background: 'var(--theme-btn-bg)',
                  color: '#fff',
                  borderRadius: '4px',
                  // minHeight: 48,
                  fontSize: '10px',

                  '& .MuiAccordionSummary-content': {
                    margin: 0,
                    fontWeight: 600,
                  },

                  '& .MuiAccordionSummary-expandIconWrapper': {
                    color: '#fff',
                  },

                  '&:hover': {
                    filter: 'brightness(0.92)',
                  },

                  '&.Mui-expanded': {
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  },
                }} expandIcon={<ExpandMoreIcon />}>
                  <CardHeader sx={{ pl: 0 }} title=" Overall Expense Transactions" />
                  {/* <Typography fontWeight={600}>
                    Overall Expense Transactions
                  </Typography> */}
                </AccordionSummary>
                <AccordionDetails>
                  <FormControl sx={{ minWidth: 220, mb: 2, mt: 2 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={overallExpenseCategory}
                      label="Category"
                      onChange={(e) => setOverallExpenseCategory(e.target.value)}
                    >
                      {allCategoryOptions.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <ReusableTable
                    columns={OVERALL_COLUMNS}
                    data={filteredOverallExpense}
                    showSearch={false}
                  />
                </AccordionDetails>
              </Accordion>
            </Box>
          )}

        </>
      );
    }

    if (activeTabData.type === 'otherDocs') {
      return (
        <ReusableTable
          title=""
          columns={[
            { key: 'docName', label: 'Document Name' },
            { key: 'status', label: 'Status' },
            {
              key: 'actions',
              label: 'Actions',
              align: 'right',
              render: (_, row) => (
                <IconButton
                  size="small"
                  sx={{
                    '& svg': {
                      color: 'var(--theme-btn-bg)',
                    },
                  }}
                  onClick={() =>
                    window.open(`${MEDIA_BASE}${row.docUrl}`, '_blank')
                  }
                >
                  <VisibilityOutlinedIcon color="primary" />
                </IconButton>
              ),
            },
          ]}
          data={activeTabData.data}
        />
      );
    }

    if (activeTabData.type === 'loanApproved') {
      const { approved, charges, disbursal } = activeTabData.data || {};

      const renderSection = (title, data) => (
        <>
          <CardHeader sx={{ pl: 1, mb: 2, mt: 2 }} title={title} />
          {/* <Typography fontWeight={600} mt={3} mb={1}>
            {title}
          </Typography> */}

          <Grid container spacing={2}>
            {Object.entries(data || {})
              .filter(([key]) => ![
                'id',
                'applicationId',
                'isDeleted',
                'createdAt',
                'updatedAt',
              ].includes(key))
              .map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Typography className="theme-label">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </Typography>

                  <Typography className="theme-values">
                    {key.endsWith('At')
                      ? value
                        ? new Date(value).toLocaleString()
                        : '-'
                      : value ?? '-'}
                  </Typography>
                </Grid>
              ))}
          </Grid>
        </>
      );

      return (
        <Box mt={2}>
          {approved && renderSection('Approved Loan Details', approved)}
          {charges && renderSection('Loan Charges', charges)}
          {disbursal && renderSection('Disbursal Summary', disbursal)}
        </Box>
      );
    }


    if (activeTabData.type === 'signedDocuments') {
      return (
        <Box mt={2}>
          {activeTabData.data.map((doc, index) => (
            <Button
              key={doc.id}
              variant="outlined"
              startIcon={<VisibilityOutlinedIcon />}
              sx={{
                '& svg': {
                  color: 'var(--theme-btn-bg)',
                },
                color: 'var(--theme-btn-bg)',
              }}
              onClick={() =>
                window.open(
                  `${MEDIA_BASE}${doc.signedFile}`,
                  '_blank',
                  'noopener,noreferrer'
                )
              }
            >
              View Signed Document {activeTabData.data.length > 1 ? index + 1 : ''}
            </Button>
          ))}
        </Box>
      );
    }

    if (activeTabData.type === 'agreement') {

      const hasSignedFile = agreements?.some(a => !!a.signedFile);
      const hasAgreementFile = agreements?.some(a => !!a.pdfPath);
      const hasCustomerRemarks = agreements?.some(
        a => a?.customerRemarks && a.customerRemarks.trim() !== ''
      );

      const AGREEMENT_COLUMNS = [
        { key: 'agreementVersion', label: 'Version' },

        { key: 'status', label: 'Status' },

        {
          key: 'isActive',
          label: 'Active',
          render: (v) => (v ? 'Yes' : 'No'),
        },

        ...(hasAgreementFile
          ? [
            {
              key: 'view',
              label: 'View Agreement',
              align: 'center',
              render: (_, row) => (
                <IconButton
                  size="small"
                  sx={{
                    color: '#084E77',
                    '&.Mui-disabled': {
                      color: '#084E77',
                      opacity: 0.4,
                    },
                  }}
                  onClick={() =>
                    window.open(
                      `${process.env.REACT_APP_BACKEND_MEDIA}${row.pdfPath}`,
                      '_blank'
                    )
                  }
                >
                  <VisibilityOutlinedIcon />
                </IconButton>
              ),
            },
          ]
          : []
        ),
        ...(hasSignedFile
          ? [
            {
              key: 'signedFile',
              label: 'Signed File',
              align: 'center',
              render: (_, row) =>
                row.signedFile ? (
                  <IconButton
                    size="small"
                    sx={{
                      color: '#084E77',
                      '&.Mui-disabled': {
                        color: '#084E77',
                        opacity: 0.4,
                      },
                    }}
                    onClick={() =>
                      window.open(
                        `${process.env.REACT_APP_BACKEND_MEDIA}${row.signedFile}`,
                        '_blank'
                      )
                    }
                  >
                    <VisibilityOutlinedIcon />
                  </IconButton>
                ) : '-',
            },
          ]
          : []
        ),

        {
          key: 'delete',
          label: 'Delete Agreement',
          align: 'center',
          render: (_, row) => (
            <IconButton
              size="small"
              sx={{
                color: (theme) => theme.palette.error.main,
                '&.Mui-disabled': {
                  color: (theme) => theme.palette.error.main,
                  opacity: 0.4,
                },
              }}
              disabled={
                row.status === 'ESIGN_COMPLETED' ||
                (row.status !== 'DRAFT' && row.status !== 'CANCELLED_BY_SENIOR')
              }
              onClick={() => handleDeleteAgreement(row.id)}
            >
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          ),
        },


        {
          key: 'sendToCustomer',
          label: 'Send to Customer',
          align: 'center',
          render: (_, row) => (
            <IconButton
              size="small"
              sx={{
                color: '#084E77',
                '&.Mui-disabled': {
                  color: '#084E77',
                  opacity: 0.4,
                },
              }}
              disabled={row.status !== 'DRAFT' || row.status === 'ESIGN_COMPLETED'}
              onClick={() => handleSendAgreementToCustomer(row.id)}
            >
              <SendOutlinedIcon />
            </IconButton>
          ),
        },

        /* ================= SEND ESIGN ================= */
        {
          key: 'sendEsign',
          label: 'Send eSign',
          align: 'center',
          render: (_, row) => (
            <IconButton
              size="small"
              sx={{
                color: '#084E77',
                '&.Mui-disabled': {
                  color: '#084E77',
                  opacity: 0.4,
                },
              }}
              disabled={
                row.status !== 'CUSTOMER_APPROVED' ||
                row.status === 'ESIGN_COMPLETED'
              }
              onClick={() => handleSendEsign(row.id)}
            >
              <TaskAltOutlinedIcon />
            </IconButton>
          ),
        },

        ...(hasCustomerRemarks
          ? [
            {
              key: 'customerRemarks',
              label: 'Customer Remarks',
              render: (v) => v || '-',
            },
          ]
          : []
        ),
      ];



      return (
        <Box mt={2}>
          {/* <Button
            sx={primaryBtnSx}
            onClick={handleGetAgreement}
            disabled={agreementLoading || agreementChecked}
          >
            {agreementLoading ? <CircularProgress size={20} /> : 'Fetch Agreement'}
          </Button> */}

          <Box mt={3}>
            <ReusableTable
              title="Agreements"
              columns={AGREEMENT_COLUMNS}
              data={agreements}
              loading={agreementLoading}
              showSearch={false}
            />
          </Box>
        </Box>
      );
    }



    if (activeTabData.type === 'bankDetails') {
      return (
        <Box mt={2}>
          {userRole !== 'Disbursal' && (
            <Box display="flex" gap={1.5} flexWrap="wrap">
              <Button
                variant="contained"
                startIcon={<AccountBalanceWalletOutlinedIcon />}
                onClick={() => setOpenDisbursement(true)}
                // disabled={hasBankDetails}
                sx={primaryBtnSx}
              >
                Add Bank Details
              </Button>
              <Button
                variant="contained"
                onClick={handleVerifyBankAccount}
                disabled={!hasBankDetails || verifyAccountLoading || isBankVerified}
                sx={primaryBtnSx}
              >
                {verifyAccountLoading ? <CircularProgress size={20} color="inherit" /> : (isBankVerified ? 'Verified' : 'Verify Account')}
              </Button>
            </Box>
          )}

          {bankVerificationResult && (
            <Alert
              severity={bankVerificationResult.success ? 'success' : 'error'}
              sx={{ mt: 2 }}
            >
              {bankVerificationResult.success
                ? `Verification completed: ${bankVerificationResult.message}`
                : `Verification failed: ${bankVerificationResult.message}`}
            </Alert>
          )}

          {LoanBankDetails && (
            <Grid container spacing={2} mt={3}>
              {[['accountVerification', bankVerificationLabel], ...Object.entries(LoanBankDetails)]
                .filter(([key]) =>
                  !['id', 'applicationId', 'createdAt', 'updatedAt', 'isVerified', 'isAccountVerified', 'verified', 'txnSuccess', 'isAccountValid', 'isNameMatched'].includes(key)
                )
                .map(([key, value]) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <Typography className="theme-label">
                      {key === 'accountVerification' ? 'Account Verification' : key.replace(/([A-Z])/g, ' $1')}
                    </Typography>
                    <Typography className="theme-values">
                      {value || '-'}
                    </Typography>
                  </Grid>
                ))}
              
              <Grid item xs={12} sm={6}>
                <Typography className="theme-label">Transaction Success</Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  {LoanBankDetails.txnSuccess ? (
                    <CheckBoxIcon sx={{ color: '#4CAF50', fontSize: 28 }} />
                  ) : (
                    <CheckBoxOutlineBlankIcon sx={{ color: '#9E9E9E', fontSize: 28 }} />
                  )}
                  <Typography className="theme-values">
                    {LoanBankDetails.txnSuccess ? 'Yes' : 'No'}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography className="theme-label">Account Valid</Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  {LoanBankDetails.isAccountValid ? (
                    <CheckBoxIcon sx={{ color: '#4CAF50', fontSize: 28 }} />
                  ) : (
                    <CheckBoxOutlineBlankIcon sx={{ color: '#9E9E9E', fontSize: 28 }} />
                  )}
                  <Typography className="theme-values">
                    {LoanBankDetails.isAccountValid ? 'Yes' : 'No'}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography className="theme-label">Name Matched</Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  {LoanBankDetails.isNameMatched ? (
                    <CheckBoxIcon sx={{ color: '#4CAF50', fontSize: 28 }} />
                  ) : (
                    <CheckBoxOutlineBlankIcon sx={{ color: '#9E9E9E', fontSize: 28 }} />
                  )}
                  <Typography className="theme-values">
                    {LoanBankDetails.isNameMatched ? 'Yes' : 'No'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}


          {openDisbursement && (
            <DisbursementModal
              open={openDisbursement}
              loanId={loanId}
              onClose={() => setOpenDisbursement(false)}
              onDisburseSuccess={() => {
                setOpenDisbursement(false);
                dispatch(fetchLoanDetailsById(loanId));
              }}
            />
          )}
        </Box>
      );
    }

    if (activeTabData.type === 'emiRepayments') {
      const { emiDetails, repaymentSchedule } = activeTabData.data || {};

      return (
        <Box mt={2}>
          <Accordion  >
            <AccordionSummary sx={{
              background: 'var(--theme-btn-bg)',
              color: '#fff',
              borderRadius: '4px',
              // minHeight: 48,
              fontSize: '10px',

              '& .MuiAccordionSummary-content': {
                margin: 0,
                fontWeight: 600,
              },

              '& .MuiAccordionSummary-expandIconWrapper': {
                color: '#fff',
              },

              '&:hover': {
                filter: 'brightness(0.92)',
              },

              '&.Mui-expanded': {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              },
            }} expandIcon={<ExpandMoreIcon />}>
              <CardHeader sx={{ pl: 0 }} title="Loan EMI Details" />

            </AccordionSummary>
            <AccordionDetails>
              <ReusableTable
                title=""
                columns={EMI_DETAILS_COLUMNS}
                data={emiDetails ? [emiDetails] : []}
                showSearch={false}
                showFilter={false}
              />
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary sx={{
              background: 'var(--theme-btn-bg)',
              color: '#fff',
              borderRadius: '4px',
              // minHeight: 48,
              fontSize: '10px',

              '& .MuiAccordionSummary-content': {
                margin: 0,
                fontWeight: 600,
              },

              '& .MuiAccordionSummary-expandIconWrapper': {
                color: '#fff',
              },

              '&:hover': {
                filter: 'brightness(0.92)',
              },

              '&.Mui-expanded': {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              },
            }} expandIcon={<ExpandMoreIcon />}>
              <CardHeader sx={{ pl: 0 }} title=" Loan Repayment Schedule" />

            </AccordionSummary>
            <AccordionDetails>
              <ReusableTable
                title=""
                columns={EMI_SCHEDULE_COLUMNS}
                data={repaymentSchedule || []}
                showSearch={false}
                showFilter={false}
              />
            </AccordionDetails>
          </Accordion>
        </Box>
      );
    }


    if (activeTabData.type === 'remarks') {
      const logs = [...activeTabData.data].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      return (
        <Box mt={3}>
          <Stepper orientation="vertical">
            {logs.map((log, index) => {
              const isRejectedStep = log.action === 'REJECTED';

              return (
                <Step key={log.id} active completed={!isRejectedStep}>
                  <StepLabel
                    error={isRejectedStep}
                    sx={{
                      '& .MuiStepIcon-root': {
                        color: isRejectedStep ? 'error.main' : '#084E77',
                      },
                      '& .MuiStepLabel-label': {
                        color: isRejectedStep ? 'error.main' : 'inherit',
                        fontWeight: isRejectedStep ? 700 : 600,
                      },
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography fontWeight={600}>
                        {formatActionLabel(log.action)}
                      </Typography>

                      {index === logs.length - 1 && (
                        <Chip
                          label="Latest"
                          size="small"
                          color="success"
                        />
                      )}
                    </Box>
                  </StepLabel>

                  <StepContent>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: 'grey.50',
                        borderRadius: 2,
                        border: '1px solid #eee',
                      }}
                    >
                      <Grid container spacing={1}>
                        <Grid item xs={12}>
                          <Typography className="theme-label">
                            Remarks
                          </Typography>
                          <Typography className="theme-values">
                            {log.remarks || '—'}
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography className="theme-label">
                            Performed By
                          </Typography>

                          <Typography className="theme-values">
                            {log.performedBy?.name || '—'}
                          </Typography>

                          <Typography className="theme-label">
                            Role
                          </Typography>
                          <Typography className="theme-values">
                            {log.performedBy?.role?.roleName || '—'}
                          </Typography>

                          <Typography className="theme-values">
                            {log.performedBy?.email || '—'}
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography className="theme-label">
                            Assigned To :
                          </Typography>
                          <Typography className="theme-values">
                            {log.assignedTo?.name || '—'}
                          </Typography>

                          {log.assignedTo && (
                            <>
                              <Typography className="theme-values">
                                {log.assignedTo?.role?.roleName}
                              </Typography>
                              <Typography className="theme-values">
                                {log.assignedTo?.email}
                              </Typography>
                            </>
                          )}
                        </Grid>

                        <Grid item xs={12}>
                          <Divider sx={{ my: 1 }} />
                          <Typography className="theme-label">
                            Date :
                          </Typography>
                          <Typography className="theme-values">
                            {formatDateTime(log.createdAt)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </StepContent>
                </Step>
              );
            })}
          </Stepper>

        </Box>
      );
    }

    if (activeTabData.type === 'bre-policy') {

      const executeBre = async () => {
        try {

          if (!loanData?.variantId) {
            enqueueSnackbar(
              "Variant ID is missing. Unable to execute BRE for this loan.",
              { variant: "warning" }
            );
            return;
          }

          const accessToken = localStorage.getItem("accessToken");

          const res = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/bre/executeBreForLoan/${loanData?.variantId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          enqueueSnackbar(
            res?.data?.message || "BRE executed successfully",
            { variant: "success" }
          );

          setBreResult(res?.data?.data);
          refreshLoanData();
        } catch (e) {
          enqueueSnackbar(
            e?.response?.data?.message || "BRE execution failed",
            { variant: "error" }
          );
        }
      };

      return (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            sx={primaryBtnSx}
            onClick={executeBre}
            disabled={breResult}
          >
            Execute BRE
          </Button>

          <Card sx={{ mt: 2 }}>
            <CardHeader
              title={
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Typography variant="h6">Loan BRE Scoring</Typography>

                  {breResult?.breScore != null && (
                    <Chip
                      label={`Bre Score: ${breResult.breScore}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        color: '#FFFFFF',
                        borderColor: '#FFFFFF',
                        borderWidth: 2,
                        padding: 2,
                        fontWeight: 600,
                      }}
                    />
                  )}

                  {breResult?.maxPossibleScore != null && (
                    <Chip
                      label={`Max Possible Score: ${breResult.maxPossibleScore}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        color: '#FFFFFF',
                        borderColor: '#FFFFFF',
                        borderWidth: 2,
                        padding: 2,
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Box>
              }
            />

            <CardContent>
              {breResult?.breBreakdown?.map((cat, i) => (
                <Accordion key={i} sx={{ mt: 2 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      background: 'var(--theme-btn-bg)',
                      color: '#fff',
                      borderRadius: '4px',
                      minHeight: 40,
                      py: 0.5,

                      '& .MuiAccordionSummary-content': {
                        margin: 0,
                        fontWeight: 600,
                        alignItems: 'center',
                      },

                      '& .MuiAccordionSummary-expandIconWrapper': {
                        color: '#fff',
                      },

                      '&:hover': {
                        filter: 'brightness(0.92)',
                      },

                      '&.Mui-expanded': {
                        minHeight: 50,
                        py: 0.5,
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                      },
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                      {cat.category}
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails>
                    {/* Score summary */}
                    <Box
                      mb={3}
                      p={2}
                      sx={{
                        border: "1px solid #eee",
                        borderRadius: "8px",
                        background: "#fafafa",
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography className="theme-label">Score</Typography>
                          <Typography className="theme-value">{cat.score}</Typography>
                        </Grid>

                        {/* <Grid item xs={12} md={4}>
                          <Typography className="theme-label">Raw Score</Typography>
                          <Typography className="theme-value">{cat.rawScore}</Typography>
                        </Grid> */}

                        <Grid item xs={12} md={6}>
                          <Typography className="theme-label">Max Score</Typography>
                          <Typography className="theme-value">{cat.maxScore}</Typography>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Parameters */}
                    {cat.parameters?.map((p, j) => (
                      <Card
                        key={j}
                        variant="outlined"
                        sx={{
                          mb: 2,
                          borderRadius: 2,
                          backgroundColor: "#fafafa",
                        }}
                      >
                        <CardContent sx={{ pb: "16px !important" }}>
                          <Typography
                            variant="subtitle2"
                            className="theme-label"
                            gutterBottom
                          >
                            {p.key}
                          </Typography>

                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography>
                                <span className="theme-label">Actual:</span>{" "}
                                <span className="theme-value">{p.actual}</span>
                              </Typography>
                            </Grid>

                            <Grid item xs={6}>
                              <Typography>
                                <span className="theme-label">Score:</span>{" "}
                                <span className="theme-value">{p.score}</span>
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>

        </Box>
      );
    }


    return null;
  };


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ overflow: 'hidden' }}>
      <Box p={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          mb={2}
          sx={{ borderBottom: '1px solid #D9D9D9', p: 2 }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton size="small" onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography fontWeight={600}>Review Details</Typography>
          </Box>

          <Box display="flex" gap={1}>
            {hasPermission(ROLE_PERMISSIONS.ASK_DOCUMENT) && source !== 'approvals' && (
              <Button
                startIcon={<DescriptionIcon />}
                sx={primaryBtnSx}
                onClick={() => setModalType('askDocument')}
              >
                Ask Document
              </Button>
            )}

            {hasPermission(ROLE_PERMISSIONS.REASSIGN) &&
              !isSeniorCreditLoanApp &&
              source !== 'approvals' &&
              source !== 'loanapplication' && (
                <Button
                  startIcon={<AutorenewIcon />}
                  sx={primaryBtnSx}
                  onClick={() => setModalType('reassign')}
                >
                  Re-Assign
                </Button>
              )}


            {hasPermission(ROLE_PERMISSIONS.REASSIGN) &&
              !isSeniorCreditLoanApp && source === 'loanapplication' && (
                <Button
                  startIcon={<AutorenewIcon />}
                  sx={primaryBtnSx}
                  onClick={() => setScReassignOpen(true)}
                >
                  Approve
                </Button>
              )}

            {
              (userRole === 'Ops' && source === 'recheck') && (
                <>
                  <Button
                    startIcon={<AutorenewIcon />}
                    sx={primaryBtnSx}
                    onClick={() => setScReassignOpen(true)}
                  >
                    Approve
                  </Button>

                  <Button
                    startIcon={<AutorenewIcon />}
                    sx={primaryBtnSx}
                    onClick={() => setOpenENachModal(true)}
                  >
                    Banking Activation
                  </Button>
                </>
              )
            }

            {hasPermission(ROLE_PERMISSIONS.REASSIGN) &&
              isSeniorCreditLoanApp && source !== 'approvals' && (
                <Button
                  startIcon={<AutorenewIcon />}
                  sx={primaryBtnSx}
                  onClick={handleFetchCreditReportAndOpenModal}
                >
                  Submit
                </Button>
              )}



            {showSubmitKyc && (
              <Button
                sx={primaryBtnSx}
                onClick={() => setModalType('submitKyc')}
              >
                ✓ Submit KYC
              </Button>
            )}


            {!verifiedpage && canShowLoanApproveButton(userRole) && (
              <Button
                sx={primaryBtnSx}
                onClick={() => setModalType('approvePanelScredit')}
              >
                Approve
              </Button>
            )}

            {hasPermission(ROLE_PERMISSIONS.SEND_AGREEMENT) && source !== 'approvals' && (
              // <Button
              //   startIcon={<SendIcon />}
              //   color="success"
              //   variant="contained"
              //   onClick={() =>
              //     setModalType(agreementSent ? 'approvePanel' : 'confirm')
              //   }
              // >
              //   {agreementSent ? 'Verify' : 'Send Agreement'}
              // </Button>
              <Button
                startIcon={<SendIcon />}
                sx={primaryBtnSx}
                onClick={handleOpenAgreementModal}
              // disabled={!creditApproved}
              >
                Create Agreement
              </Button>


            )}

            {/* {canViewAddBankDetailsTab(userRole, creditApproved) && (
              <Button
                onClick={() => setModalType('disburse')}
                startIcon={
                  <AccountBalanceWalletOutlinedIcon
                    sx={{ fontSize: 22 }}
                  />
                }
                sx={{
                  backgroundColor: '#38A169',
                  color: '#FFFFFF',
                  px: 3,
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: 16,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#2F855A',
                  },
                }}
              >
                Add Bank Details
              </Button>

            )} */}

            {userRole === 'Finance' && source !== 'approvals' && (
              <Button
                startIcon={<AutorenewIcon />}
                sx={primaryBtnSx}
                onClick={() => setOpenDisbursalAssign(true)}
              >
                Assign
              </Button>
            )}


            {canViewDisbursalPreview(userRole) && LoanBankDetails && (
              <Button
                sx={primaryBtnSx}
                onClick={() => setOpenPaymentApproval(true)}
              >
                Payment Approval
              </Button>
            )}



          </Box>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box>
            <Typography className="theme-values">{viewData?.name}</Typography>
            <Typography className="theme-label">
              Loan ID: {viewData?.loanId}
            </Typography>
          </Box>

          {/* eSign Documents */}
          {hasPendingEsign && (
            <Alert severity="warning" sx={{ py: 0.5, px: 1.5 }}>
              Document not signed
            </Alert>
          )}
        </Box>
        <Paper>
          <ReusableTabs
            tabs={viewData.tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </Paper>
        {renderTabContent()}


        <ReAssignModal
          open={Boolean(modalType)}
          type={modalType}
          onClose={() => setModalType(null)}
          onSubmit={handleModalSubmit}
          options={
            modalType === 'reassign'
              ? assignOptions
              : [
                { id: 1, name: 'Aadhar Card' },
                { id: 2, name: 'Bank Statement' },
                { id: 3, name: 'Salary Slip' },
              ]
          }
        />

        {modalType === 'submitKyc' && (
          <Dialog
            open={modalType === 'submitKyc'}
            onClose={() => setModalType(null)}
            maxWidth="xs"
            fullWidth
          >
            <DialogTitle>KYC Status</DialogTitle>


            <DialogContent>
              <Typography fontSize={13} mt={1}>
                {employee?.employeeName || '-'}
              </Typography>

              <Typography fontSize={12} color="text.secondary">
                Loan ID: {loanCode || '-'}
              </Typography>
              <TextField
                select
                label="KYC Status"
                fullWidth
                margin="normal"
                value={kycForm.status}
                onChange={(e) =>
                  setKycForm({ ...kycForm, status: e.target.value })
                }
              >
                <MenuItem value="APPROVED">Approved</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
              </TextField>

              <TextField
                label="Comment"
                multiline
                rows={4}
                fullWidth
                margin="normal"
                value={kycForm.comment}
                onChange={(e) =>
                  setKycForm({ ...kycForm, comment: e.target.value })
                }
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setModalType(null)}>Cancel</Button>
              <Button
                sx={primaryBtnSx}
                onClick={handleSubmitKyc}
                disabled={!kycForm.status}
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>

        )}

        {modalType === 'approvePanelScredit' && (
          <Dialog open onClose={() => setModalType(null)} maxWidth="xs" fullWidth>
            <DialogTitle>Verify Loan</DialogTitle>

            <DialogContent>
              <Typography fontSize={13} mt={1}>
                {employee?.employeeName || '-'}
              </Typography>

              <Typography fontSize={12} color="text.secondary" mb={2}>
                Loan ID: {loanCode || '-'}
              </Typography>


              {(userRole === 'Senior_Credit' || userRole === 'Finance') && (
                <TextField
                  select
                  label="Interest Type"
                  fullWidth
                  margin="normal"
                  value={verifyForm.interestType}
                  onChange={(e) =>
                    setVerifyForm({ ...verifyForm, interestType: e.target.value })
                  }
                >
                  <MenuItem value="FLAT">FLAT</MenuItem>
                  <MenuItem value="REDUCING">REDUCING</MenuItem>
                </TextField>
              )

                // : 

                // (
                //   <TextField
                //     select
                //     label="Status"
                //     fullWidth
                //     margin="normal"
                //     value={verifyForm.status}
                //     onChange={(e) =>
                //       setVerifyForm({ ...verifyForm, status: e.target.value })
                //     }
                //   >
                //     <MenuItem value="APPROVED">Approved</MenuItem>
                //     <MenuItem value="REJECTED">Rejected</MenuItem>
                //   </TextField>
                // )

              }


              {/* REMARKS */}


              {/* LOAN AMOUNT */}
              <TextField
                label={userRole === 'Senior_Credit' ? "Loan Amount" : "Approved Amount"}
                type="number"
                fullWidth
                margin="normal"
                value={verifyForm.loanAmount}
                onChange={(e) =>
                  setVerifyForm({ ...verifyForm, loanAmount: e.target.value })
                }
              />

              {/* INTEREST RATE */}
              <TextField
                label="Interest Rate (%)"
                type="number"
                fullWidth
                margin="normal"
                value={verifyForm.interestRate}
                onChange={(e) =>
                  setVerifyForm({ ...verifyForm, interestRate: e.target.value })
                }
              />

              {/* TENURE */}
              <TextField
                label="Tenure (Months)"
                type="number"
                fullWidth
                margin="normal"
                value={verifyForm.tenure}
                onChange={(e) =>
                  setVerifyForm({ ...verifyForm, tenure: e.target.value })
                }
              />

              <TextField
                label="Processing Fee (%)"
                type="number"
                fullWidth
                margin="normal"
                value={verifyForm.processingFeePercent}
                onChange={(e) =>
                  setVerifyForm({
                    ...verifyForm,
                    processingFeePercent: e.target.value,
                  })
                }
              />

              <TextField
                label="Insurance Amount"
                type="number"
                fullWidth
                margin="normal"
                value={verifyForm.insuranceAmount}
                onChange={(e) =>
                  setVerifyForm({
                    ...verifyForm,
                    insuranceAmount: e.target.value,
                  })
                }
              />

              <TextField
                label="Stamp Duty"
                type="number"
                fullWidth
                margin="normal"
                value={verifyForm.stampDuty}
                onChange={(e) =>
                  setVerifyForm({
                    ...verifyForm,
                    stampDuty: e.target.value,
                  })
                }
              />

              <TextField
                label="Other Charges"
                type="number"
                fullWidth
                margin="normal"
                value={verifyForm.otherCharges}
                onChange={(e) =>
                  setVerifyForm({
                    ...verifyForm,
                    otherCharges: e.target.value,
                  })
                }
              />

              {userRole !== 'Senior_Credit' && (
                <TextField
                  label="Remarks"
                  multiline
                  rows={3}
                  fullWidth
                  margin="normal"
                  value={verifyForm.remarks}
                  onChange={(e) =>
                    setVerifyForm({ ...verifyForm, remarks: e.target.value })
                  }
                />
              )}

            </DialogContent>

            <DialogActions>
              <Button onClick={() => setModalType(null)}>Cancel</Button>
              <Button
                sx={primaryBtnSx}
                onClick={handleVerifySubmit}
                disabled={

                  (userRole === 'Senior_Credit' && !verifyForm.interestType) ||
                  (userRole === 'Finance' && (
                    !verifyForm.loanAmount ||
                    !verifyForm.interestRate ||
                    !verifyForm.tenure ||
                    !verifyForm.processingFeePercent ||
                    !verifyForm.insuranceAmount ||
                    !verifyForm.stampDuty ||
                    !verifyForm.otherCharges
                  ))
                }


              >
                Verify
              </Button>
            </DialogActions>
          </Dialog>
        )}


        {scReassignOpen && (
          <Dialog open onClose={() => setScReassignOpen(false)} maxWidth="xs" fullWidth>
            <DialogTitle>Reassign Loan</DialogTitle>

            <DialogContent>
              <Typography fontSize={13}>
                {employee?.employeeName || '-'}
              </Typography>
              <Typography fontSize={12} color="text.secondary" mb={2}>
                Loan ID: {loanCode || '-'}
              </Typography>

              <TextField
                select
                fullWidth
                label="Assign To"
                margin="normal"
                value={scForm.assignTo}
                onChange={(e) =>
                  setScForm({ ...scForm, assignTo: e.target.value })
                }
              >
                {getAssignToRoles(userRole, source).map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}

              </TextField>

              <TextField
                select
                fullWidth
                label="Action"
                margin="normal"
                value={scForm.action}
                onChange={(e) =>
                  setScForm({ ...scForm, action: e.target.value })
                }
              >
                <MenuItem value="APPROVE">Approve</MenuItem>
                <MenuItem value="REJECT">Reject</MenuItem>
              </TextField>

              {/* {scForm.assignTo === 'Finance' && (
                <>
                  <TextField
                    label="Approved Amount"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={scForm.approvedAmount}
                    onChange={(e) =>
                      setScForm({ ...scForm, approvedAmount: e.target.value })
                    }
                  />
                  <TextField
                    label="Interest Rate (%)"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={scForm.interestRate}
                    onChange={(e) =>
                      setScForm({ ...scForm, interestRate: e.target.value })
                    }
                  />
                  <TextField
                    label="Tenure"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={scForm.tenure}
                    onChange={(e) =>
                      setScForm({ ...scForm, tenure: e.target.value })
                    }
                  />
                  <TextField
                    label="Interest Type"
                    fullWidth
                    margin="normal"
                    value={scForm.interestType}
                    onChange={(e) =>
                      setScForm({ ...scForm, interestType: e.target.value })
                    }
                  />
                </>
              )} */}

              <TextField
                label="Remarks"
                multiline
                rows={3}
                fullWidth
                margin="normal"
                value={scForm.remarks}
                onChange={(e) =>
                  setScForm({ ...scForm, remarks: e.target.value })
                }
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setScReassignOpen(false)}>Cancel</Button>
              <Button sx={primaryBtnSx} onClick={handleSeniorCreditReassign}>
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        )}
        <Dialog
          open={openAgreementModal}
          onClose={() => setOpenAgreementModal(false)}
          maxWidth="xs" fullWidth slotProps={{
            paper: {
              sx: {
                borderRadius: 5,
              },
            },
          }}

        >
          <DialogTitle>Send Agreement</DialogTitle>

          <DialogContent sx={{ mt: 1 }}>
            <TextField
              select
              fullWidth
              label="Select Agreement Template"
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              margin="dense"
            >
              {agreementTemplates.map((template) => (
                <MenuItem key={template.id} value={template.id}>
                  {template.name}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenAgreementModal(false)}>
              Cancel
            </Button>

            <Button
              sx={primaryBtnSx}
              disabled={!selectedTemplateId}
              onClick={handleCreateAgreementDraft}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        {openDisbursalAssign && (
          <DisbursalAssignModal
            open={openDisbursalAssign}
            loanId={loanId}
            onClose={() => setOpenDisbursalAssign(false)}
            onSuccess={() => {
              setOpenDisbursalAssign(false);
              dispatch(fetchLoanDetailsById(loanId));
            }}
          />
        )}
        {openPaymentApproval && (
          <PaymentApprovalModal
            open={openPaymentApproval}
            onClose={() => setOpenPaymentApproval(false)}
            loanData={{
              LoanBankDetails,
              LoanCharges,
              LoanDisbursalSummary,
            }}
            onSuccess={() => {
              setOpenPaymentApproval(false);
              refreshLoanData();
            }}
            loanId={loanId}
          />
        )}
        {openENachModal && (
          <ENachModal
            open={openENachModal}
            onClose={() => setOpenENachModal(false)}
            loanId={loanId}
          />
        )}


        {/* {modalType === 'disburse' && (
          <DisbursementModal
            open
            loanId={loanId}
            onClose={() => setModalType(null)}
            onDisburseSuccess={() => {
              setModalType(null);
              setModalType('approvePanelScredit');
            }}
          />
        )} */}

        {/* {openCrifPdf && (
          <Dialog
            open
            onClose={() => setOpenCrifPdf(false)}
            maxWidth="lg"
            fullWidth
          >
            <DialogTitle>
              Credit Report
            </DialogTitle>

            <DialogContent>
              <iframe
                src={`${process.env.REACT_APP_BACKEND_MEDIA}${LoanCreditData?.crifPdf}`}
                width="100%"
                height="600px"
                title="CRIF Report"
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={() => window.print()}>
                Print
              </Button>
              <Button onClick={() => setOpenCrifPdf(false)}>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )} */}

      </Box>
    </Paper>
  );
};

export default ViewDetailsOperationManager;
