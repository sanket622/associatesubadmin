import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails } from '../../../../redux/masterproduct/tableslice/productsSlice';
import {
  Box,
  Typography,
  Grid,
  Divider,
  Paper,
  CircularProgress,
  Chip,
} from '@mui/material';



const HIDDEN_KEYS = ['id', 'createdAt', 'updatedAt'];



const formatLabel = (key) =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') return null;

  if (typeof value === 'boolean') return value ? 'Yes' : 'No';

  if (Array.isArray(value)) {
    return value
      .map((item) =>
        typeof item === 'object'
          ? item?.name || item?.purpose || item?.title || ''
          : item
      )
      .filter(Boolean)
      .join(', ');
  }

  if (typeof value === 'object') {
    return (
      value?.name ||
      value?.categoryName ||
      value?.purpose ||
      value?.title ||
      null
    );
  }

  return value;
};

/* -------------------- SECTION -------------------- */

const Section = ({ title, data }) => {
  const fields = Object.entries(data || {})
    .filter(([key]) => !HIDDEN_KEYS.includes(key))
    .map(([key, value]) => ({
      label: formatLabel(key),
      value: formatValue(value),
    }))
    .filter((f) => f.value !== null);

  if (!fields.length) return null;

  return (
    <Box mb={4}>
      <Box
        sx={{
          background: '#EEF2FF',
          py: 1,
          px: 2,
          borderRadius: '8px 8px 0 0',
        }}
      >
        <Typography fontWeight="bold" color="primary">
          {title}
        </Typography>
      </Box>

      <Box px={2}>
        <Grid container spacing={2} py={2}>
          {fields.map(({ label, value }, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Typography variant="body2" fontWeight={600}>
                {label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {value}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};


const FieldsJsonSections = ({ sections }) => {
  if (!sections?.length) return null;

  return (
    <Box mt={4}>
      <Box
        sx={{
          background: '#EEF2FF',
          py: 1,
          px: 2,
          mb: 2,
          borderRadius: '8px 8px 0 0',
        }}
      >
        <Typography fontWeight="bold" color="primary">
          Fields Added Details
        </Typography>
      </Box>
      {sections?.map((section, index) => (
        <Box
          key={index}
          mb={3}
          sx={{
            border: '1px solid #E5E7EB',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >

          <Box
            sx={{
              background: '#EEF2FF',
              px: 2,
              py: 1,
            }}
          >
            <Typography fontWeight={600}>
              {section.title || 'Untitled Section'}
            </Typography>
          </Box>


          <Box px={2} py={2}>
            <Grid container spacing={2}>


              <Grid item xs={12} sm={4}>
                <Typography variant="body2" fontWeight={600}>
                  Section Key
                </Typography>
                <Typography variant="body2">
                  {section.sectionKey}
                </Typography>
              </Grid>

              {section.description && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    {section.description}
                  </Typography>
                </Grid>
              )}

              <Grid item xs={12} sm={4}>
                <Typography variant="body2" fontWeight={600}>
                  Required
                </Typography>
                <Typography variant="body2">
                  {section.required ? 'Yes' : 'No'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="body2" fontWeight={600}>
                  Collapsible
                </Typography>
                <Chip
                  size="small"
                  label={section.collapsible ? 'Yes' : 'No'}
                  color={section.collapsible ? 'primary' : 'default'}
                />
              </Grid>


              {!section.fields?.length && (
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontStyle="italic"
                  >
                    No fields defined in this section
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </Box>
      ))}
    </Box>
  );
};


/* -------------------- MAIN -------------------- */

const ViewProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    productDetails,
    productDetailsLoading,
    productDetailsError,
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  if (productDetailsLoading) {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (productDetailsError) {
    return <Typography color="error">{productDetailsError}</Typography>;
  }

  if (!productDetails) return null;

  const { MasterProductFields, ...rest } = productDetails;

  const primitiveData = {};
  const objectSections = {};

  Object.entries(rest).forEach(([key, value]) => {
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      if (!HIDDEN_KEYS.includes(key)) primitiveData[key] = value;
    } else {
      objectSections[key] = value;
    }
  });

  return (
    <Box p={{ xs: 1, md: 2 }} maxWidth={1000}>
      <Paper elevation={3} sx={{ borderRadius: 3, p: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          View Master Product
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Section title="General Information" data={primitiveData} />

        {Object.entries(objectSections).map(([key, value]) => (
          <Section
            key={key}
            title={formatLabel(key)}
            data={Array.isArray(value) ? value[0] : value}
          />
        ))}

        {/* 🔥 Fields JSON Data */}
        <FieldsJsonSections
          sections={MasterProductFields?.fieldsJsonData}
        />
      </Paper>
    </Box>
  );
};

export default ViewProduct;
