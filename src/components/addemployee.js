import React, { useState } from "react";
import {
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Box,
} from "@mui/material";
import {
  Person,
  Work,
  AccountBalance,
} from "@mui/icons-material";
import AddEmployee from "./dashboard/members/AddEmployee";

const Add = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [dob, setDob] = useState("");
  const [doj, setDoj] = useState("");

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl border p-6 mt-10">
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
        className="border-b"
      >
        <Tab icon={<Person />} iconPosition="start" label="Personal Information" />
        <Tab icon={<Work />} iconPosition="start" label="Employment Details" />
        <Tab icon={<AccountBalance />} iconPosition="start" label="Bank Details" />
      </Tabs>

      {/* PERSONAL INFORMATION */}
      {tabIndex === 0 && (
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <TextField label="First Name" fullWidth size="small" />
          <TextField label="Last Name" fullWidth size="small" />
          <TextField label="Mobile Number" fullWidth size="small" />
          <TextField label="Email Address (optional)" fullWidth size="small" />
          <TextField
            label="Date of Birth (optional)"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />
          <FormControl fullWidth size="small">
            <InputLabel>Marital Status (optional)</InputLabel>
            <Select label="Marital Status (optional)">
              <MenuItem value="Single">Single</MenuItem>
              <MenuItem value="Married">Married</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Gender</InputLabel>
            <Select label="Gender">
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Nationality (optional)</InputLabel>
            <Select label="Nationality (optional)">
              <MenuItem value="Indian">Indian</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField label="PAN Number" fullWidth size="small" />
          <TextField label="Aadhaar Number" fullWidth size="small" />
          <TextField label="Address" fullWidth multiline rows={2} size="small" className="md:col-span-2" />
          <FormControl fullWidth size="small">
            <InputLabel>City</InputLabel>
            <Select label="City">
              <MenuItem value="City1">City1</MenuItem>
              <MenuItem value="City2">City2</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>State</InputLabel>
            <Select label="State">
              <MenuItem value="State1">State1</MenuItem>
              <MenuItem value="State2">State2</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>ZIP Code</InputLabel>
            <Select label="ZIP Code">
              <MenuItem value="123456">123456</MenuItem>
              <MenuItem value="654321">654321</MenuItem>
            </Select>
          </FormControl>
          <Box className="flex justify-end col-span-1 md:col-span-2 mt-4 space-x-2">
            <Button variant="outlined">Cancel</Button>
            <Button variant="contained" sx={{ backgroundColor: "#0000FF" }}>Next</Button>
          </Box>
        </form>
      )}

      {/* EMPLOYMENT DETAILS */}
      {tabIndex === 1 && (
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <TextField label="Employee ID" fullWidth size="small" />
          <TextField
            label="Date of Joining"
            type="date"
            value={doj}
            onChange={(e) => setDoj(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />
          <TextField label="Job Title (optional)" fullWidth size="small" />
          <TextField label="Department (optional)" fullWidth size="small" />
          <FormControl fullWidth size="small" className="md:col-span-2">
            <InputLabel>Select Work Location</InputLabel>
            <Select label="Select Work Location">
              <MenuItem value="Location1">Location1</MenuItem>
              <MenuItem value="Location2">Location2</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Contract Type</InputLabel>
            <Select label="Contract Type">
              <MenuItem value="Full-Time">Full-Time</MenuItem>
              <MenuItem value="Part-Time">Part-Time</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Payment Cycle</InputLabel>
            <Select label="Payment Cycle">
              <MenuItem value="Monthly">Monthly</MenuItem>
              <MenuItem value="Weekly">Weekly</MenuItem>
            </Select>
          </FormControl>
          <Box className="flex justify-end col-span-1 md:col-span-2 mt-4 space-x-2">
            <Button variant="outlined">Cancel</Button>
            <Button variant="contained" sx={{ backgroundColor: "#0000FF" }}>Next</Button>
          </Box>
        </form>
      )}

      {/* BANK DETAILS */}
      {tabIndex === 2 && (
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <TextField label="Name of Account Holder" fullWidth size="small" />
          <TextField label="Account Number" fullWidth size="small" />
          <TextField label="Bank Name" fullWidth size="small" />
          <TextField label="IFSC Code" fullWidth size="small" />
          <Box className="flex justify-end col-span-1 md:col-span-2 mt-4 space-x-2">
            <Button variant="outlined">Cancel</Button>
            <Button variant="contained" sx={{ backgroundColor: "#0000FF" }}>Add</Button>
          </Box>
        </form>
      )}
    </div>
  );
};

export default Add;
