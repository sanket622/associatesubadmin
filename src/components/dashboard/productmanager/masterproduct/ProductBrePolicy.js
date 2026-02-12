
import { useEffect, useMemo, useState } from "react";
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
import { useSnackbar } from "notistack";
import { primaryBtnSx } from "../../../subcompotents/UtilityService";
import { fetchProductDetails } from '../../../../redux/masterproduct/tableslice/productsSlice';
import { useDispatch, useSelector } from "react-redux";
import { updateMasterProductDraft } from "../../../../redux/masterproduct/masterproductdraftslice/masterproductdraft";
import { useLocation, useNavigate } from "react-router-dom";

const OP_OPTIONS = [">=", "<=", "BETWEEN"];

const createEmptyRule = () => ({
    op: "",
    value: "",
    valueFrom: "",
    valueTo: "",
    score: "",
});

const createEmptyParameter = () => ({
    key: "",
    rules: [createEmptyRule()],
});

export default function ProductBrePolicy({ onSuccess }) {
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const status = location.state?.status;
    const ProductId = localStorage.getItem("createdProductId");
    const [category, setCategory] = useState("");
    const [maxScore, setMaxScore] = useState("");
    const [parameters, setParameters] = useState([createEmptyParameter()]);
    const [breKeys, setBreKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const productDetails = useSelector((state) => state.products.productDetails);
    const existingBrePolicies = useMemo(() => {
        return (
            productDetails?.ProductBrePolicy?.rulesJson?.rulesJson ||
            productDetails?.ProductBrePolicy?.rulesJson ||
            []
        );
    }, [productDetails]);

    const isEditMode = Array.isArray(existingBrePolicies) && existingBrePolicies.length > 0;

    useEffect(() => {
        fetchBreKeys();
    }, []);

    useEffect(() => {
        dispatch(fetchProductDetails(ProductId));
    }, [ProductId, dispatch])

    useEffect(() => {
        if (!isEditMode) return;
        const firstRuleSet = existingBrePolicies[0];
        setCategory(firstRuleSet.category || "");
        setMaxScore(firstRuleSet.maxScore?.toString() || "");

        setParameters(
            firstRuleSet.parameters.map((p) => ({
                key: p.key,
                rules: p.rules.map((r) => ({
                    op: r.op,
                    score: r.score?.toString() || "",
                    value:
                        r.op === "BETWEEN" ? "" : r.value?.toString() || "",
                    valueFrom:
                        r.op === "BETWEEN" ? r.value?.[0] ?? "" : "",
                    valueTo:
                        r.op === "BETWEEN" ? r.value?.[1] ?? "" : "",
                })),
            }))
        );
    }, [isEditMode, existingBrePolicies]);

    const fetchBreKeys = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const res = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/bre/getBreKeys`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );
            setBreKeys(res.data?.data || []);
        } catch (error) {
            enqueueSnackbar(error?.response?.data?.message || "Failed to load BRE keys", { variant: "error" });
        }
    };

    const updateParameter = (pIndex, field, value) => {
        const updated = [...parameters];
        updated[pIndex][field] = value;
        setParameters(updated);
    };

    const updateRule = (pIndex, rIndex, field, value) => {
        const updated = [...parameters];
        updated[pIndex].rules[rIndex][field] = value;
        setParameters(updated);
    };

    const addParameter = () =>
        setParameters([...parameters, createEmptyParameter()]);

    const addRule = (pIndex) => {
        const updated = [...parameters];
        updated[pIndex].rules.push(createEmptyRule());
        setParameters(updated);
    };
    const removeRule = (pIndex, rIndex) => {
        const updated = [...parameters];
        updated[pIndex].rules = updated[pIndex].rules.filter(
            (_, i) => i !== rIndex
        );
        setParameters(updated);
    };
    const removeParameter = (index) => {
        setParameters(parameters.filter((_, i) => i !== index));
    };
    const buildRuleValue = (r) =>
        r.op === "BETWEEN"
            ? [Number(r.valueFrom), Number(r.valueTo)]
            : Number(r.value);

    const handleSubmit = async () => {
        if (!category || !maxScore) {
            enqueueSnackbar("Category & Max Score required", { variant: "error" });
            return;
        }

        const payload = {
            masterProductId: localStorage.getItem("createdProductId"),
            rules: [
                {
                    category,
                    maxScore: Number(maxScore),
                    parameters: parameters.map((p) => ({
                        key: p.key,
                        rules: p.rules.map((r) => ({
                            op: r.op,
                            value: buildRuleValue(r),
                            score: Number(r.score),
                        })),
                    })),
                },
            ],
        };

        try {
            setLoading(true);


            if (isEditMode && status === "Draft") {
                const res = await dispatch(
                    updateMasterProductDraft({
                        endpoint: "updateBrePolicyDraft",
                        payload,
                    })
                ).unwrap();

                enqueueSnackbar(
                    res?.message || "BRE Policy updated successfully",
                    { variant: "success" }
                );
                navigate(-1);
            }

            else {
                const accessToken = localStorage.getItem("accessToken");

                const res = await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}/associate/masterProduct/createBrePolicy`,
                    payload,
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );

                enqueueSnackbar(
                    res.data?.message || "BRE Policy created successfully",
                    { variant: "success" }
                );
                navigate(-1);
            }

            onSuccess?.();
        } catch (e) {
            enqueueSnackbar(
                e?.response?.data?.message || "Failed to save BRE policy",
                { variant: "error" }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader title="Product BRE Policy" />
            <CardContent>
                <Grid container spacing={2} mb={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Max Score"
                            value={maxScore}
                            onChange={(e) => setMaxScore(e.target.value)}
                        />
                    </Grid>
                </Grid>

                {parameters.map((p, pIndex) => (
                    <Box key={pIndex} mb={3} p={2} border="1px solid #eee">
                        <TextField
                            select
                            fullWidth
                            label="BRE Key"
                            value={p.key}
                            onChange={(e) =>
                                updateParameter(pIndex, "key", e.target.value)
                            }
                        >
                            {breKeys.map((k) => (
                                <MenuItem key={k} value={k}>
                                    {k}
                                </MenuItem>
                            ))}
                        </TextField>

                        {p.rules.map((r, rIndex) => (
                            <Grid container spacing={2} mt={1} key={rIndex}>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Operator"
                                        value={r.op}
                                        onChange={(e) =>
                                            updateRule(
                                                pIndex,
                                                rIndex,
                                                "op",
                                                e.target.value
                                            )
                                        }
                                    >
                                        {OP_OPTIONS.map((op) => (
                                            <MenuItem key={op} value={op}>
                                                {op}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid item xs={12} md={5}>
                                    {r.op === "BETWEEN" ? (
                                        <Box display="flex" gap={1}>
                                            <TextField
                                                type="number"
                                                placeholder="From"
                                                fullWidth
                                                value={r.valueFrom}
                                                onChange={(e) =>
                                                    updateRule(
                                                        pIndex,
                                                        rIndex,
                                                        "valueFrom",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <TextField
                                                type="number"
                                                placeholder="To"
                                                fullWidth
                                                value={r.valueTo}
                                                onChange={(e) =>
                                                    updateRule(
                                                        pIndex,
                                                        rIndex,
                                                        "valueTo",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </Box>
                                    ) : (
                                        <TextField
                                            type="number"
                                            fullWidth
                                            label="Value"
                                            value={r.value}
                                            onChange={(e) =>
                                                updateRule(
                                                    pIndex,
                                                    rIndex,
                                                    "value",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    )}
                                </Grid>

                                <Grid item xs={12} md={2}>
                                    <TextField
                                        type="number"
                                        fullWidth
                                        label="Score"
                                        value={r.score}
                                        onChange={(e) =>
                                            updateRule(
                                                pIndex,
                                                rIndex,
                                                "score",
                                                e.target.value
                                            )
                                        }
                                    />
                                </Grid>


                                {p.rules.length > 1 && (
                                    <Grid item xs={12} md={2} alignSelf="center">
                                        <Button
                                            color="error"
                                            size="large"
                                            variant="outlined"
                                            onClick={() => removeRule(pIndex, rIndex)}
                                        >
                                            Remove Rule
                                        </Button>
                                    </Grid>
                                )}
                            </Grid>


                        ))}
                        <Box mt={2} display="flex" gap={2}>

                            <Button size="large" variant="outlined" onClick={() => addRule(pIndex)}>
                                + Add Rule
                            </Button>

                            {parameters.length > 1 && (
                                <Button
                                    color="error"
                                    variant="outlined"
                                    size="large"
                                    onClick={() => removeParameter(pIndex)}
                                >
                                    Remove Parameter
                                </Button>
                            )}
                        </Box>
                    </Box>
                ))}

                <Box display="flex" justifyContent="space-between">
                    <Button size="large" variant="outlined" onClick={addParameter}>
                        Add Parameter
                    </Button>
                    <Button
                        variant="contained"
                        sx={primaryBtnSx}
                        disabled={loading}
                        onClick={handleSubmit}
                    >
                        {loading ? <CircularProgress size={20} /> : "Save BRE Policy"}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}