
import { Grid, Box, Button, RadioGroup, Radio, FormControlLabel, Paper } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import FormProvider from '../../../subcompotents/FormProvider';
import RHFAutocomplete from '../../../subcompotents/RHFAutocomplete';
import Label from '../../../subcompotents/Label';
import { createMasterProductFields } from '../../../../redux/masterproduct/productFields/productFieldsSlice';


const SAMPLE_CATEGORIES = [
    {
        id: '0600c43b-3490-432d-a537-ba5edf004998',
        name: 'KYC',
    },
    {
        id: '1c2a5d22-55ac-4f64-9b65-8bcb12f00111',
        name: 'BANKING',
    },
];

const SAMPLE_FIELDS = [
    {
        id: 'ce19959d-1dc6-4288-8b05-bfe892da5bbd',
        name: 'PAN Number',
    },
    {
        id: 'fb609bf7-d11e-4b42-b33d-7168dcbbdce8',
        name: 'Aadhaar Number',
    },
    {
        id: '3a1f9f92-22d1-4c55-9c45-21a5bb1dcb01',
        name: 'Bank Statement',
    },
];



const schema = yup.object({
    categoryId: yup.object().required('Category is required'),
    fieldIds: yup.array().min(1, 'Select at least one field').required(),
    isRequired: yup.string().oneOf(['yes', 'no']).required(),
});

const AddFields = () => {
    const dispatch = useDispatch();


    const reduxState = useSelector((state) => state.productFields);


    const categories = reduxState?.categories?.length
        ? reduxState.categories
        : SAMPLE_CATEGORIES;

    const fields = reduxState?.fields?.length
        ? reduxState.fields
        : SAMPLE_FIELDS;

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            categoryId: null,
            fieldIds: [],
            isRequired: 'yes',
        },
    });

    const { handleSubmit, control } = methods;

    const onSubmit = (data) => {
        const payload = {
            masterProductId: localStorage.getItem('createdProductId'),
            categoryId: data.categoryId.id,
            fieldIds: data.fieldIds.map((f) => f.id),
            isRequired: data.isRequired === 'yes',
        };



        dispatch(createMasterProductFields(payload));
    };

    return (
        <Box
            sx={{
                display: 'flex',
                // flexWrap: 'wrap',
                '& > :not(style)': {
                    m: 1,
                    width: '100%',
                    padding: 2,
                    // height: 128,
                },
            }}
        >

            <Paper elevation={3}>
                 <h1 className="text-[24px] font-semibold mb-5">Add Fields</h1>
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <Label>Select Screen Name</Label>
                            <RHFAutocomplete
                                name="categoryId"
                                options={categories}
                                getOptionLabel={(o) => o?.name || ''}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Label>Select Field Name</Label>
                            <RHFAutocomplete
                                name="fieldIds"
                                multiple
                                options={fields}
                                getOptionLabel={(o) => o?.name || ''}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Label>Is Required</Label>
                            <Controller
                                name="isRequired"
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup {...field} row>
                                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                        <FormControlLabel value="no" control={<Radio />} label="No" />
                                    </RadioGroup>
                                )}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'end', mt: 4 }}>
                        <Button type="submit" variant="contained" disabled={!methods.watch('fieldIds')?.length}>
                            Save
                        </Button>
                    </Box>
                </FormProvider>
            </Paper>
        </Box>
    );
};

export default AddFields;
