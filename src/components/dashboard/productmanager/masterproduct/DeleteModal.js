import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useDispatch, useSelector } from 'react-redux';
import RHFTextField from '../../../subcompotents/RHFTextField';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from '../../../subcompotents/FormProvider';
import Label from '../../../subcompotents/Label';
import { useSnackbar } from 'notistack';
import axios from 'axios';

const DeleteModal = ({
    type = 'PRODUCT', // 'PRODUCT' | 'VARIANT'
    selectedItem,
    selectedItemName,
    setDeleteModal,
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.deleteProduct || {});

    /* ===================== VALIDATION ===================== */
    const validationSchema = yup.object().shape({
        reason: yup
            .string()
            .required('Reason is required')
            .min(10, 'Reason must be at least 10 characters'),
    });

    const methods = useForm({
        resolver: yupResolver(validationSchema),
    });

    const { handleSubmit } = methods;

    /* ===================== SUBMIT ===================== */
    const onSubmit = async (data) => {
        const accessToken = localStorage.getItem('accessToken');

        try {
            let url = '';
            let payload = {};

            if (type === 'PRODUCT') {
                url =
                    '/associate/masterProductDeleteRequest/submitMasterProductDeleteRequest';
                payload = {
                    masterProductId: selectedItem?.id,
                    reason: data.reason,
                };
            }

            if (type === 'VARIANT') {
                url =
                    '/associate/variantProductDeleteRequest/submitVariantProductDeleteRequest';
                payload = {
                    variantProductId: selectedItem?.id,
                    reason: data.reason,
                };
            }

            await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}${url}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            enqueueSnackbar(
                `${type === 'PRODUCT' ? 'Product' : 'Variant'} delete request submitted successfully!`,
                { variant: 'success' }
            );
            setDeleteModal(false);
        } catch (error) {
            enqueueSnackbar(
                error?.response?.data?.message || 'Delete request failed',
                { variant: 'error' }
            );
        }
    };

    /* ===================== UI ===================== */
    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl w-96 overflow-hidden">
                    {/* HEADER */}
                    <div className="p-4 bg-red-50 flex items-start space-x-3">
                        <div className="text-red-500">
                            <WarningAmberIcon />
                        </div>
                        <div>
                            <h3 className="font-medium text-lg text-red-800">
                                Confirm Delete
                            </h3>
                            <p className="text-red-600 mt-1">
                                This action cannot be undone. Please provide a reason.
                            </p>
                        </div>
                    </div>

                    {/* BODY */}
                    <div className="p-4">
                        {type === 'PRODUCT' && (
                            <div className="mb-2 text-sm text-gray-600">
                                <p className="font-medium">Product Name: {selectedItem.productName}</p>
                            </div>
                        )}

                        {type === 'VARIANT' && (
                            <div className="mb-2 text-sm text-gray-600">
                                <p className="font-medium">Variant Name: {selectedItem?.variantName}</p>
                                {/* <p>Variant Code: {selectedItem?.variantCode}</p> */}
                            </div>
                        )}

                        <div className="mt-4">
                            <Label>Reason for deletion</Label>
                            <RHFTextField
                                name="reason"
                                multiline
                                rows={3}
                                helperText="Please provide a reason for deletion."
                            />
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="p-4 flex justify-end space-x-3">
                        <button
                            type="button"
                            className="px-4 py-2 text-sm border rounded-md"
                            onClick={() => setDeleteModal(false)}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
                        >
                            {loading ? 'Deleting...' : 'Confirm Delete'}
                        </button>
                    </div>
                </div>
            </div>
        </FormProvider>
    );
};

export default DeleteModal;
