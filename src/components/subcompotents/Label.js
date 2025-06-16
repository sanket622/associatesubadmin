import React from 'react';
import { Typography, Tooltip } from '@mui/material';

const Label = ({ htmlFor, children, maxLength = 30 }) => {
  const isString = typeof children === 'string';
  const isLong = isString && children.length > maxLength;

  const displayText = isLong ? children.slice(0, maxLength) + '...' : children;

  const labelTypography = (
    <Typography
      component="label"
      htmlFor={htmlFor}
      variant="subtitle2"
      fontWeight={450}
      mb={0.5}
      display="block"
      fontSize={15}
      sx={{
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {displayText}
    </Typography>
  );

  return isLong ? (
    <Tooltip title={children}>
      {labelTypography}
    </Tooltip>
  ) : (
    labelTypography
  );
};

export default Label;
