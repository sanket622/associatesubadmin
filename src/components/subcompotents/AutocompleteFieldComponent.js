import React from "react";
import { Autocomplete, TextField } from "@mui/material";

const AutocompleteFieldComponent = ({
  label,
  options = [],
  value,
  onChange,
  fullWidth = true,
  size = "small",
  className = "",
  isMulti = false,
  placeholder = "",
  getOptionLabel = (option) => option?.label || '',
  error = false,
  helperText = '',
}) => {
  return (
    <Autocomplete
      multiple={isMulti}
      options={options}
      value={value || (isMulti ? [] : null)}
      onChange={(_, newValue) => onChange(newValue)}      
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      fullWidth={fullWidth}
      size={size}
      className={className}
      renderInput={(params) => (
        <TextField 
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
        />
      )}
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
    />
  );
};

export default AutocompleteFieldComponent;
