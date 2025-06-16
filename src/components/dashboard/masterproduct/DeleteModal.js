// components/DeleteModal.js
import { useState } from 'react';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useDispatch, useSelector } from 'react-redux';
import { submitDeleteProduct } from '../../../redux/masterproduct/tableslice/deleteProductSlice';
import RHFTextField from '../../subcompotents/RHFTextField';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from '../../subcompotents/FormProvider';
import Label from '../../subcompotents/Label';
import { useSnackbar } from 'notistack';

const DeleteModal = ({ selectedProduct, setDeleteModal }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [reason, setReason] = useState('');
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.deleteProduct);


  const onSubmit = (data) => {
    dispatch(
      submitDeleteProduct(selectedProduct.id, data.reason, () => {
        setDeleteModal(false);
      }, enqueueSnackbar)
    );
  };


    const onError = (e) => console.log(e)

    const validationSchema = yup.object().shape({
        reason: yup
            .string()
            .required('Reason is required')
            .min(10, 'Reason must be at least 10 characters'),
    });

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {},
    });

    const {
        handleSubmit,
    } = methods


    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl w-96 overflow-hidden animate-scale-in">
                    <div className="p-4 bg-red-50 flex items-start space-x-3">
                        <div className="text-red-500 flex-shrink-0 mt-0.5">
                            <WarningAmberIcon />
                        </div>
                        <div>
                            <h3 className="font-medium text-lg text-red-800">Confirm Delete</h3>
                            <p className="text-red-600 mt-1">This action cannot be undone. Please provide a reason for deletion.</p>
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="mb-2 text-sm text-gray-600">
                            <p className="font-medium">Product Name: {selectedProduct?.productName}</p>
                            <p>Product ID: {selectedProduct?.productId}</p>
                        </div>
                        <div className='mt-4'>
                            <Label>Reason for deletion</Label>
                            <RHFTextField
                                name="reason"
                                multiline
                                rows={3}
                                helperText="Please provide a reason for deletion."
                            />
                        </div>

                    </div>

                    <div className="p-4 flex space-x-3 justify-end bg-white">
                        <button
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            onClick={() => setDeleteModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"

                        >
                            {loading ? 'Deleting...' : 'Delete Product'}
                        </button>
                    </div>
                </div>
            </div>
        </FormProvider>
    );
};

export default DeleteModal;
