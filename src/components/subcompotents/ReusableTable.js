
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    TextField,
    Button,
    Typography,
    CircularProgress,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useEffect } from 'react';

const ReusableTable = ({
    title,
    columns,
    data,
    loading,
    error,
    showSearch,
    searchValue = '',
    onSearchChange,
    showFilter,
    onFilterClick,
    footerText = '',

    headerActions,

    page,
    rowsPerPage,
    totalPages,
    totalCount,
    onPageChange,
    onRowsPerPageChange,
}) => {

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (error) {
            enqueueSnackbar(
                typeof error === 'string' ? error : 'Something went wrong',
                { variant: 'error' }
            );
        }
    }, [error, enqueueSnackbar]);


    return (
        <>

            <Box
                display="flex"
                flexDirection={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                justifyContent="space-between"
                gap={1.5}
                mb={2}
            >

                <Typography variant="h6" fontWeight={600} sx={{
                    fontFamily: '"Open Sans", sans-serif',
                }}
                >
                    {title}
                </Typography>

                <Box
                    display="flex"
                    flexDirection={{ xs: 'column', sm: 'row' }}
                    alignItems="stretch"
                    gap={1}
                    width={{ xs: '100%', sm: 'auto' }}
                >

                    {showSearch && (
                        <TextField
                            size="small"
                            placeholder="Search"
                            value={searchValue}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon fontSize="small" />,
                            }}
                        />
                    )}

                    {showFilter && (
                        <Button
                            variant="outlined"
                            startIcon={<FilterAltOutlinedIcon />}
                            sx={{ textTransform: 'none' }}
                            onClick={onFilterClick}
                        >
                            Filter
                        </Button>
                    )}


                    {headerActions}
                </Box>
            </Box>


            <TableContainer component={Paper} sx={{
                overflowX: 'auto',
                borderRadius: 2,
                '&::-webkit-scrollbar': { height: '8px' },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#084E77', borderRadius: '4px' },
                '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1' },
            }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#084E770A', fontWeight: '800' }}>
                        <TableRow>
                            {columns?.map((col) => (
                                <TableCell
                                    key={col.key}
                                    align={col.align || 'left'}
                                    sx={{ fontSize: '14px', fontWeight: '500', color: '#084E77' }}
                                >
                                    {col.label}
                                </TableCell>
                            ))}
                            {/* {renderActions && (
                                <TableCell sx={{ fontSize: '13px', fontWeight: 600, color: '#0000FF' }}>
                                    Action12
                                </TableCell>
                            )} */}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns?.length} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        )
                            :

                            error ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center" style={{ color: 'red' }}>{error}</TableCell>
                                </TableRow>
                            ) :

                                !data || data?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} align="center">
                                            No data available
                                        </TableCell>
                                    </TableRow>
                                )
                                    :

                                    (

                                        data?.map((row, index) => (
                                            <TableRow key={index}>
                                                {columns?.map((col) => (
                                                    <TableCell key={col.key} align={col.align || 'left'}>
                                                        {col.render
                                                            ? col.render(row[col.key], row, index)
                                                            : row[col.key] ?? '-'}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    )}
                    </TableBody>

                </Table>
            </TableContainer>


            {
                data?.length > 0 && page && rowsPerPage && totalCount && (
                    <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                        <span style={{ fontSize: 12, color: '#084E77', fontWeight: '600' }}>
                            Showing {(page - 1) * rowsPerPage + 1} to{" "}
                            {Math.min(page * rowsPerPage, totalCount)} out of {totalCount}
                        </span>

                        <Box display="flex" alignItems="center" gap={1}>
                            <IconButton
                                size="small"
                                disabled={page === 1}
                                onClick={() => onPageChange(page - 1)}
                            >
                                <ChevronLeftIcon fontSize="small" />
                            </IconButton>

                            <Button
                                variant="contained"
                                size="small"
                                sx={{ minWidth: 40, background: 'var(--table-btn)', }}
                            >
                                {page}/{totalPages}
                            </Button>

                            <IconButton
                                size="small"
                                disabled={page === totalPages}
                                onClick={() => onPageChange(page + 1)}
                            >
                                <ChevronRightIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                )
            }


        </>
    );
};

export default ReusableTable;
