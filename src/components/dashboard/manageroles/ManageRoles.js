import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, IconButton, Pagination, PaginationItem } from '@mui/material';
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Paper,
    CircularProgress,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AssignRoleDialog from './AssignRoleDialog';
import EditAssignRole from './EditAssignRole';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAssociateSubAdmin, fetchAssociateSubAdmins, fetchModulesByRole, fetchRoles, updateAssociateSubAdmin, updateAssociateSubAdminStatus } from '../../../redux/managerole/roleModuleSlice';
import EditIcon from '@mui/icons-material/Edit';
import ActivateModal from './ActivateModal';
import DeactivateModal from './DeactivateModal';
import DeleteModal from './DeleteModal';
import { useSnackbar } from 'notistack';
import { Delete } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const ChevronLeftIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);

const ChevronRightIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
);

const ManageRoles = () => {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [assignRoleOpen, setAssignRoleOpen] = useState(false);
    const [editAssignRoleOpen, setEditAssignRoleOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deactivateModal, setDeactivateModal] = useState(false);
    const [activateModal, setActivateModal] = useState(false);
    const [editForm, setEditForm] = useState({
        userName: '',
        role: null,
        module: [],
        mobile: ''
    });

    const { enqueueSnackbar } = useSnackbar();

    const dispatch = useDispatch();
    const { associateSubAdmins, loading, error, totalCount, totalPages, roles, modules } = useSelector((state) => state.roleModule);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
        dispatch(fetchAssociateSubAdmins(page, rowsPerPage));
    }, [dispatch, page, rowsPerPage]);

    const openDeleteModal = (user) => {
        setSelectedUser(user);
        setDeleteModal(true);
    };

    const openDeactivateModal = (user) => {
        setSelectedUser(user);
        setDeactivateModal(true);
    };

    const openActivateModal = (user) => {
        setSelectedUser(user);
        setActivateModal(true);
    };
    const schema = yup.object().shape({
        userName: yup.string().required('User name is required'),
        role: yup.object().nullable().required('Role is required'),
        module: yup.array().min(1, 'At least one module is required'),
        mobile: yup.string().required('Mobile is required'),
    });

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            userName: '',
            role: null,
            module: [],
            mobile: '',
        },
    });

    const onEditFormSubmit = async (data) => {
        if (!selectedEmployee?.id) {
            enqueueSnackbar('No Sub Admin selected', { variant: 'error' });
            return;
        }
        const payload = {
            name: data.userName,
            mobile: data.mobile,
            role: data.role.id,
            modules: data.module.map((m) => m.id),
        };
        try {
            const result = await dispatch(updateAssociateSubAdmin(selectedEmployee.id, payload));
            if (result?.success === true) {
                enqueueSnackbar('Role updated successfully!', { variant: 'success' });
                setEditAssignRoleOpen(false);
            } else {
                throw new Error(result.payload || 'Update failed');
            }
        } catch (error) {
            enqueueSnackbar(error.message || 'Update error', { variant: 'error' });
        }
    };

    const handleDelete = async () => {
        try {
            const result = await dispatch(deleteAssociateSubAdmin(selectedUser.id));

            if (result?.success === true) {
                enqueueSnackbar('User deleted successfully', { variant: 'success' });
            } else {
                throw new Error(result.payload || 'Failed to delete user');
            }
        } catch (error) {
            enqueueSnackbar(error.message || 'Failed to delete user', { variant: 'error' });
        } finally {
            setDeleteModal(false);
        }
    };

    const updateUserStatus = async (id, isActive) => {
        try {
            const result = await dispatch(updateAssociateSubAdminStatus(id, isActive));

            if (result?.success === true) {
                enqueueSnackbar(`User ${isActive ? 'activated' : 'deactivated'} successfully`, {
                    variant: 'success',
                });
            } else {
                throw new Error(result?.payload || 'Failed to update user status');
            }
        } catch (error) {
            enqueueSnackbar(error?.message || 'Failed to update user status', { variant: 'error' });
        }
    };

    useEffect(() => {
        dispatch(fetchRoles());
    }, [dispatch]);

    const selectedRole = watch('role');


    useEffect(() => {
        if (selectedRole?.id) {
            dispatch(fetchModulesByRole(selectedRole.id));
        }
    }, [selectedRole?.id, dispatch]);

    return (
        <>
            <div className="p-6">
                <h1 className="text-[24px] font-semibold mb-4">Manage Roles</h1>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                    <div className="p-4 flex justify-between items-center">
                        <div className="relative">
                        </div>
                        <div className="mb-4 flex gap-4">
                            <Button
                                startIcon={<PersonAddIcon />}
                                onClick={() => setAssignRoleOpen(true)}
                                variant="contained"
                                sx={{
                                    background: '#0000FF',
                                    color: 'white',
                                    px: 4,
                                    py: 1,
                                    borderRadius: 2,
                                    fontSize: '16px',
                                    fontWeight: 500,
                                    textTransform: 'none',
                                    '&:hover': { background: '#0000FF' },
                                }}
                            >
                                Add Roles
                            </Button>
                        </div>
                    </div>
                    <TableContainer
                        component={Paper}
                        sx={{
                            overflowX: 'auto',
                            borderRadius: 2,
                            '&::-webkit-scrollbar': { height: '8px' },
                            '&::-webkit-scrollbar-thumb': { backgroundColor: '#0000FF', borderRadius: '4px' },
                            '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1' },
                        }}
                    >
                        <Table>
                            <TableHead sx={{ background: '#F5F5FF' }}>
                                <TableRow>
                                    {[
                                        'Sno.',
                                        'Name',
                                        'Email',
                                        'Phone Number',
                                        'Status',   // new
                                        'Edit',
                                        'Delete',   // new
                                    ].map((header) => (
                                        <TableCell key={header} sx={{ fontSize: '14px', color: '#0000FF' }}>
                                            {header}
                                        </TableCell>
                                    ))}

                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center">
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                                ) : error ? (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center" sx={{ color: 'red' }}>
                                            {error}
                                        </TableCell>
                                    </TableRow>
                                ) : !Array.isArray(associateSubAdmins) || associateSubAdmins.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center">
                                            No sub-admins found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    associateSubAdmins.map((emp, index) => (
                                        <TableRow key={emp.id}>
                                            <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                                            <TableCell>{emp.name}</TableCell>
                                            <TableCell>{emp.email}</TableCell>
                                            <TableCell>{emp.mobile}</TableCell>
                                            <TableCell>
                                                <button
                                                    onClick={() =>
                                                        emp.isActive
                                                            ? openDeactivateModal(emp)
                                                            : openActivateModal(emp)
                                                    }
                                                    style={{
                                                        background: emp.isActive ? '#5577FD' : '#22C900',
                                                        color: 'white',
                                                        padding: '4px 8px',
                                                        fontSize: '12px',
                                                        borderRadius: '4px',
                                                        marginLeft: 8,
                                                    }}
                                                >
                                                    {emp.isActive ? 'Deactivate' : 'Activate'}
                                                </button>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    style={{ color: '#0000FF', padding: '6px' }}
                                                    onClick={() => {
                                                        setSelectedEmployee(emp);
                                                        reset({
                                                            userName: emp.name || '',
                                                            role: emp.role ? { id: emp.role.id, label: emp.role.roleName } : null,
                                                            module: emp.modules?.map((m) => ({ id: m.id, label: m.moduleName })) || [],
                                                            mobile: emp.mobile || '',
                                                        });
                                                        setEditAssignRoleOpen(true);
                                                    }}


                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => openDeleteModal(emp)}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>


                        </Table>
                    </TableContainer>

                    <div className="px-6 py-4 flex justify-between items-center bg-white">
                        <div className="flex items-center text-gray-500">
                            <span className="mr-2 text-sm">Rows per page:</span>
                            <select
                                value={rowsPerPage}
                                onChange={(e) => {
                                    setRowsPerPage(Number(e.target.value));
                                    setPage(1); // Reset page on rows per page change
                                }}
                                className="border border-gray-300 rounded px-2 py-1 text-sm"
                            >
                                {[5, 10, 25, 50].map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="text-sm text-gray-500">
                            Showing {(page - 1) * rowsPerPage + 1} to{' '}
                            {Math.min(page * rowsPerPage, totalCount)} out of {totalCount} records
                        </div>
                        <div className="flex items-center space-x-2">
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handleChangePage}
                                size="small"
                                shape="rounded"
                                variant="outlined"
                                renderItem={(item) => (
                                    <PaginationItem
                                        components={{ previous: ChevronLeftIcon, next: ChevronRightIcon }}
                                        {...item}
                                        sx={{
                                            minWidth: 32,
                                            height: 32,
                                            borderRadius: '8px',
                                            fontSize: '0.75rem',
                                            px: 0,
                                            color: item.selected ? '#0000FF' : 'black',
                                            borderColor: item.selected ? '#0000FF' : 'transparent',
                                            '&:hover': { borderColor: '#0000FF', backgroundColor: 'transparent' },
                                            fontWeight: item.selected ? 600 : 400,
                                        }}
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {assignRoleOpen && (
                <AssignRoleDialog open={assignRoleOpen} onClose={() => setAssignRoleOpen(false)} />
            )}

            {editAssignRoleOpen && (
                <EditAssignRole
                    open={editAssignRoleOpen}
                    onClose={() => setEditAssignRoleOpen(false)}
                    control={control}
                    errors={errors}
                    onSubmit={handleSubmit(onEditFormSubmit)}
                    roles={roles}
                    modules={modules}
                />
            )}

            {activateModal && (
                <ActivateModal
                    selectedUser={selectedUser}
                    setActivateModal={setActivateModal}
                    updateUserStatus={updateUserStatus}
                    open={activateModal}
                />
            )}

            {deactivateModal && (
                <DeactivateModal
                    selectedUser={selectedUser}
                    setDeactivateModal={setDeactivateModal}
                    updateUserStatus={updateUserStatus}
                    open={deactivateModal}
                />
            )}

            {deleteModal && (
                <DeleteModal
                    selectedUser={selectedUser}
                    handleDelete={handleDelete}
                    setDeleteModal={setDeleteModal}
                    open={deleteModal}
                />
            )}
        </>
    );
};

export default ManageRoles;
