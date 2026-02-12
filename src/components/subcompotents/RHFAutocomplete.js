// form/RHFAutocomplete.jsx
import { Controller, useFormContext } from 'react-hook-form';
import { Autocomplete, TextField } from '@mui/material';

export default function RHFAutocomplete({
  name,
  label,
  placeholder,
  helperText,
  require,
  onChangeCallback,
  multiple = false,
  options = [],
  ...other
}) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...other}
          {...field}
          multiple={multiple}
          options={options || []}
          openOnFocus
          autoComplete
          size="small"
          value={field.value ?? (multiple ? [] : null)}
          onChange={(_, newValue) => {
            setValue(name, newValue, { shouldValidate: true });
            onChangeCallback?.(newValue);
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': { borderColor: '#0000FF' },
              '& .MuiOutlinedInput-notchedOutline': { borderRadius: '10px' },
            },
            '& .MuiInputLabel-root.Mui-focused': { color: '#084E77' },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label={label}
              placeholder={placeholder}
              error={!!error}
              helperText={error ? error.message : helperText}
              required={require === 'true'}
            />
          )}
        />
      )}
    />
  );
}
