import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import RHFAutocomplete from '../../../subcompotents/RHFAutocomplete';
import RHFTextField from '../../../subcompotents/RHFTextField';
import { useDispatch, useSelector } from 'react-redux';
import { submitPaymentCycle, fetchContractTypes } from '../redux/employeronboarding/paymentCycleSlice';
import { useParams } from 'react-router-dom';
import FormProvider from '../../../subcompotents/FormProvider';
import Label from '../../../subcompotents/Label';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';


// ✅ Yup Schema
const schema = yup.object().shape({
    contractType: yup.object().required('Contract Type is required'),
    startDate_1: yup.string().required('Start date is required'),
    endDate_1: yup.string().required('End date is required'),
    paymentTrigger_1: yup.string().required('Payment trigger is required'),
    payoutDate_1: yup.string().required('Payout date is required'),
});

export default function AddPaymentCycle() {
    const dispatch = useDispatch();
    const { employerId } = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        if (employerId) {
            dispatch(fetchContractTypes(employerId));
        }
    }, [employerId, dispatch]);

    const contractTypeOptions = useSelector(
        (state) => state.paymentCycle.contractTypes || []
    );

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            contractType: null,
            startDate_1: '',
            endDate_1: '',
            paymentTrigger_1: '',
            payoutDate_1: ''
        }
    });

    const { handleSubmit } = methods;
    
    const onSubmit = (data) => {
        const contractTypeId = data.contractType?.value;

        const cycleDataList = [
            {
                startDate: data[`startDate_1`],
                endDate: data[`endDate_1`],
                payoutDate: data[`payoutDate_1`],
                triggerNextMonth: data[`paymentTrigger_1`] === 'nextMonth',
            }
        ];

        dispatch(submitPaymentCycle(employerId, contractTypeId, cycleDataList, () => {
            methods.reset();
        }));
    };

    const onError = (errors) => {
        console.log("Validation Errors:", errors);
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
            <div className="max-w-[1200px] mx-auto p-6 bg-white">
                <h1 className="text-2xl font-semibold text-[#0000FF] text-center mb-8">Add Payment Cycle</h1>

                {/* Contract Type Dropdown */}
                <div className="mb-8">
                    <div className="max-w-md">
                        <Label>Select Contract Type</Label>
                        <RHFAutocomplete
                            name="contractType"
                            placeholder="Choose contract type..."
                            options={contractTypeOptions}
                            getOptionLabel={(option) => option?.label || ''}
                            isOptionEqualToValue={(option, value) => option?.value === value?.value}
                        />
                    </div>
                </div>

                {/* Static Payment Cycle */}
                <div className="mb-8 border border-gray-200 rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-700 mb-4">Payment Cycle</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                        <div>
                            <Label>Start Date</Label>
                            <RHFTextField name="startDate_1" type="date" />
                        </div>

                        <div>
                            <Label>End Date</Label>
                            <RHFTextField name="endDate_1" type="date" />
                        </div>

                        <div>
                            <Label>Payment Trigger</Label>
                            <Controller
                                name="paymentTrigger_1"
                                control={methods.control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <RadioGroup
                                            row
                                            {...field}
                                            value={field.value || ''}
                                            onChange={e => field.onChange(e.target.value)}
                                        >
                                            <FormControlLabel value="thisMonth" control={<Radio sx={{ color: '#0000FF', '&.Mui-checked': { color: '#0000FF' } }} />} label="This Month" />
                                            <FormControlLabel value="nextMonth" control={<Radio sx={{ color: '#0000FF', '&.Mui-checked': { color: '#0000FF' } }} />} label="Next Month" />
                                        </RadioGroup>
                                        {fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
                                    </>
                                )}
                            />
                        </div>
                    </div>

                    {/* Payout Date */}
                    <div className="mt-6 max-w-sm">
                        <Label>Payout Date</Label>
                        <RHFTextField name="payoutDate_1" type="date" />
                    </div>
                </div>

                {/* Bottom Buttons */}
                <div className="flex justify-between mt-12 pt-6 border-t border-gray-200">
                    <Button
                        variant="outlined"
                        sx={{
                            background: "#0000FF",
                            color: "white",
                            px: 6,
                            py: 1,
                            borderRadius: 2,
                            fontSize: "16px",
                            fontWeight: 500,
                            textTransform: "none",
                            "&:hover": { background: "#0000FF" }
                        }}
                        onClick={() => {
                            methods.reset();
                            navigate(-1); 
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        type="submit"
                        sx={{ background: "#0000FF", color: "white", px: 6, py: 1, borderRadius: 2, fontSize: "16px", fontWeight: 500, textTransform: "none", "&:hover": { background: "#0000FF" } }}
                    >
                        Add Payment Cycle
                    </Button>
                </div>
            </div>
        </FormProvider>
    );
}
