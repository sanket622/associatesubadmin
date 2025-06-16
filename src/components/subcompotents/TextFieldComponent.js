import React from 'react';
import { TextField, MenuItem } from '@mui/material';

const TextFieldComponent = ({
  label,
  name,
  value,
  onChange,
  select = false,
  options = [],
  type = 'text',
  fullWidth = true,
  ...rest
}) => (
  
  <TextField
    size="small"
    select={select}
    label={label}
    name={name}
    value={value}
    onChange={onChange}
    fullWidth={fullWidth}
    type={type}
    variant="outlined"
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
    {...rest}
  >
    {select &&
      options.map(({ id, name }) => (
        <MenuItem key={id} value={id}>
          {name}
        </MenuItem>
      ))}
  </TextField>
);

export default TextFieldComponent;
