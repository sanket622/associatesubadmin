import React from 'react';
import {
  Button, Dialog, DialogContent, IconButton
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Controller } from 'react-hook-form';
import AutocompleteFieldComponent from '../../subcompotents/AutocompleteFieldComponent';
import TextFieldComponent from '../../subcompotents/TextFieldComponent';

const EditAssignRole = ({ open, onClose, control, errors, onSubmit, roles, modules }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogContent sx={{ padding: 0 }}>
        <div className="mx-auto bg-white rounded-lg shadow-sm">
          <div className="flex items-center p-4 border-b border-gray-100 bg-[#F9F9FF]">
            <IconButton onClick={onClose} size="small">
              <ArrowBack className="text-[#0000FF]" />
            </IconButton>
            <h1 className="text-lg font-medium text-gray-900 ml-2">Edit Assign Role</h1>
          </div>

          <form onSubmit={onSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
              <Controller
                name="userName"
                control={control}
                render={({ field }) => (
                  <TextFieldComponent
                    {...field}
                    placeholder="Enter User Name"
                    error={!!errors.userName}
                    helperText={errors.userName?.message}
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role Type</label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <AutocompleteFieldComponent
                    {...field}
                    options={roles.map((r) => ({ id: r.id, label: r.roleName }))}
                    placeholder="Select Role"
                    error={!!errors.role}
                    helperText={errors.role?.message}
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Define Module</label>
              <Controller
                name="module"
                control={control}
                render={({ field }) => (
                    <AutocompleteFieldComponent
                    {...field}
                    options={modules.map((m) => ({ id: m.id, label: m.moduleName }))}
                    placeholder="Select Module"
                    isMulti
                    error={!!errors.module}
                    helperText={errors.module?.message}
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <Controller
                name="mobile"
                control={control}
                render={({ field }) => (
                  <TextFieldComponent
                    {...field}
                    placeholder="Enter Mobile No."
                    error={!!errors.mobile}
                    helperText={errors.mobile?.message}
                  />
                )}
              />
            </div>

            <Button
              type="submit"
              startIcon={<PersonAddIcon />}
              fullWidth
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
              Update Role
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditAssignRole;
