import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import axios from 'axios';


export const formatDateTime = (value) => {
    if (typeof value !== 'string') return value;

    // Strict ISO date check (avoids numbers like "34", "200000")
    const isoDateRegex =
        /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z)?)?$/;

    if (!isoDateRegex.test(value)) {
        return value; // not a date → return as-is
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) return value;

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    // If time exists → include time
    // if (value.includes('T')) {
    //     let hours = date.getHours();
    //     const minutes = String(date.getMinutes()).padStart(2, '0');
    //     const ampm = hours >= 12 ? 'PM' : 'AM';
    //     hours = hours % 12 || 12;

    //     return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
    // }

    return `${day}-${month}-${year}`;
};

export const formatDateVkyc = (value) => {
    if (typeof value !== 'string') return value;

    const isoDateRegex =
        /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z)?)?$/;

    if (!isoDateRegex.test(value)) return value;

    const date = new Date(value);
    if (isNaN(date.getTime())) return value;

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
};


export function replaceUnderscore(value) {
    if (!value) return '';
    return value?.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}


export const handleViewKyc = async (event, loanId) => {
    try {
        const token = localStorage.getItem('accessToken');

        const res = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/vkyc/getVKYCDataPointDetails/${loanId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );


    } catch (error) {
        console.log(error);

        // enqueueSnackbar(`${error?.response?.data?.message} ${error.message}`, { variant: 'error' });
    }
};

export const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#FFAAAAC9',
        color: '#565656',
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: '#FFAAAAC9',
    },
}));
export const primaryBtnSx = {
    background: 'var(--theme-btn-bg)',
    color: '#fff',
    px: 3,
    py: 1.2,
    borderRadius: '8px',
    boxShadow: 'none',
    textTransform: 'none',
    fontWeight: 500,

    '&:hover': {
        background: 'var(--theme-btn-bg)',
        color: '#fff',
        boxShadow: 'none',
    },

    '&.Mui-disabled': {
        background: 'var(--theme-btn-bg)',
        color: '#fff',
        opacity: 0.6,
    },
};


export const isCreditRole = (role = '') => role.startsWith('Credit_');
export const getUserRole = () => localStorage.getItem('role');


export const ROLE_PERMISSIONS = {
    ASK_DOCUMENT: ['Ops_Manager', 'Operation_Manager', 'Credit'],
    REASSIGN: ['Ops_Manager', 'Operation_Manager', 'Senior_Ops', 'Senior_Credit', 'Credit'],
    SEND_AGREEMENT: ['Senior_Credit'],
    SUBMIT_KYC: ['Ops', 'Ops_Manager', 'Operation_Manager'],
};


export const CREDIT_ALLOWED_ROLES = ['Credit', 'Senior_Credit', 'Finance', 'Disbursal'];


export const hasPermission = (allowedRoles = []) => {
    const role = getUserRole();
    if (!role) return false;

    return (
        allowedRoles.includes(role) ||
        (allowedRoles.includes('Credit') && isCreditRole(role))
    );
};




export const ASSIGN_TO_BY_ROLE = {
    Ops: ['Senior_Ops'],
    Senior_Ops: ['Credit'],
    Credit: ['Senior_Credit'],
    Senior_Credit: ['Ops'],
};

export const getAssignToRoles = (role = '', source = '') => {
    if (role === 'Ops' && source === 'recheck') {
        return ['Finance'];
    }
    if (role.startsWith('Credit_')) {
        const level = Number(role.split('_')[1]);

        if (level === 1) {
            return ['Senior_Credit'];
        }

        return [`Credit_${level - 1}`];
    }

    return ASSIGN_TO_BY_ROLE[role] || [];
};



export const formatCrifSummary = (summary = {}) => {
    if (!summary) return [];

    return Object.entries(summary).map(([key, value]) => ({
        title: key.replace(/-/g, ' ').toUpperCase(),
        data: Array.isArray(value)
            ? value.map(v => ({
                label: v['ATTR-NAME'],
                value: v['ATTR-VALUE'],
            }))
            : Object.entries(value).map(([k, v]) => ({
                label: k.replace(/-/g, ' '),
                value: v,
            })),
    }));
};

