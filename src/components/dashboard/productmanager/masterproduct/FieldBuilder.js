import React, { useEffect, useState } from 'react';
import { Plus, Trash2, GripVertical, Eye, Copy, Settings, ChevronDown, ChevronRight, AlertCircle } from 'lucide-react';
import { Switch, FormControlLabel, Rating, CircularProgress, Card, CardContent, Chip, FormControl, InputLabel, Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { Radio, RadioGroup } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import SettingsIcon from '@mui/icons-material/Settings';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
    Box,
    Button,
    Paper,
    Stack,
    Typography,
    Divider,
    TextField, Grid,
    DialogActions,
    DialogContent,
    DialogTitle,
    Dialog,
    IconButton
} from "@mui/material";
import { createMasterProductFields } from '../../../../redux/masterproduct/productFields/productFieldsSlice';
import { useSnackbar } from 'notistack';
import { useLocation, useParams } from 'react-router-dom';
import { fetchProductDetails, selectProductFormFields } from
    '../../../../redux/masterproduct/tableslice/productsSlice';
import { submitEditMasterProductSubmit } from '../../../../redux/masterproduct/editmasterproduct/EditMasterProduct';
import {
    fetchSectionKeys,
    fetchFieldKeysBySectionId,
} from "../../../../redux/masterproduct/productFields/fieldManagerApi";
import { updateMasterProductDraft } from '../../../../redux/masterproduct/masterproductdraftslice/masterproductdraft';

// Field type definitions
const FIELD_TYPES = [
    { value: 'text', label: 'Text Input', icon: '📝', hasValidation: true },
    { value: 'number', label: 'Number', icon: '🔢', hasValidation: true },
    { value: 'email', label: 'Email', icon: '📧', hasValidation: true },
    { value: 'phone', label: 'Phone', icon: '📱', hasValidation: true },
    { value: 'textarea', label: 'Long Text', icon: '📄', hasValidation: true },
    { value: 'boolean', label: 'Yes/No Toggle', icon: '✓', hasValidation: false },
    { value: 'select', label: 'Dropdown', icon: '▼', hasValidation: false },
    { value: 'multiselect', label: 'Multi-Select Dropdown', icon: '☰', hasValidation: true },
    { value: 'radio', label: 'Radio Buttons', icon: '◉', hasValidation: false },
    { value: 'checkbox', label: 'Checkboxes', icon: '☑', hasValidation: false },
    { value: 'date', label: 'Date Picker', icon: '📅', hasValidation: true },
    { value: 'daterange', label: 'Date Range', icon: '📅📅', hasValidation: true },
    { value: 'time', label: 'Time Picker', icon: '⏰', hasValidation: false },
    { value: 'file', label: 'File Upload', icon: '📎', hasValidation: true },
    { value: 'currency', label: 'Currency', icon: '💰', hasValidation: true },
    { value: 'percentage', label: 'Percentage', icon: '%', hasValidation: true },
    { value: 'rating', label: 'Rating/Stars', icon: '⭐', hasValidation: true },
    { value: 'slider', label: 'Slider', icon: '━', hasValidation: true },
    { value: 'color', label: 'Color Picker', icon: '🎨', hasValidation: false },
    { value: 'url', label: 'URL/Link', icon: '🔗', hasValidation: true },
    { value: 'signature', label: 'Signature', icon: '✍️', hasValidation: false },
];

const CONDITION_OPERATORS = {
    text: ['equals', 'not_equals', 'contains', 'not_contains', 'starts_with', 'ends_with', 'is_empty', 'is_not_empty'],
    number: ['equals', 'not_equals', 'greater_than', 'less_than', 'greater_than_equal', 'less_than_equal', 'between', 'is_empty', 'is_not_empty'],
    select: ['equals', 'not_equals', 'is_empty', 'is_not_empty'],
    multiselect: ['contains', 'not_contains', 'contains_all', 'contains_any', 'is_empty', 'is_not_empty'],
    boolean: ['is_true', 'is_false'],
    date: ['equals', 'not_equals', 'before', 'after', 'between', 'is_empty', 'is_not_empty'],
    file: ['is_uploaded', 'is_not_uploaded'],
};




