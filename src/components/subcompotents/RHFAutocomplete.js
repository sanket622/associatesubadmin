
// form
import { Controller, useFormContext } from 'react-hook-form';

import { Autocomplete, ListItemText, TextField } from '@mui/material';

// ----------------------------------------------------------------------

export default function RHFAutocomplete({ name, label, placeholder, helperText, require, onChangeCallback, ...other }) {
    const { control, setValue } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <Autocomplete
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                                borderColor: '#0000FF',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderRadius: '10px',
                            },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: '#0000FF',
                        },
                    }}
                    size='small'
                    openOnFocus
                    autoComplete
                    {...field}
                    value={field?.value || null}
                    onChange={(event, newValue) => {
                        setValue(name, newValue, { shouldValidate: true })
                        if (onChangeCallback && typeof onChangeCallback === "function") {
                            onChangeCallback(newValue)
                        }
                    }}
                    renderInput={(params) => (
                        <TextField
                            size='small'
                            label={label}
                            placeholder={placeholder}
                            error={!!error}
                            helperText={error ? error?.message : helperText}
                            {...params}
                            required={require === 'true'}
                        />
                    )}
                    {...other}
                />
            )}
        />
    );
}
