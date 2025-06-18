import React, { useState } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RHFAutocomplete from '../../../subcompotents/RHFAutocomplete';
import RHFTextField from '../../../subcompotents/RHFTextField';
import { useDispatch } from 'react-redux';
import { submitPaymentCycle } from '../redux/employeronboarding/paymentCycleSlice';

export default function AddPaymentCycle() {
    const [paymentCycles, setPaymentCycles] = useState([{ id: 1 }]);

    const dispatch = useDispatch();

    const methods = useForm({
        defaultValues: {
            contractType: null,
            // Initialize form values for each cycle
            ...paymentCycles.reduce((acc, cycle) => ({
                ...acc,
                [`startDate_${cycle.id}`]: '',
                [`endDate_${cycle.id}`]: '',
                [`paymentTrigger_${cycle.id}`]: '',
                [`payoutDate_${cycle.id}`]: ''
            }), {})
        }
    });

    const contractTypeOptions = [
        { label: 'Monthly Contract', value: 'monthly' },
        { label: 'Quarterly Contract', value: 'quarterly' },
        { label: 'Yearly Contract', value: 'yearly' },
        { label: 'Project Based', value: 'project' }
    ];

    const addPaymentCycle = () => {
        const newCycle = { id: Date.now() };
        setPaymentCycles([...paymentCycles, newCycle]);
    };

    const handleSubmit = (data) => {
        console.log('Form Data:', data);
        // Handle form submission here
    };

    const handleCancel = () => {
        console.log('Form cancelled');
        methods.reset();
    };
    const onSubmit = (data) => {
        const contractTypeId = data.contractType?.value;
        const employerId = '941f60bf-c896-4f7c-8be5-a5d41fad3132'; // Ideally get from route or props

        const cycleDataList = paymentCycles.map((cycle) => ({
            startDate: data[`startDate_${cycle.id}`],
            endDate: data[`endDate_${cycle.id}`],
            payoutDate: data[`payoutDate_${cycle.id}`],
            triggerNextMonth: data[`paymentTrigger_${cycle.id}`] === 'nextMonth',
        }));

        dispatch(submitPaymentCycle(employerId, contractTypeId, cycleDataList, () => {
            methods.reset();
            // Optionally navigate or show custom success UI
        }));
    };

    const onError = (e) => console.log(e)

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', backgroundColor: 'white' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0000FF', textAlign: 'center', marginBottom: '32px' }}>Add Payment Cycle</h1>
                {/* Contract Type - Only appears once at the top */}
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ maxWidth: '400px' }}>
                        <RHFAutocomplete name="contractType" label="Select Contract Type" placeholder="Choose contract type..." options={contractTypeOptions} getOptionLabel={(option) => option.label || ''} isOptionEqualToValue={(option, value) => option.value === value?.value} />
                    </div>
                </div>

                {/* Payment Cycles */}
                {paymentCycles.map((cycle, index) => (
                    <div key={cycle.id} style={{ marginBottom: '32px' }}>
                        {index > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}><h2 style={{ fontSize: '1.125rem', fontWeight: 500, color: '#374151' }}>Payment Cycle {index + 1}</h2><IconButton onClick={() => (cycle.id)} sx={{ color: '#dc2626', '&:hover': { backgroundColor: '#fef2f2' } }}><DeleteIcon /></IconButton></div>
                        )}

                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                                {/* Accrual Date */}
                                <div>
                                    <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '16px' }}>Accrual Date</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <RHFTextField
                                            name={`startDate_${cycle.id}`}
                                            label="Start Date"
                                            type="date"
                                        />
                                        <RHFTextField
                                            name={`endDate_${cycle.id}`}
                                            label="End Date"
                                            type="date"
                                        />
                                    </div>
                                </div>

                                {/* Payment Trigger */}
                                <div>
                                    <Controller
                                        name={`paymentTrigger_${cycle.id}`}
                                        control={methods.control}
                                        render={({ field, fieldState: { error } }) => (
                                            <FormControl component="fieldset" error={!!error}>
                                                <FormLabel component="legend" sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '0.875rem', fontWeight: 400, '&.Mui-focused': { color: '#0000FF' } }}>Payment Trigger</FormLabel>
                                                <RadioGroup {...field} value={field.value || ''} onChange={e => field.onChange(e.target.value)} >
                                                    <FormControlLabel value="thisMonth" control={<Radio sx={{ color: '#0000FF', '&.Mui-checked': { color: '#0000FF' } }} />} label="This Month" />
                                                    <FormControlLabel value="nextMonth" control={<Radio sx={{ color: '#0000FF', '&.Mui-checked': { color: '#0000FF' } }} />} label="Next Month" />
                                                </RadioGroup>
                                            </FormControl>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Payout Date */}
                            <div style={{ marginTop: '24px', maxWidth: '300px' }}>
                                <RHFTextField
                                    name={`payoutDate_${cycle.id}`}
                                    label="Payout Date"
                                    type="date"
                                />
                            </div>
                        </div>

                        {/* Add More Button - Only show after the last section */}
                        {index === paymentCycles.length - 1 && (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                                <Button variant="contained" onClick={addPaymentCycle} sx={{ background: "#0000FF", color: "white", px: 6, py: 1, borderRadius: 2, fontSize: "16px", fontWeight: 500, textTransform: "none", "&:hover": { background: "#0000FF" } }} >
                                    Add More
                                </Button>
                            </div>
                        )}
                        {/* Separator line between sections */}
                        {index < paymentCycles.length - 1 && (
                            <hr style={{ margin: '32px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

                        )}
                    </div>
                ))}

                {/* Bottom Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                    <Button variant="outlined" onClick={handleCancel} sx={{ background: "#0000FF", color: "white", px: 6, py: 1, borderRadius: 2, fontSize: "16px", fontWeight: 500, textTransform: "none", "&:hover": { background: "#0000FF" } }} >
                        Cancel
                    </Button>
                    <Button variant="contained" type="submit" sx={{ background: "#0000FF", color: "white", px: 6, py: 1, borderRadius: 2, fontSize: "16px", fontWeight: 500, textTransform: "none", "&:hover": { background: "#0000FF" } }}   >
                        Add Payment Cycle
                    </Button>
                </div>
            </div>
        </FormProvider>
    );
}