const FieldCard = ({
    field,
    sectionId,
    index,
    parentId = null,
    editingField,
    setEditingField,
    duplicateField,
    deleteField,
}) => {
    const isEditing = editingField === field.id;

    return (
        <Card
            variant="outlined"
            sx={{
                borderColor: isEditing ? 'primary.main' : 'grey.300',
                backgroundColor: isEditing ? 'primary.50' : 'background.paper',
                transition: 'all 0.2s',
                '&:hover': {
                    borderColor: isEditing ? 'primary.main' : 'grey.400',
                },
            }}
        >
            <CardContent sx={{ pr: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    {/* Left content */}
                    <Box display="flex" gap={2} flex={1}>
                        <DragIndicatorIcon sx={{ color: 'grey.400', mt: '2px' }} />

                        <Box flex={1}>
                            <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                                <Typography variant="subtitle1" fontWeight={500}>
                                    {field.label || 'Untitled Field'}
                                </Typography>

                                {field.required && (
                                    <Chip size="small" label="Required" color="error" />
                                )}

                                {field.conditional?.enabled && (
                                    <Chip
                                        size="small"
                                        label="Conditional"
                                        sx={{ bgcolor: 'purple.100', color: 'purple.700' }}
                                    />
                                )}
                            </Stack>

                            <Typography variant="body2" color="text.secondary">
                                {FIELD_TYPES.find(t => t.value === field.type)?.label}
                                {field.fieldKey && ` • ${field.fieldKey}`}
                            </Typography>

                            {field.subFields?.length > 0 && (
                                <Typography
                                    variant="caption"
                                    sx={{ color: 'purple.700' }}
                                    display="block"
                                    mt={0.5}
                                >
                                    📁 {field.subFields.length} sub-field
                                    {field.subFields.length !== 1 ? 's' : ''}
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    {/* Actions */}
                    <Stack direction="row" spacing={0.5} flexShrink={0}>
                        <IconButton
                            onClick={() => setEditingField(field.id)}
                            color="primary"
                            size="small"
                            sx={{ p: 0.5 }}
                        >
                            <SettingsIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                            onClick={() => duplicateField(field)}
                            size="small"
                            sx={{ p: 0.5 }}
                        >
                            <ContentCopyIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                            onClick={() => deleteField(field.id, parentId)}
                            color="error"
                            size="small"
                            sx={{ p: 0.5 }}
                        >
                            <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
};




const FormPreview = ({ open, onClose, fields, productName }) => {
    const [previewValues, setPreviewValues] = React.useState({});

    useEffect(() => {
        setPreviewValues(prev => {
            const next = { ...prev };

            fields.forEach(section => {
                (section.fields || []).forEach(field => {

                    if (field.type === "email") {
                        next[field.id] = "";
                    }

                    if (field.type === "url") {
                        next[field.id] = "";
                    }
                });
            });

            return next;
        });
    }, [fields]);



    const buildValidationProps = (field) => {
        const v = field.validation || {};
        const props = {};

        if (field.required) props.required = true;
        if (v.minLength) props.inputProps = { ...props.inputProps, minLength: v.minLength };
        if (v.maxLength) props.inputProps = { ...props.inputProps, maxLength: v.maxLength };
        if (v.min !== "") props.inputProps = { ...props.inputProps, min: v.min };
        if (v.max !== "") props.inputProps = { ...props.inputProps, max: v.max };
        if (v.pattern) props.inputProps = { ...props.inputProps, pattern: v.pattern };

        return props;
    };
    const evaluateCondition = (field) => {
        if (!field.conditional?.enabled) return true;


        const parentField = fields
            .flatMap(s => s.fields ?? [])
            .find(f => f.fieldKey === field.conditional.parentField);

        if (!parentField) return true;

        const parentValue = previewValues[parentField.id];
        const target = field.conditional.value;
        const op = field.conditional.operator;

        switch (op) {
            case "equals":
                return parentValue === target;
            case "not_equals":
                return parentValue !== target;
            case "is_empty":
                return !parentValue;
            case "is_not_empty":
                return !!parentValue;
            case "is_true":
                return parentValue === true;
            case "is_false":
                return parentValue === false;
            default:
                return true;
        }
    };


    const normalizeAccept = (accept) => {
        if (!accept) return undefined;

        return accept
            .split(",")
            .map(v => v.trim())
            .map(v => (v.startsWith(".") || v.includes("/") ? v : `.${v}`))
            .join(",");
    };

    const renderField = (field, level = 0) => {
        if (field.display?.hidden) return null;
        const conditionResult = evaluateCondition(field);

        if (
            field.conditional?.enabled &&
            (field.conditional.showIf ? !conditionResult : conditionResult)
        ) {
            return null;
        }



        const commonProps = {
            fullWidth: true,
            size: "small",
            placeholder: field.placeholder,
            disabled: field.display?.disabled,
            InputProps: { readOnly: field.display?.readonly },
            ...buildValidationProps(field),
        };

        return (
            <Box key={field.id} sx={{ ml: level * 3, mb: 2 }}>
                {field.styling?.labelPosition !== "hidden" && (
                    <Typography fontWeight={500} mb={0.5}>
                        {field.label || "Untitled Field"}
                        {field.required && <Typography component="span" color="error"> *</Typography>}
                    </Typography>
                )}

                {/* TEXT TYPES */}
                {/* TEXT & EMAIL → editable */}
                {["text", "email"].includes(field.type) && (
                    <TextField
                        type={field.type}
                        {...commonProps}
                        value={String(
                            previewValues[field.id] ?? field.defaultValue ?? ""
                        )}
                        onChange={(e) =>
                            setPreviewValues(prev => ({
                                ...prev,
                                [field.id]: e.target.value,
                                [field.fieldKey]: e.target.value
                            }))
                        }
                    />
                )}


                {/* URL / LINK → clickable */}
                {field.type === "url" && (
                    <a
                        href={previewValues[field.id] || field.defaultValue || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: "#1976d2",
                            textDecoration: "underline",
                            wordBreak: "break-all"
                        }}
                    >
                        {previewValues[field.id] || field.defaultValue || "—"}
                    </a>
                )}




                {field.type === "number" && (
                    <TextField type="number" {...commonProps} />
                )}

                {field.type === "textarea" && (
                    <TextField multiline rows={3} {...commonProps} />
                )}

                {field.type === "date" && (
                    <TextField type="date" {...commonProps} />
                )}

                {field.type === "time" && (
                    <TextField type="time" {...commonProps} />
                )}

                {field.type === "file" && (
                    <Box>
                        <TextField
                            type="file"
                            fullWidth
                            size="small"
                            inputProps={{
                                accept: normalizeAccept(field.validation?.accept)
                            }}
                        />

                        {/* Accepted file types message */}
                        {field.validation?.accept && (
                            <Typography
                                variant="caption"
                                color="error"
                                sx={{ mt: 0.5, display: "block" }}
                            >
                                Accepted files are: {field.validation.accept}
                            </Typography>
                        )}
                        {field.validation?.maxSize && (
                            <Typography variant="caption" color="error">
                                Max file size: {field.validation.maxSize} MB
                            </Typography>
                        )}
                    </Box>
                )}


                {["select"].includes(field.type) && (
                    <TextField
                        select
                        fullWidth
                        size="small"
                        value={previewValues[field.id] || ""}
                        onChange={(e) =>
                            setPreviewValues(prev => ({
                                ...prev,
                                [field.id]: e.target.value
                            }))
                        }
                    >
                        <MenuItem value="">Select</MenuItem>
                        {field.options?.map((opt, i) => (
                            <MenuItem key={i} value={opt}>
                                {opt}
                            </MenuItem>
                        ))}
                    </TextField>

                )}



                {field.type === "boolean" && (
                    <FormControlLabel
                        control={
                            <Switch
                                disabled={field.display?.disabled}
                                defaultChecked={Boolean(field.defaultValue)}
                            />
                        }
                        label={field.label || "Toggle"}
                    />
                )}

                {field.type === "phone" && (
                    <TextField type="tel" {...commonProps} />
                )}
                {field.type === "multiselect" && (
                    <TextField
                        select
                        fullWidth
                        size="small"
                        value={previewValues[field.id] || ""}
                        onChange={(e) =>
                            setPreviewValues(prev => ({
                                ...prev,
                                [field.id]: e.target.value
                            }))
                        }
                    >
                        <MenuItem value="">Select</MenuItem>
                        {field.options?.map((opt, i) => (
                            <MenuItem key={i} value={opt}>
                                {opt}
                            </MenuItem>
                        ))}
                    </TextField>

                )}


                {field.type === "radio" && (
                    <Box display="flex" alignItems="center" gap={2}>
                        {/* Label */}
                        {/* <Typography sx={{ minWidth: 'auto', fontWeight: 500 }}>
                            {field.label}
                        </Typography> */}

                        {/* Radios */}
                        <RadioGroup
                            row
                            value={previewValues[field.id] || ""}
                            onChange={(e) =>
                                setPreviewValues(prev => ({
                                    ...prev,
                                    [field.id]: e.target.value,
                                    [field.fieldKey]: e.target.value
                                }))
                            }
                        >
                            {field.options?.map((opt, i) => (
                                <FormControlLabel
                                    key={i}
                                    value={opt}
                                    control={<Radio />}
                                    label={opt}
                                />
                            ))}
                        </RadioGroup>
                    </Box>
                )}
                {field.type === "checkbox" && (
                    <Stack spacing={1}>
                        {field.options?.map((opt, i) => (
                            <label key={i}>
                                <input
                                    type="checkbox"
                                    checked={(previewValues[field.id] || []).includes(opt)}
                                    onChange={(e) => {
                                        const prevVals = previewValues[field.id] || [];
                                        const nextVals = e.target.checked
                                            ? [...prevVals, opt]
                                            : prevVals.filter(v => v !== opt);

                                        setPreviewValues(prev => ({
                                            ...prev,
                                            [field.id]: nextVals,
                                            [field.fieldKey]: nextVals
                                        }));
                                    }}
                                />
                                {opt}
                            </label>
                        ))}
                    </Stack>
                )}
                {field.type === "daterange" && (
                    <Stack direction="row" spacing={2}>
                        <TextField type="date" size="small" fullWidth />
                        <TextField type="date" size="small" fullWidth />
                    </Stack>
                )}
                {field.type === "currency" && (
                    <TextField
                        type="number"
                        InputProps={{ startAdornment: <span>₹</span> }}
                        {...commonProps}
                    />
                )}
                {field.type === "percentage" && (
                    <TextField
                        type="number"
                        InputProps={{ endAdornment: <span>%</span> }}
                        {...commonProps}
                    />
                )}
                {field.type === "rating" && (
                    <Rating
                        name={field.id}
                        max={Number(field.validation?.max) || 5}
                        defaultValue={Number(field.defaultValue) || 0}
                        disabled={field.display?.disabled}
                    />
                )}

                {field.type === "slider" && (
                    <input
                        type="range"
                        min={field.validation?.min || 0}
                        max={field.validation?.max || 100}
                        style={{ width: "100%" }}
                    />
                )}
                {field.type === "color" && (
                    <input type="color" />
                )}

                {field.type === "signature" && (
                    <Box
                        sx={{
                            border: "1px dashed #ccc",
                            height: 120,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "text.secondary"
                        }}
                    >
                        Signature Area
                    </Box>
                )}

                {field.helpText && (
                    <Typography variant="caption" color="text.secondary">
                        {field.helpText}
                    </Typography>
                )}

                {/* SUB FIELDS */}
                {evaluateCondition(field) &&
                    field.subFields?.map(sf => renderField(sf, level + 1))
                }

            </Box>
        );
    };


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                {productName} – Form Preview
            </DialogTitle>

            <DialogContent dividers>
                <Stack spacing={3}>

                    {fields.length === 0 && (
                        <Typography color="text.secondary">
                            No fields added yet
                        </Typography>
                    )}

                    {/* 🔽 SECTION SUPPORT ADDED HERE */}
                    {fields.map(item => {

                        // CASE 1: SECTION OBJECT
                        if (item.fields) {
                            return (
                                <Box key={item.id}>
                                    <Typography variant="h6" mb={0.5}>
                                        {item.title || "Untitled Section"}
                                    </Typography>

                                    {item.description && (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            mb={2}
                                        >
                                            {item.description}
                                        </Typography>
                                    )}

                                    <Stack spacing={2}>
                                        {item.fields.map(field =>
                                            renderField(field)
                                        )}
                                    </Stack>
                                </Box>
                            );
                        }

                        // CASE 2: OLD FLAT FIELD (BACKWARD COMPATIBLE)
                        return renderField(item);
                    })}

                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};


const FieldEditor = ({
    field,
    sectionId,
    parentId = null,
    fields,
    updateField,
    addField,
    deleteField,
    setEditingField,
    expandedSections,
    toggleSection,
    fieldKeysBySection,
    activeSectionKeyId,
}) => {

    if (!field) return null;

    const needsOptions = ['select', 'multiselect', 'radio', 'checkbox'].includes(field.type);
    const parentFields = parentId ? [] : fields.filter(f => f.id !== field.id);


    const parentFieldType = field?.conditional?.parentField
        ? fields.find(f => f.fieldKey === field.conditional.parentField)?.type
        : null;



    const operators =
        parentFieldType && CONDITION_OPERATORS[parentFieldType]
            ? CONDITION_OPERATORS[parentFieldType]
            : CONDITION_OPERATORS.text;



    const hideValueInput = [
        "is_empty",
        "is_not_empty",
        "is_true",
        "is_false",
    ].includes(field.conditional.operator);


    // console.log("render options", fieldKeysBySection[activeSectionKeyId])
    // console.log(fieldKeysBySection[activeSectionKeyId].length);

    const isEditMode =
        Boolean(field?.id) &&
        Boolean(field?.fieldKey) &&
        Boolean(field?.label);




    return (
        <div
            className="bg-white rounded-lg border-2 border-blue-500 shadow-lg overflow-hidden"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="bg-blue-500 text-white px-6 py-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Configure Field</h3>
                <button
                    onClick={() => setEditingField(null)}
                    className="text-white hover:text-blue-100"
                >
                    ✕
                </button>
            </div>

            <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto space-y-4">
                {/* BASIC SETTINGS */}
                <div className="border border-gray-200 rounded-lg">
                    <button
                        onClick={() => toggleSection('basic')}
                        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-t-lg"
                    >
                        <span className="font-semibold text-gray-900">Basic Settings</span>
                        {expandedSections.basic ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>
                    {expandedSections.basic && (
                        <div className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Field Key (API) *
                                    </label>
                                    <FormControl fullWidth size="small" disabled={!activeSectionKeyId}>
                                        {/* <InputLabel id="field-key-label">Field Key</InputLabel> */}

                                        <Select
                                            labelId="field-key-label"
                                            // label="Field Key"
                                            value={field.fieldKey || ""}
                                            disabled={isEditMode}
                                            onChange={(e) => {
                                                const key = e.target.value;

                                                const matched =
                                                    fieldKeysBySection[activeSectionKeyId]?.find(
                                                        (f) => f.key === key
                                                    );

                                                updateField(
                                                    sectionId,
                                                    field.id,
                                                    {
                                                        fieldKey: key,
                                                        label: matched?.label || field.label,
                                                    },
                                                    parentId
                                                );
                                            }}
                                        >
                                            <MenuItem value="">
                                                <em>Select Field Key</em>
                                            </MenuItem>

                                            {(fieldKeysBySection[activeSectionKeyId] || []).map((fk) => (
                                                <MenuItem key={fk.id} value={fk.key}>
                                                    {fk.key}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>


                                    <p className="text-xs text-gray-500 mt-1">Used in API/database</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Display Label *
                                    </label>
                                    <TextField
                                        // label="Display Label"
                                        fullWidth
                                        size="small"
                                        value={field.label || ""}
                                        disabled={isEditMode}  // ✅ lock only in edit mode
                                        onChange={(e) =>
                                            updateField(
                                                sectionId,
                                                field.id,
                                                { label: e.target.value },
                                                parentId
                                            )
                                        }
                                    />


                                    <p className="text-xs text-gray-500 mt-1">Shown to users</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Field Type *
                                </label>
                                <select
                                    value={field.type}
                                    onChange={(e) =>
                                        updateField(sectionId, field.id, { type: e.target.value }, parentId)
                                    }
                                    onMouseDown={(e) => e.stopPropagation()}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    {FIELD_TYPES.map(type => (
                                        <option key={type.value} value={type.value}>
                                            {type.icon} {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Placeholder Text
                                </label>
                                <input
                                    type="text"
                                    value={field.placeholder}
                                    onChange={(e) => updateField(
                                        sectionId,
                                        field.id,
                                        { placeholder: e.target.value },
                                        parentId
                                    )
                                    }
                                    onMouseDown={(e) => e.stopPropagation()}
                                    placeholder="e.g., Enter your monthly income"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Help Text / Description
                                </label>
                                <textarea
                                    value={field.helpText}
                                    onChange={(e) => updateField(
                                        sectionId,
                                        field.id,
                                        { helpText: e.target.value },
                                        parentId
                                    )
                                    }
                                    onMouseDown={(e) => e.stopPropagation()}
                                    placeholder="Additional information to help users"
                                    rows="2"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Default Value
                                </label>
                                <input
                                    type="text"
                                    value={field.defaultValue}
                                    onChange={(e) => updateField(
                                        sectionId,
                                        field.id,
                                        { defaultValue: e.target.value },
                                        parentId
                                    )
                                    }
                                    placeholder="Pre-filled value (optional)"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={`required-${field.id}`}
                                    checked={!!field.required}
                                    onChange={(e) =>
                                        updateField(
                                            sectionId,
                                            field.id,
                                            { required: e.target.checked },
                                            parentId
                                        )
                                    }

                                    className="w-4 h-4 text-blue-600 rounded"
                                />
                                <label
                                    htmlFor={`required-${field.id}`}
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Required Field
                                </label>
                            </div>

                        </div>
                    )}
                </div>

                {/* OPTIONS (for select/radio/checkbox) */}
                {needsOptions && (
                    <div className="border border-gray-200 rounded-lg">
                        <button
                            onClick={() => toggleSection('options')}
                            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-t-lg"
                        >
                            <span className="font-semibold text-gray-900">Options Configuration</span>
                            {expandedSections.options ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        </button>
                        {expandedSections.options && (
                            <div className="p-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Options (one per line) *
                                    </label>
                                    <textarea
                                        value={(field.options || []).join('\n')}
                                        onChange={(e) =>
                                            updateField(
                                                sectionId,
                                                field.id,
                                                {
                                                    options: e.target.value.split('\n')
                                                },

                                                parentId
                                            )
                                        }
                                        onMouseDown={(e) => e.stopPropagation()}

                                        rows={6}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                                    />

                                    <p className="text-xs text-gray-500 mt-1">Each line becomes one option</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* VALIDATION RULES */}
                <div className="border border-gray-200 rounded-lg">
                    <button
                        onClick={() => toggleSection('validation')}
                        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-t-lg"
                    >
                        <span className="font-semibold text-gray-900">Validation Rules</span>
                        {expandedSections.validation ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>
                    {expandedSections.validation && (
                        <div className="p-4 space-y-4">
                            {/* Text/Textarea Validation */}
                            {['text', 'textarea', 'email', 'phone', 'url'].includes(field.type) && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Min Length
                                            </label>
                                            <input
                                                type="number"
                                                value={field.validation?.minLength ?? ""}
                                                onChange={(e) =>
                                                    updateField(
                                                        sectionId,
                                                        field.id,
                                                        {
                                                            validation: {
                                                                ...field.validation,
                                                                minLength: e.target.value
                                                            }
                                                        },
                                                        parentId
                                                    )
                                                }
                                                onMouseDown={(e) => e.stopPropagation()}
                                                placeholder="e.g., 5"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />

                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Max Length
                                            </label>
                                            <input
                                                type="number"
                                                value={field.validation.maxLength}
                                                onChange={(e) => updateField(sectionId, field.id, {
                                                    validation: { ...field.validation, maxLength: e.target.value }
                                                }, parentId)}
                                                placeholder="e.g., 100"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Regex Pattern (Advanced)
                                        </label>
                                        <input
                                            type="text"
                                            value={field.validation.pattern}
                                            onChange={(e) => updateField(sectionId, field.id, {
                                                validation: { ...field.validation, pattern: e.target.value }
                                            }, parentId)}
                                            placeholder="e.g., ^[A-Z][a-z]+$"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Number/Currency/Percentage Validation */}
                            {['number', 'currency', 'percentage', 'slider'].includes(field.type) && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Min Value
                                        </label>
                                        <input
                                            type="number"
                                            value={field.validation.min}
                                            onChange={(e) => updateField(sectionId, field.id, {
                                                validation: { ...field.validation, min: e.target.value }
                                            }, parentId)}
                                            placeholder="e.g., 0"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Max Value
                                        </label>
                                        <input
                                            type="number"
                                            value={field.validation.max}
                                            onChange={(e) => updateField(sectionId, field.id, {
                                                validation: { ...field.validation, max: e.target.value }
                                            }, parentId)}
                                            placeholder="e.g., 100000"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Date Validation */}
                            {['date', 'daterange'].includes(field.type) && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Min Date
                                            </label>
                                            <input
                                                type="date"
                                                value={field.validation.minDate}
                                                onChange={(e) => updateField(sectionId, field.id, {
                                                    validation: { ...field.validation, minDate: e.target.value }
                                                }, parentId)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Max Date
                                            </label>
                                            <input
                                                type="date"
                                                value={field.validation.maxDate}
                                                onChange={(e) => updateField(sectionId, field.id, {
                                                    validation: { ...field.validation, maxDate: e.target.value }
                                                }, parentId)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex space-x-4">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={field.validation.allowPastDates}
                                                onChange={(e) => updateField(sectionId, field.id, {
                                                    validation: { ...field.validation, allowPastDates: e.target.checked }
                                                }, parentId)}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm text-gray-700">Allow Past Dates</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={field.validation.allowFutureDates}
                                                onChange={(e) => updateField(sectionId, field.id, {
                                                    validation: { ...field.validation, allowFutureDates: e.target.checked }
                                                }, parentId)}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm text-gray-700">Allow Future Dates</span>
                                        </label>
                                    </div>
                                </>
                            )}

                            {/* File Upload Validation */}
                            {field.type === 'file' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Accepted File Types
                                        </label>
                                        <input
                                            type="text"
                                            value={field.validation.accept}
                                            onChange={(e) => updateField(sectionId, field.id, {
                                                validation: { ...field.validation, accept: e.target.value }
                                            }, parentId)}
                                            placeholder="e.g., .pdf,.jpg,.png,.doc"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Max File Size (MB)
                                        </label>
                                        <input
                                            type="number"
                                            value={field.validation.maxSize}
                                            onChange={(e) => updateField(sectionId, field.id, {
                                                validation: { ...field.validation, maxSize: e.target.value }
                                            }, parentId)}
                                            placeholder="e.g., 5"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Multi-select Validation */}
                            {['multiselect', 'checkbox'].includes(field.type) && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Min Selections
                                        </label>
                                        <input
                                            type="number"
                                            value={field.validation.minItems}
                                            onChange={(e) => updateField(sectionId, field.id, {
                                                validation: { ...field.validation, minItems: e.target.value }
                                            }, parentId)}
                                            placeholder="e.g., 1"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Max Selections
                                        </label>
                                        <input
                                            type="number"
                                            value={field.validation.maxItems}
                                            onChange={(e) => updateField(sectionId, field.id, {
                                                validation: { ...field.validation, maxItems: e.target.value }
                                            }, parentId)}
                                            placeholder="e.g., 3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Rating Validation */}
                            {field.type === 'rating' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Number of Stars
                                    </label>
                                    <input
                                        type="number"
                                        value={field.validation.max || 5}
                                        onChange={(e) => updateField(sectionId, field.id, {
                                            validation: { ...field.validation, max: e.target.value }
                                        }, parentId)}
                                        placeholder="e.g., 5"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Custom Error Message
                                </label>
                                <input
                                    type="text"
                                    value={field.validation.customMessage}
                                    onChange={(e) => updateField(sectionId, field.id, {
                                        validation: { ...field.validation, customMessage: e.target.value }
                                    }, parentId)}
                                    placeholder="e.g., Please enter a valid income amount"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* CONDITIONAL LOGIC */}
                {!parentId && (
                    <div className="border border-gray-200 rounded-lg">
                        <button
                            onClick={() => toggleSection('conditional')}
                            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-t-lg"
                        >
                            <span className="font-semibold text-gray-900">Conditional Logic (Show/Hide)</span>
                            {expandedSections.conditional ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        </button>
                        {expandedSections.conditional && (
                            <div className="p-4 space-y-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id={`conditional-${field.id}`}
                                        checked={field.conditional.enabled}
                                        onChange={(e) => updateField(sectionId, field.id, {
                                            conditional: { ...field.conditional, enabled: e.target.checked }
                                        }, parentId)}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor={`conditional-${field.id}`} className="text-sm font-medium text-gray-700">
                                        Enable Conditional Display
                                    </label>
                                </div>

                                {field.conditional.enabled && (
                                    <>
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                            <p className="text-sm text-blue-800">
                                                <AlertCircle size={16} className="inline mr-1" />
                                                This field will be shown/hidden based on another field's value
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Parent Field (Trigger)
                                            </label>
                                            <select
                                                value={field.conditional.parentField}
                                                onChange={(e) => updateField(sectionId, field.id, {
                                                    conditional: { ...field.conditional, parentField: e.target.value }
                                                }, parentId)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            >
                                                <option value="">Select a field...</option>
                                                {parentFields.map(pf => (
                                                    <option key={pf.id} value={pf.fieldKey}>
                                                        {pf.label || pf.fieldKey}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {field.conditional.parentField && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Condition
                                                    </label>
                                                    <select
                                                        value={field.conditional.operator}
                                                        onChange={(e) =>
                                                            updateField(
                                                                sectionId, field.id,
                                                                {
                                                                    conditional: {
                                                                        ...field.conditional,
                                                                        operator: e.target.value,
                                                                    },
                                                                },
                                                                parentId
                                                            )
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                    >
                                                        {operators.map(op => (
                                                            <option key={op} value={op}>
                                                                {op.replace(/_/g, " ").toUpperCase()}
                                                            </option>
                                                        ))}
                                                    </select>

                                                </div>

                                                {!hideValueInput && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Value to Compare
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={field.conditional.value}
                                                            onChange={(e) => updateField(sectionId, field.id, {
                                                                conditional: { ...field.conditional, value: e.target.value }
                                                            }, parentId)}
                                                            placeholder="Enter value"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                        />
                                                    </div>
                                                )}

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Action
                                                    </label>
                                                    <select
                                                        value={field.conditional.showIf ? 'show' : 'hide'}
                                                        onChange={(e) => updateField(sectionId, field.id, {
                                                            conditional: { ...field.conditional, showIf: e.target.value === 'show' }
                                                        }, parentId)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                    >
                                                        <option value="show">Show this field when condition is met</option>
                                                        <option value="hide">Hide this field when condition is met</option>
                                                    </select>
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ADVANCED SETTINGS */}
                <div className="border border-gray-200 rounded-lg">
                    <button
                        onClick={() => toggleSection('advanced')}
                        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-t-lg"
                    >
                        <span className="font-semibold text-gray-900">Advanced Settings</span>
                        {expandedSections.advanced ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>
                    {expandedSections.advanced && (
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Field Width (%)
                                </label>
                                <select
                                    value={field.display.width}
                                    onChange={(e) => updateField(sectionId, field.id, {
                                        display: { ...field.display, width: e.target.value }
                                    }, parentId)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="25">25% (1/4)</option>
                                    <option value="33">33% (1/3)</option>
                                    <option value="50">50% (1/2)</option>
                                    <option value="66">66% (2/3)</option>
                                    <option value="75">75% (3/4)</option>
                                    <option value="100">100% (Full)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Label Position
                                </label>
                                <select
                                    value={field.styling.labelPosition}
                                    onChange={(e) => updateField(sectionId, field.id, {
                                        styling: { ...field.styling, labelPosition: e.target.value }
                                    }, parentId)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="top">Top (Default)</option>
                                    <option value="left">Left (Inline)</option>
                                    <option value="hidden">Hidden</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Custom CSS Class
                                </label>
                                <input
                                    type="text"
                                    value={field.styling.className}
                                    onChange={(e) => updateField(sectionId, field.id, {
                                        styling: { ...field.styling, className: e.target.value }
                                    }, parentId)}
                                    placeholder="e.g., highlight-field"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={field.display.readonly}
                                        onChange={(e) => updateField(sectionId, field.id, {
                                            display: { ...field.display, readonly: e.target.checked }
                                        }, parentId)}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm text-gray-700">Read Only (Display only, cannot edit)</span>
                                </label>

                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={field.display.disabled}
                                        onChange={(e) => updateField(sectionId, field.id, {
                                            display: { ...field.display, disabled: e.target.checked }
                                        }, parentId)}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm text-gray-700">Disabled (Grayed out)</span>
                                </label>

                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={field.display.hidden}
                                        onChange={(e) => updateField(sectionId, field.id, {
                                            display: { ...field.display, hidden: e.target.checked }
                                        }, parentId)}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm text-gray-700">Hidden by Default</span>
                                </label>
                            </div>
                        </div>
                    )}
                </div>

                {/* SUB-FIELDS */}
                {!parentId && (
                    <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 bg-purple-50">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-purple-900">Sub-Fields (Nested)</h4>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addField(sectionId, field.id);
                                }}
                                className="text-sm px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                            >
                                + Add Sub-Field
                            </button>
                        </div>
                        <p className="text-sm text-purple-700 mb-3">
                            Sub-fields are shown conditionally based on this field's value
                        </p>

                        {field.subFields && field.subFields.length > 0 ? (
                            <div className="space-y-2">
                                {field.subFields.map(sf => (
                                    <div key={sf.id} className="bg-white p-3 rounded border border-purple-200 flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-sm">{sf.label || 'Untitled Sub-Field'}</p>
                                            <p className="text-xs text-gray-500">{FIELD_TYPES.find(t => t.value === sf.type)?.label}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingField(sf.id);
                                                }}
                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteField(sectionId, sf.id, field.id)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic">No sub-fields yet</p>
                        )}
                    </div>
                )}
            </div>

            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                <button
                    onClick={() => setEditingField(null)}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    Close
                </button>
                <button
                    onClick={() => {
                        if (
                            field.type === "radio" &&
                            (!field.options || field.options.filter(o => o.trim()).length < 2)
                        ) {
                            alert("Radio field requires at least two options before saving.");
                            return;
                        }



                        setEditingField(null);
                        alert("Field configuration saved!");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Save Changes
                </button>

            </div>
        </div>
    );
};

const LoanFieldBuilder = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { productId } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const [productName, setProductName] = useState('Personal Loan');
    const [sections, setSections] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSectionId, setActiveSectionId] = useState(null);
    const [editingSectionId, setEditingSectionId] = useState(null);
    const status = location.state?.status;
    const [editingField, setEditingField] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [activeSectionKeyId, setActiveSectionKeyId] = useState(null);
    const [selectedFieldKey, setSelectedFieldKey] = useState("");
    const [selectedFieldLabel, setSelectedFieldLabel] = useState("");

    const [expandedSections, setExpandedSections] = useState({
        basic: true,
        validation: false,
        options: false,
        conditional: false,
        advanced: false
    });
    const { loading } = useSelector(
        (state) => state.productFields
    );
    const { sectionKeys, fieldKeysBySection } = useSelector(
        (state) => state.fieldManager
    );

    const productDetailsLoading = useSelector(
        (state) => state.products.productDetailsLoading
    );
    const parsedFields = useSelector(selectProductFormFields);
    // console.log(sections);

    const isEditMode = React.useMemo(() => {
        return Array.isArray(parsedFields) && parsedFields.length > 0;
    }, [parsedFields]);

    useEffect(() => {
        if (!editingField) return;

        setSelectedFieldKey(editingField.fieldKey || "");
        setSelectedFieldLabel(editingField.label || "");
    }, [editingField]);


    useEffect(() => {
        if (!productId) return;
        localStorage.setItem('createdProductId', productId);
        dispatch(fetchProductDetails(productId));
    }, [dispatch, productId]);

    useEffect(() => {
        dispatch(fetchSectionKeys());
    }, [dispatch]);
    useEffect(() => {
        if (!editingSectionId) return;

        const section = sections.find(s => s.id === editingSectionId);
        if (!section?.sectionKey) return;

        const matchedSection = sectionKeys.find(
            sk => sk.key === section.sectionKey
        );


        if (matchedSection) {
            setActiveSectionKeyId(matchedSection.id);
            dispatch(fetchFieldKeysBySectionId(matchedSection.id));
        }

    }, [editingSectionId, sectionKeys, sections, dispatch]);

    useEffect(() => {
        if (productDetailsLoading) return;

        if (parsedFields && Array.isArray(parsedFields)) {

            setSections(parsedFields);
        } else {

            setSections([]);
        }
    }, [productDetailsLoading, parsedFields]);

    const matchesSearch = (field, term) => {
        if (!term) return true;

        const t = term.toLowerCase();

        if (
            field.label?.toLowerCase().includes(t) ||
            field.fieldKey?.toLowerCase().includes(t) ||
            field.type?.toLowerCase().includes(t)
        ) {
            return true;
        }

        return field.subFields?.some(sf => matchesSearch(sf, term));
    };


    const buildFieldsOnlyPayload = () => ({
        masterProductId: productId,
        reason: "Testing edit",
        fieldsJsonDataUpdate: sections
    });


    const createSection = () => ({
        id: Date.now(),
        sectionKey: "",
        title: "",
        description: "",
        order: 1,
        collapsible: true,
        required: false,
        conditional: {
            enabled: false,
            parentField: "",
            operator: "equals",
            value: ""
        },
        fields: []
    });


    const createNewField = () => ({
        id: Date.now(),
        fieldKey: '',
        label: '',
        type: 'text',
        required: false,
        placeholder: '',
        helpText: '',
        defaultValue: '',
        options: [],
        validation: {
            minLength: '',
            maxLength: '',
            min: '',
            max: '',
            pattern: '',
            customMessage: '',
            accept: '',
            maxSize: '',
            minItems: '',
            maxItems: '',
            minDate: '',
            maxDate: '',
            allowPastDates: true,
            allowFutureDates: true,
        },
        conditional: {
            enabled: false,
            parentField: '',
            operator: 'equals',
            value: '',
            showIf: true,
        },
        subFields: [],
        display: {
            width: '100',
            inline: false,
            readonly: false,
            disabled: false,
            hidden: false,
        },
        styling: {
            className: '',
            labelPosition: 'top',
        }
    });

    const addSection = () => {
        const section = createSection();
        setSections(prev => [...prev, section]);
        setEditingSectionId(section.id);
    };

    const updateSection = (id, updates) => {
        setSections(prev =>
            prev.map(s => (s.id === id ? { ...s, ...updates } : s))
        );
    };


    const addField = (sectionId, parentFieldId = null) => {
        const field = createNewField();

        setSections(prev =>
            prev.map(section => {
                if (section.id !== sectionId) return section;

                if (!parentFieldId) {
                    return { ...section, fields: [...section.fields, field] };
                }

                return {
                    ...section,
                    fields: section.fields.map(f =>
                        f.id === parentFieldId
                            ? { ...f, subFields: [...f.subFields, field] }
                            : f
                    )
                };
            })
        );

        setEditingField(field.id);
        setActiveSectionId(sectionId);

        const section = sections.find(s => s.id === sectionId);

        if (!section?.sectionKey) {
            console.warn("Section has no sectionKey");
            return;
        }

        const matched = sectionKeys.find(
            sk => sk.key === section.sectionKey
        );

        if (!matched) {
            console.warn("No matching sectionKey found");
            return;
        }

        setActiveSectionKeyId(matched.id);
        dispatch(fetchFieldKeysBySectionId(matched.id));


        setTimeout(() => setEditingField(field.id), 0);
    };

    // useEffect(() => {
    //     console.log("activeSectionKeyId =", activeSectionKeyId);
    //     console.log(
    //         "fieldKeysBySection =",
    //         fieldKeysBySection
    //     );
    // }, [activeSectionKeyId, fieldKeysBySection]);

    useEffect(() => {
        if (!activeSectionId) return;

        const section = sections.find(s => s.id === activeSectionId);
        if (!section?.sectionKey) return;

        const matched = sectionKeys.find(
            sk => sk.key === section.sectionKey
        );

        if (!matched) return;

        setActiveSectionKeyId(matched.id);
        dispatch(fetchFieldKeysBySectionId(matched.id));
    }, [activeSectionId, sections, sectionKeys, dispatch]);


    const deleteField = (sectionId, fieldId, parentId = null) => {
        setSections(prev =>
            prev.map(section => {
                if (section.id !== sectionId) return section;


                if (!parentId) {
                    return {
                        ...section,
                        fields: section.fields.filter(f => f.id !== fieldId)
                    };
                }


                return {
                    ...section,
                    fields: section.fields.map(f =>
                        f.id === parentId
                            ? {
                                ...f,
                                subFields: f.subFields.filter(sf => sf.id !== fieldId)
                            }
                            : f
                    )
                };
            })
        );


        setEditingField(prev =>
            prev === fieldId ? null : prev
        );
    };



    const updateField = (sectionId, fieldId, updates, parentId = null) => {
        setSections(prev =>
            prev.map(section => {
                if (section.id !== sectionId) return section;

                return {
                    ...section,
                    fields: section.fields.map(field => {

                        // NORMAL FIELD
                        if (!parentId && field.id === fieldId) {
                            return { ...field, ...updates };
                        }

                        // SUB FIELD
                        if (parentId && field.id === parentId) {
                            return {
                                ...field,
                                subFields: field.subFields.map(sub =>
                                    sub.id === fieldId
                                        ? { ...sub, ...updates }
                                        : sub
                                )
                            };
                        }

                        return field;
                    })
                };
            })
        );
    };




    const duplicateField = (sectionId, field) => {
        const deepCloneField = (f) => {
            const cloned = JSON.parse(JSON.stringify(f));

            return {
                ...cloned,
                id: Date.now() + Math.random(),


                label: f.label ? `${f.label} (Copy)` : "Untitled Field (Copy)",


                conditional: {
                    ...cloned.conditional,
                    enabled: false,
                    parentField: "",
                },


                subFields: (f.subFields || []).map(sf => deepCloneField(sf)),
            };
        };

        const copiedField = deepCloneField(field);

        setSections(prev =>
            prev.map(section =>
                section.id === sectionId
                    ? { ...section, fields: [...section.fields, copiedField] }
                    : section
            )
        );
    };




    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };


    const exportJSON = () => {
        const data = {
            productName,
            version: "1.0",
            createdAt: new Date().toISOString(),
            sections: sections.map(({ id, ...section }) => ({
                ...section,
                fields: section.fields.map(({ id: fid, ...field }) => ({
                    ...field,
                    subFields: field.subFields?.map(({ id: sid, ...sf }) => sf) || []
                }))
            }))
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${productName.replace(/\s+/g, "_")}_form.json`;
        a.click();
    };

    const getFieldById = (id) => {
        for (let section of sections) {
            for (let field of section.fields) {
                if (field.id === id) return field;
                const sub = field.subFields?.find(sf => sf.id === id);
                if (sub) return sub;
            }
        }
        return null;
    };

    const getParentId = (childId) => {
        for (let section of sections) {
            for (let field of section.fields) {
                if (field.subFields?.some(sf => sf.id === childId)) {
                    return field.id;
                }
            }
        }
        return null;
    };

    const duplicateSection = (section) => {
        const newSection = {
            ...JSON.parse(JSON.stringify(section)),
            id: Date.now(),
            title: `${section.title} (Copy)`,
            sectionKey: `${section.sectionKey}_copy`
        };
        setSections(prev => [...prev, newSection]);
    };

    const deleteSection = (sectionId) => {
        setSections(prev => prev.filter(s => s.id !== sectionId));

        if (activeSectionId === sectionId) {
            setActiveSectionId(null);
            setEditingSectionId(null);
        }
    };



    const selectedField = React.useMemo(() => {
        return editingField ? getFieldById(editingField) : null;
    }, [editingField, sections]);

    const selectedParentId = React.useMemo(() => {
        return editingField ? getParentId(editingField) : null;
    }, [editingField, sections]);

    const section = sections.find(s => s.id === editingSectionId);


    return (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>

            {/* ================= HEADER ================= */}
            <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack>
                        <Typography variant="h6">Personal Loan</Typography>
                        <Typography variant="caption" color="text.secondary">
                            Form Version: v1 (Draft)
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            startIcon={<Eye />}
                            onClick={() => setShowPreview(true)}
                        >
                            Preview Form
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={exportJSON}
                        >
                            Export JSON
                        </Button>

                        <Button
                            loading={loading}
                            variant="outlined"
                            onClick={async () => {
                                try {
                                    const payload = buildFieldsOnlyPayload();

                                    if (isEditMode && status === 'Draft') {
                                        const res = await dispatch(
                                            updateMasterProductDraft({
                                                endpoint: 'updateMasterProductFieldsDraft',
                                                payload,
                                            })
                                        ).unwrap();

                                        enqueueSnackbar(
                                            res?.message || 'Draft saved successfully',
                                            { variant: 'success' }
                                        );
                                    }

                                    if (isEditMode && status !== 'Draft') {
                                        dispatch(submitEditMasterProductSubmit(payload));
                                    } else {
                                        dispatch(createMasterProductFields(sections));
                                    }
                                } catch (err) {
                                    enqueueSnackbar(
                                        err?.message || 'Something went wrong',
                                        { variant: 'error' }
                                    );
                                }
                            }}
                        >
                            Submit
                        </Button>




                    </Stack>

                </Stack>
            </Paper>

            {/* ================= MAIN LAYOUT ================= */}
            <Grid container spacing={2}>

                {/* ========== LEFT SIDEBAR ========== */}
                <Grid item>
                    <Paper
                        sx={{
                            width: 400,
                            p: 2,
                            height: "100vh",
                            overflowY: "auto"
                        }}
                    >
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<Plus />}
                            onClick={addSection}
                            sx={{ mb: 2 }}
                        >
                            Create Section
                        </Button>

                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Plus />}
                            onClick={() => addField(activeSectionId)}
                            disabled={!activeSectionId}
                            sx={{ mb: 2 }}
                        >
                            Add Field
                        </Button>


                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        {/* <Stack spacing={1}>
                            {fields.map((field, index) => (
                                <Paper
                                    key={field.id}
                                    variant="outlined"
                                    sx={{
                                        p: 1.5,
                                        cursor: "pointer",
                                        borderColor:
                                            editingField === field.id
                                                ? "primary.main"
                                                : "divider",
                                        bgcolor:
                                            editingField === field.id
                                                ? "primary.light"
                                                : "background.paper",
                                    }}
                                    onClick={() => setEditingField(field.id)}
                                >
                                    <Typography variant="body2" fontWeight={500}>
                                        {index + 1}. {field.label || "Untitled Field"}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {field.type}
                                    </Typography>
                                </Paper>
                            ))}
                        </Stack> */}
                        <Stack spacing={2} mb={3}>
                            {sections.length === 0 && (
                                <Typography color="text.secondary">
                                    No sections added yet
                                </Typography>
                            )}

                            {sections.map(section => (
                                <Paper
                                    key={section.id}
                                    variant="outlined"
                                    sx={{ p: 1.5 }}
                                >
                                    {/* SECTION HEADER */}
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        mb={1}
                                    >
                                        <Typography
                                            fontWeight={600}
                                            sx={{ cursor: "pointer" }}
                                            onClick={() => {
                                                setActiveSectionId(section.id);
                                                setEditingSectionId(section.id);
                                            }}
                                        >
                                            {section.title || "Untitled Section"}
                                        </Typography>

                                        <Stack direction="row" spacing={0.5}>
                                            {/* SETTINGS */}
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setActiveSectionId(section.id);
                                                    setEditingSectionId(section.id);
                                                }}
                                            >
                                                <Settings size={16} />
                                            </IconButton>

                                            {/* COPY */}
                                            <IconButton
                                                size="small"
                                                onClick={() => duplicateSection(section)}
                                            >
                                                <Copy size={16} />
                                            </IconButton>

                                            {/* DELETE */}
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => deleteSection(section.id)}
                                            >
                                                <Trash2 size={16} />
                                            </IconButton>
                                        </Stack>
                                    </Stack>


                                    {/* FIELDS */}
                                    <Stack spacing={1}>
                                        {section.fields.length === 0 ? (
                                            <Typography variant="caption" color="text.secondary">
                                                No fields yet
                                            </Typography>
                                        ) : (
                                            section.fields
                                                .filter(field => matchesSearch(field, searchTerm))
                                                .map((field, index) => (
                                                    <FieldCard
                                                        key={field.id}
                                                        sectionId={section.id}
                                                        field={field}
                                                        index={index}
                                                        editingField={editingField}
                                                        setEditingField={(id) => {
                                                            setEditingField(id);
                                                            setActiveSectionId(section.id);
                                                        }}
                                                        duplicateField={(field) =>
                                                            duplicateField(section.id, field)
                                                        }
                                                        deleteField={(fieldId, parentId) =>
                                                            deleteField(section.id, fieldId, parentId)
                                                        }
                                                    />
                                                ))
                                        )}
                                    </Stack>
                                </Paper>
                            ))}
                        </Stack>

                    </Paper>
                </Grid>

                {/* ========== RIGHT EDITOR PANEL ========== */}
                <Grid item xs>
                    <Paper
                        sx={{
                            p: 3,
                            minHeight: "100vh",
                            overflowY: "auto"
                        }}
                    >
                        {/* <Stack spacing={2} mb={3}>
                            {fields.length === 0 && (
                                <Typography color="text.secondary">
                                    No fields added yet
                                </Typography>
                            )}

                            {fields.map((field, index) => (
                                <FieldCard
                                    key={field.id}
                                    field={field}
                                    index={index}
                                    editingField={editingField}
                                    setEditingField={setEditingField}
                                    duplicateField={duplicateField}
                                    deleteField={deleteField}
                                />

                            ))}
                        </Stack> */}

                        <Divider sx={{ mb: 2 }} />
                        {editingSectionId && section && (
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" mb={2}>
                                    Edit Section
                                </Typography>

                                <Stack spacing={2}>
                                    <TextField
                                        label="Section ID (API)"
                                        key={activeSectionKeyId}
                                        select
                                        fullWidth
                                        size="small"
                                        value={section.sectionKey}
                                        onChange={(e) => {
                                            const selectedKey = e.target.value;
                                            updateSection(section.id, { sectionKey: selectedKey });

                                            const matched = sectionKeys.find(sk => sk.key === selectedKey);
                                            if (matched) {
                                                setActiveSectionKeyId(matched.id);
                                                dispatch(fetchFieldKeysBySectionId(matched.id));
                                            }
                                        }}

                                    >
                                        <MenuItem value="">Select Section</MenuItem>
                                        {sectionKeys.map((sk) => (
                                            <MenuItem key={sk.id} value={sk.key}>
                                                {sk.key}
                                            </MenuItem>
                                        ))}

                                    </TextField>


                                    <TextField
                                        label="Section Title"
                                        fullWidth
                                        size="small"
                                        value={section.title}
                                        onChange={e =>
                                            updateSection(section.id, { title: e.target.value })
                                        }
                                    />

                                    <TextField
                                        label="Description"
                                        fullWidth
                                        size="small"
                                        multiline
                                        minRows={3}
                                        value={section.description}
                                        onChange={e =>
                                            updateSection(section.id, { description: e.target.value })
                                        }
                                    />
                                </Stack>

                                <Divider sx={{ my: 3 }} />

                                <Stack direction="row" spacing={2} justifyContent="flex-end">
                                    <Button
                                        variant="outlined"
                                        onClick={() => setEditingSectionId(null)}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            setEditingSectionId(null);
                                        }}
                                    >
                                        Save Section
                                    </Button>
                                </Stack>
                            </Paper>
                        )}


                        {editingField && selectedField ? (
                            <>
                                <Typography variant="h6" mb={2}>
                                    Create / Edit Field
                                </Typography>

                                <Divider sx={{ mb: 2 }} />

                                <FieldEditor
                                    sectionId={activeSectionId}
                                    field={selectedField}
                                    parentId={selectedParentId}
                                    fields={
                                        sections.find(s => s.id === activeSectionId)?.fields || []
                                    }
                                    updateField={updateField}
                                    addField={addField}
                                    deleteField={deleteField}
                                    setEditingField={setEditingField}
                                    expandedSections={expandedSections}
                                    toggleSection={toggleSection}
                                    fieldKeysBySection={fieldKeysBySection}
                                    activeSectionKeyId={activeSectionKeyId}
                                />
                            </>
                        ) : sections.length === 0 ? (
                            <Typography color="text.secondary">
                                No sections added yet
                            </Typography>
                        ) : (
                            <Stack
                                alignItems="center"
                                justifyContent="center"
                                sx={{ height: "100%" }}
                            >
                                <Typography color="text.secondary">
                                    Select a field to edit
                                </Typography>
                            </Stack>
                        )}

                    </Paper>
                </Grid>

            </Grid>

            <FormPreview
                open={showPreview}
                onClose={() => setShowPreview(false)}
                fields={sections}
                productName={productName}
            />

        </Paper>

    );
};

export default LoanFieldBuilder;