import { useEffect, useState } from "react";
import { useSnackbar } from 'notistack';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    CircularProgress,
    FormControl,
    Grid,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { primaryBtnSx } from "../../subcompotents/UtilityService";
import { useDispatch, useSelector } from "react-redux";
import { fetchVariantProductDetail } from '../../../redux/varient/variantSingleSlice';
import { updateMasterProductDraft } from "../../../redux/masterproduct/masterproductdraftslice/masterproductdraft";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchGoNoGoKeys } from "../../../redux/varient/variantGoNoGoKeysSlice";
import { fetchGeographies } from
    '../../../redux/varient/geographySlice';



const OP_OPTIONS = [
    ">=",
    "<=",
    "BETWEEN",
    "IN",
    "EXISTS",
];

const createEmptyRule = () => ({
    id: crypto.randomUUID(),
    key: "",
    op: "",
    value: "",
    valueFrom: "",
    valueTo: "",
    onFail: "",
    selectedGeographies: [],
});

export default function VariantGoNoGoPolicy({ onSuccess }) {
    const { enqueueSnackbar } = useSnackbar();
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();
    const [rules, setRules] = useState([createEmptyRule()]);
    const [loading, setLoading] = useState(false);
    const [keyOptions, setKeyOptions] = useState([]);
    const { variantDetail } = useSelector((state) => state.variantSingle);
    const { keys: reduxKeyOptions, loading: keysLoading } =
        useSelector((state) => state.variantGoNoGoKeys);

    const { geographies } = useSelector((state) => state.geography);

    const variantId = id;

    console.log(geographies);


    const status = location.state?.status;
    const existingPolicy =
        variantDetail?.VariantGoNoGoPolicy || null;
    const isEditMode = Boolean(existingPolicy?.parameters?.length);




    useEffect(() => {
        dispatch(fetchGoNoGoKeys());
        dispatch(fetchGeographies());
    }, [dispatch]);

    useEffect(() => {
        if (reduxKeyOptions && reduxKeyOptions.length > 0) {
            setKeyOptions(
                reduxKeyOptions.map(k =>
                    typeof k === "string" ? k : k.key
                )
            );
        }
    }, [reduxKeyOptions]);


    useEffect(() => {
        if (id) dispatch(fetchVariantProductDetail(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (
            existingPolicy?.parameters?.length &&
            keyOptions.length > 0
        ) {
            setRules(
                existingPolicy.parameters.map((p) => {
                    const isGeography = p.key === "GEOGRAPHY";
                    return {
                        id: crypto.randomUUID(),
                        key: p.key,
                        op: p.op,
                        onFail: p.onFail,
                        value: Array.isArray(p.value) && !isGeography ? "" : !Array.isArray(p.value) ? p.value : "",
                        valueFrom: p.op === "BETWEEN" ? p.value?.[0] ?? "" : "",
                        valueTo: p.op === "BETWEEN" ? p.value?.[1] ?? "" : "",
                        selectedGeographies: isGeography && Array.isArray(p.value) ? p.value : [],
                    };
                })
            );
        }
    }, [existingPolicy, keyOptions]);

    const handleRuleChange = (index, field, value) => {
        setRules(prev =>
            prev.map((rule, i) => {
                if (i !== index) return rule;

                const updatedRule = {
                    ...rule,
                    [field]: value,
                };

                if (field === "key") {

                    if (value === "GEOGRAPHY") {
                        updatedRule.op = "IN";
                        updatedRule.selectedGeographies = [];
                    } else {
                        updatedRule.op = "";
                        updatedRule.selectedGeographies = [];
                    }

                    updatedRule.value = "";
                    updatedRule.valueFrom = "";
                    updatedRule.valueTo = "";
                }

                return updatedRule;
            })
        );
    };

    const handleGeographyChange = (index, selectedValues) => {
        setRules(prev =>
            prev.map((rule, i) => {
                if (i !== index) return rule;
                return {
                    ...rule,
                    selectedGeographies: selectedValues,
                };
            })
        );
    };

    const addRule = () => {
        setRules((prev) => [...prev, createEmptyRule()]);
    };

    const removeRule = (index) => {
        setRules(rules.filter((_, i) => i !== index));
    };

    const buildValue = (rule) => {
        if (rule.key === "GEOGRAPHY") {
            return rule.selectedGeographies;
        }
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

            if (r.key === "GEOGRAPHY") {
                if (!r.selectedGeographies || r.selectedGeographies.length === 0) {
                    return "At least one geography must be selected";
                }
                continue;
            }

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

        const payload = {
            variantId,
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
                // console.log(payload);

                const res = await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}/associate/variantProduct/createVariantGoNoGoPolicy`,
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
            <Button
                startIcon={<ArrowBackIcon />}
                sx={{ mb: 3, m: 2 }}
                variant="outlined"
                onClick={() => navigate(-1)}
            >
                Back
            </Button>
            <CardHeader title="Variant Go / No-Go Policy" />
            <CardContent>
                {rules.map((rule, index) => (
                    <Box key={rule.id} mb={3} p={2} border="1px solid #eee" borderRadius={2}>
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
                                    {keyOptions.map((opt) => {
                                        const value = typeof opt === "string" ? opt : opt.key;

                                        return (
                                            <MenuItem key={value} value={value}>
                                                {value}
                                            </MenuItem>
                                        );
                                    })}
                                </TextField>
                            </Grid>

                            <Grid item xs={12} md={2}>
                                <Typography className="theme-label">Operator</Typography>
                                <TextField
                                    select
                                    fullWidth
                                    value={rule.op}
                                    disabled={rule.key === "GEOGRAPHY"}
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

                                {rule.key === "GEOGRAPHY" && (
                                    <FormControl fullWidth>
                                        {geographies.length === 0 ? (
                                            <Typography variant="body2" color="text.secondary">
                                                No geographies available
                                            </Typography>
                                        ) : (
                                            <Select
                                                multiple
                                                value={rule.selectedGeographies}
                                                onChange={(e) => handleGeographyChange(index, e.target.value)}
                                                input={<OutlinedInput />}
                                                renderValue={(selected) => selected.join(", ")}
                                            >
                                                {geographies.map((geo) => (
                                                    <MenuItem key={geo.id} value={geo.name}>
                                                        <Checkbox checked={rule.selectedGeographies.indexOf(geo.name) > -1} />
                                                        <ListItemText primary={geo.name} />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    </FormControl>
                                )}

                                {rule.key !== "GEOGRAPHY" && rule.op === "BETWEEN" && (
                                    <Box display="flex" gap={1}>
                                        <TextField
                                            key={`${index}-from-${rule.id}`}
                                            type="number"
                                            fullWidth
                                            placeholder="From"
                                            value={rule.valueFrom}
                                            onChange={(e) =>
                                                handleRuleChange(index, "valueFrom", e.target.value)
                                            }
                                        />

                                        <TextField
                                            key={`${index}-to-${rule.id}`}
                                            type="number"
                                            fullWidth
                                            placeholder="To"
                                            value={rule.valueTo}
                                            onChange={(e) =>
                                                handleRuleChange(index, "valueTo", e.target.value)
                                            }
                                        />
                                    </Box>
                                )}

                                {rule.key !== "GEOGRAPHY" && rule.op === "IN" && (
                                    <TextField
                                        key={`${index}-in-${rule.id}`}
                                        fullWidth
                                        placeholder="Comma separated values"
                                        value={rule.value}
                                        onChange={(e) =>
                                            handleRuleChange(index, "value", e.target.value)
                                        }
                                    />
                                )}

                                {rule.key !== "GEOGRAPHY" && rule.op === "EXISTS" && (
                                    <TextField
                                        key={`${index}-exists-${rule.id}`}
                                        type="number"
                                        fullWidth
                                        placeholder="Value"
                                        value={rule.value}
                                        onChange={(e) =>
                                            handleRuleChange(index, "value", e.target.value)
                                        }
                                    />
                                )}

                                {rule.key !== "GEOGRAPHY" && rule.op &&
                                    !["BETWEEN", "IN", "EXISTS"].includes(rule.op) && (
                                        <TextField
                                            key={`${index}-numeric-${rule.id}`}
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