export const canViewCreditTab = (creditData) => {
    const role = getUserRole();
    if (!role) return false;

    if (
        !CREDIT_ALLOWED_ROLES.includes(role) &&
        !(CREDIT_ALLOWED_ROLES.includes('Credit') && isCreditRole(role))
    ) return false;

    if (!creditData || Object.keys(creditData).length === 0) return false;
    return true;
};


export const formatLabel = (key) =>
    key
        .replace(/_/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase());


export const VKYC_ALLOWED_ROLES = ['Ops', 'Credit', 'Senior_Ops', 'Senior_Credit', 'Finance', 'Disbursal'];

export const canViewVkycTab = (role, LoanVkycData) =>
    !!LoanVkycData &&
    (
        VKYC_ALLOWED_ROLES.includes(role) ||
        (VKYC_ALLOWED_ROLES.includes('Credit') && isCreditRole(role))
    );



export const OTHER_DOCS_ALLOWED_ROLES = ['Credit', 'Senior_Credit', 'Finance', 'Disbursal'];

export const canViewOtherDocsTab = (role, docs = []) =>
    (
        OTHER_DOCS_ALLOWED_ROLES.includes(role) ||
        (OTHER_DOCS_ALLOWED_ROLES.includes('Credit') && isCreditRole(role))
    ) && docs.length > 0;




export const AA_ALLOWED_ROLES = ['Credit', 'Senior_Credit', 'Finance', 'Disbursal'];

export const canViewAATab = (role, creditData) => {
    if (!role) return false;

    if (
        !AA_ALLOWED_ROLES.includes(role) &&
        !(AA_ALLOWED_ROLES.includes('Credit') && isCreditRole(role))
    ) return false;

    if (!creditData || Object.keys(creditData).length === 0) return false;
    return true;
};



export const LOAN_APPROVED_ALLOWED_ROLES = ['Senior_Credit', 'Finance', 'Disbursal'];

export const canViewLoanApprovedTab = (role, loanApprovedData) => {
    if (!role) return false;
    if (!LOAN_APPROVED_ALLOWED_ROLES.includes(role)) return false;
    if (!loanApprovedData || Object.keys(loanApprovedData).length === 0) return false;
    return true;
};


export const BANK_DETAILS_ALLOWED_ROLES = ['Finance', 'Disbursal'];

export const canViewAddBankDetailsTab = (role) => {
    return BANK_DETAILS_ALLOWED_ROLES.includes(role);
};





export const canShowLoanApproveButton = (role) => {
    if (!role) return false;

    const ALLOWED_ROLES = ['Senior_Credit'];

    return ALLOWED_ROLES.includes(role);
};


const VIEW_SIGNED_DOC_ROLES = ['Senior_Credit', 'Finance', 'Disbursal'];

export const canViewSignedDocuments = (role) => {
    if (!role) return false;
    return VIEW_SIGNED_DOC_ROLES.includes(role);
};


export const DISBURSAL_PREVIEW_ROLES = ['Disbursal'];

export const canViewDisbursalPreview = (role) => {
    if (!role) return false;
    return DISBURSAL_PREVIEW_ROLES.includes(role);
};



export const EMI_ALLOWED_ROLES = [
    // 'Ops',
    // 'Ops_Manager',
    // 'Operation_Manager',
    // 'Senior_Ops',
    // 'Credit',
    'Senior_Credit',
    // 'Finance',
    // 'Disbursal',
];

export const canViewEmiRepaymentsTab = (role, loan = {}) => {

    if (!role) return false;

    if (!EMI_ALLOWED_ROLES.includes(role)) return false;

    return (
        !!loan?.LoanEmiDetails ||
        (Array.isArray(loan?.LoanRepaymentSchedule) &&
            loan.LoanRepaymentSchedule.length > 0)
    );
};

export const AGREEMENT_ALLOWED_ROLES = ['Senior_Credit'];

export const canViewAgreementTab = (role, loan = {}) => {
    if (!AGREEMENT_ALLOWED_ROLES.includes(role)) return false;
    return true;
};


export const canViewBSATxn = (role) => {
    return [
        'Ops',
        'Senior_Ops',
        'Senior_Credit',
        'Finance',
    ].includes(role);
};


export const canViewBrePolicyTab = (role) => {
    if (!role) return false;
    if (role === "Senior_Credit") return true;
    return role.toLowerCase().includes("credit_");
};