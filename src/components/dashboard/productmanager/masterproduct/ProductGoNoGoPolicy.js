import { useEffect, useState } from "react";
import { useSnackbar } from 'notistack';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Grid,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";
import { primaryBtnSx } from "../../../subcompotents/UtilityService";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from '../../../../redux/masterproduct/tableslice/productsSlice';
import { updateMasterProductDraft } from "../../../../redux/masterproduct/masterproductdraftslice/masterproductdraft";
import { useLocation, useNavigate } from "react-router-dom";




const OP_OPTIONS = [
    ">=",
    "<=",
    "BETWEEN",
    "IN",
    "EXISTS",
];

const emptyRule = {
    key: "",
    op: "",
    value: "",
    valueFrom: "",
    valueTo: "",
    onFail: "",
};

export default function ProductGoNoGoPolicy({ onSuccess }) {
    const { enqueueSnackbar } = useSnackbar();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [rules, setRules] = useState([emptyRule]);
    const [loading, setLoading] = useState(false);
    const [keyOptions, setKeyOptions] = useState([]);
    const productDetails = useSelector((state) => state.products.productDetails);
    const status = location.state?.status;
    const ProductId = localStorage.getItem('createdProductId');
    const existingPolicy =
        productDetails?.ProductGoNoGoPolicy || null;

    const isEditMode = Boolean(existingPolicy?.parameters?.length);
    const fetchGoNoGoKeys = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const res = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/bre/getGoNoGoKeys`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );
            setKeyOptions(res.data?.data || []);
        } catch (e) {
            enqueueSnackbar("Failed to load parameters", { variant: "error" });
        }
    };


    useEffect(() => {
        fetchGoNoGoKeys();
    }, []);

    useEffect(() => {
        dispatch(fetchProductDetails(ProductId));
    }, [ProductId, dispatch])

    useEffect(() => {
        if (existingPolicy?.parameters?.length) {
            setRules(
                existingPolicy.parameters.map((p) => ({
                    key: p.key,
                    op: p.op,
                    onFail: p.onFail,
                    value:
                        Array.isArray(p.value) && p.op === 'BETWEEN'
                            ? ''
                            : p.value,
                    valueFrom:
                        p.op === 'BETWEEN' ? p.value?.[0] ?? '' : '',
                    valueTo:
                        p.op === 'BETWEEN' ? p.value?.[1] ?? '' : '',
                }))
            );
        }
    }, [existingPolicy]);

    const handleRuleChange = (index, field, value) => {
        const updated = [...rules];
        updated[index][field] = value;
        setRules(updated);
    };

    const addRule = () => {
        setRules([...rules, emptyRule]);
    };

    const removeRule = (index) => {
        setRules(rules.filter((_, i) => i !== index));
    };

    const buildValue = (rule) => {
        switch (rule.op) {
            case "BETWEEN":
                return [
                    Number(rule.valueFrom),
                    Number(rule.valueTo),
                ];
            case "IN":
                return rule.value
                    .split(",")
                    .map((v) => v.trim())
                    .filter(Boolean);
            case "EXISTS":
                return rule.value;
            default:
                return Number(rule.value);
        }
    };

    const validateRules = () => {
        for (let i = 0; i < rules.length; i++) {
            const r = rules[i];

            if (!r.key) return "Parameter is required";
            if (!r.op) return "Operator is required";
            if (!r.onFail) return "On Fail Code is required";

            if (r.op === "BETWEEN") {
                if (r.valueFrom === "" || r.valueTo === "") {
                    return "Both From and To values are required for BETWEEN";
                }
                if (Number(r.valueFrom) >= Number(r.valueTo)) {
                    return "From value must be less than To value";
                }
            }

            if (r.op === "IN") {
                if (!r.value || !r.value.trim()) {
                    return "Comma separated values are required for IN";
                }
            }

            if (r.op === "EXISTS") {
                if (!r.value) {
                    return "Value is required for EXISTS";
                }
            }

            if ([">=", "<="].includes(r.op)) {
                if (r.value === "" || isNaN(Number(r.value))) {
                    return "Numeric value is required";
                }
            }
        }

        return null;
    };


    const handleSubmit = async () => {
        const errorMsg = validateRules();
        if (errorMsg) {
            enqueueSnackbar(errorMsg, { variant: "error" });
            return;
        }
        const masterProductId = localStorage.getItem('createdProductId');
        const payload = {
            masterProductId,
            parameters: rules.map((r) => ({
                key: r.key,
                op: r.op,
                value: buildValue(r),
                onFail: r.onFail,
            })),
        };

        try {
            setLoading(true);


            if (isEditMode && status === 'Draft') {
                const res = await dispatch(
                    updateMasterProductDraft({
                        endpoint: 'updateProductGoNoGoPolicyDraft',
                        payload,
                    })
                ).unwrap();

                enqueueSnackbar(
                    res?.message || 'Go / No-Go Policy updated successfully',
                    { variant: 'success' }
                );
                navigate(-1);
            }

            else {
                const accessToken = localStorage.getItem('accessToken');

                const res = await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}/associate/masterProduct/createProductGoNoGoPolicy`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                enqueueSnackbar(
                    res.data.message || 'Go / No-Go Policy saved successfully',
                    { variant: 'success' }
                );
                navigate(-1);
            }

            onSuccess?.();
        } catch (error) {
            enqueueSnackbar(
                error?.response?.data?.message ||
                error.message ||
                'Failed to save policy',
                { variant: 'error' }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader title="Product Go / No-Go Policy" />
            <CardContent>
                {rules.map((rule, index) => (
                    <Box key={index} mb={3} p={2} border="1px solid #eee" borderRadius={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={2}>
                                <Typography className="theme-label">Parameter</Typography>
                                <TextField
                                    select
                                    fullWidth
                                    value={rule.key}
                                    onChange={(e) =>
                                        handleRuleChange(index, "key", e.target.value)
                                    }
                                >
                                    {keyOptions.map((key) => (
                                        <MenuItem key={key} value={key}>
                                            {key}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12} md={2}>
                                <Typography className="theme-label">Operator</Typography>
                                <TextField
                                    select
                                    fullWidth
                                    value={rule.op}
                                    onChange={(e) =>
                                        handleRuleChange(index, "op", e.target.value)
                                    }
                                >
                                    {OP_OPTIONS.map((op) => (
                                        <MenuItem key={op} value={op}>
                                            {op}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Typography className="theme-label">Value</Typography>

                                {rule.op === "BETWEEN" && (
                                    <Box display="flex" gap={1}>
                                        <TextField
                                            type="number"
                                            placeholder="From"
                                            fullWidth
                                            value={rule.valueFrom}
                                            onChange={(e) =>
                                                handleRuleChange(index, "valueFrom", e.target.value)
                                            }
                                        />
                                        <TextField
                                            type="number"
                                            placeholder="To"
                                            fullWidth
                                            value={rule.valueTo}
                                            onChange={(e) =>
                                                handleRuleChange(index, "valueTo", e.target.value)
                                            }
                                        />
                                    </Box>
                                )}

                                {rule.op === "IN" && (
                                    <TextField
                                        fullWidth
                                        placeholder="Comma separated values"
                                        value={rule.value}
                                        onChange={(e) =>
                                            handleRuleChange(index, "value", e.target.value)
                                        }
                                    />
                                )}

                                {rule.op === "EXISTS" && (
                                    <TextField
                                        fullWidth
                                        placeholder="Value"
                                        value={rule.value}
                                        onChange={(e) =>
                                            handleRuleChange(index, "value", e.target.value)
                                        }
                                    />
                                )}

                                {rule.op &&
                                    !["BETWEEN", "IN", "EXISTS"].includes(rule.op) && (
                                        <TextField
                                            type="number"
                                            fullWidth
                                            placeholder="Value"
                                            value={rule.value}
                                            onChange={(e) =>
                                                handleRuleChange(index, "value", e.target.value)
                                            }
                                        />
                                    )}
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <Typography className="theme-label">On Fail Code</Typography>
                                <TextField
                                    fullWidth
                                    placeholder="On Fail Code"
                                    value={rule.onFail}
                                    onChange={(e) =>
                                        handleRuleChange(index, "onFail", e.target.value)
                                    }
                                />
                            </Grid>

                            <Grid item xs={12} md={1} alignSelf="flex-end">
                                <Button
                                    color="error"
                                    onClick={() => removeRule(index)}
                                >
                                    Remove
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                ))}

                <Box display="flex" justifyContent="space-between">
                    <Button variant="outlined" onClick={addRule}>
                        Add Rule
                    </Button>

                    <Button
                        variant="contained"
                        sx={primaryBtnSx}
                        disabled={loading || !rules.length}
                        onClick={handleSubmit}
                    >
                        {loading ? <CircularProgress size={20} /> : 'Save Policy'}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}
