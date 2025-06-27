import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';

RHFTextField.propTypes = {
    name: PropTypes.string,
    helperText: PropTypes.node,
};

export default function RHFTextField({ name, helperText, ...other }) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <TextField
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '10px', // <- Add this
                            '&.Mui-focused fieldset': {
                                borderColor: '#0000FF',
                            },
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderRadius: '10px',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: '#0000FF',
                        },
                    }}
                    {...field}
                    fullWidth
                    // value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
                    value={field.value ?? ''}
                    error={!!error}
                    helperText={error ? error?.message : helperText}
                    {...other}
                    size='small'
                    onWheel={e =>
                        e.target instanceof HTMLElement && e.target.blur()
                    }
                    InputLabelProps={{ shrink: true }}
                />
            )}
        />
    );
}
