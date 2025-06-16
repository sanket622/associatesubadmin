import React from 'react';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const ActivateModal = ({ selectedUser, setActivateModal, updateUserStatus }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 overflow-hidden animate-scale-in">
        <div className="p-4 bg-green-50 flex items-start space-x-3">
          <div className="text-green-500 flex-shrink-0 mt-0.5">
            <WarningAmberIcon />
          </div>
          <div>
            <h3 className="font-medium text-lg text-green-700">Confirm Activation</h3>
            <p className="text-green-600 mt-1">Are you sure you want to Activate this user? They will access to the system.</p>
          </div>
        </div>

        <div className="p-4 flex justify-between bg-gray-50">
          <div className="text-sm text-gray-600">
            <p className="font-medium">Name: {selectedUser?.name}</p>
            <p>Email: {selectedUser?.email}</p>
            
          </div>
        </div>

        <div className="p-4 flex space-x-3 justify-end bg-white">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
            onClick={() => setActivateModal(false)}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              updateUserStatus(selectedUser.id, true);
              setActivateModal(false);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none "
          >
            Activate User
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivateModal;
