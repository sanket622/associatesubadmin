import React, {  useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import logo from '../../assets/earnlogo.png'
import { Button, IconButton, InputAdornment, TextField } from '@mui/material';
import backgroundimg from '../../assets/1.png'

const NewPassword = () => {

    const navigate = useNavigate();

    const location = useLocation();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const otpValue = location?.state?.otpValue || null;
    const email = location?.state?.email || "";
    const user_type = location?.state?.user_type
    const [bgIndex, setBgIndex] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    // const handleSubmit = async (e) => {
    //     e.preventDefault();


    //     if (newPassword !== confirmPassword) {
    //         Swal.fire({
    //             icon: 'warning',
    //             title: 'Passwords Do Not Match',
    //             text: 'Please ensure that the new password and confirm password fields match.',
    //         });
    //         return;
    //     }


    //     if (newPassword.length < 6) {
    //         Swal.fire({
    //             icon: 'warning',
    //             title: 'Password Too Short',
    //             text: 'Your new password must be at least 6 characters long.',
    //         });
    //         return;
    //     }

    //     try {
    //         setLoading(true);

    //         const response = await axios.put(
    //             PasswordResetAPIView,
    //             {
    //                 otp: otpValue,
    //                 email: email,
    //                 new_password: newPassword,
    //                 user_type: user_type,

    //             }
    //         );

    //         if (response.status === 200) {
    //             Swal.fire({
    //                 icon: 'success',
    //                 title: 'Password Updated',
    //                 text: 'Your password has been successfully updated.',
    //             });

    //             navigate('/login');


    //             setNewPassword('');
    //             setConfirmPassword('');
    //         }
    //     } catch (error) {
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Update Failed',
    //             text: error.response?.data?.message || 'An error occurred while updating your password.',
    //         });
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    return (
        <div
        className=" flex items-center justify-center bg-cover bg-center"
        style={{
            backgroundImage: `url(${backgroundimg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',        
            width: '100%',
            height: '100vh',
          }}              
    >
        <div className="absolute top-4 left-4 z-10">

            <img src={logo} alt="Logo" className="w-[178px] h-auto" />
        </div>

        <div className="w-full h-screen flex items-center justify-end px-4   ">
            {/* Right side for Login Form */}
            <div className="w-[631px] h-[682px] md:px-10 md:mr-10 bg-white bg-opacity-25 backdrop-blur-[34px] p-5 rounded-2xl shadow-lg flex justify-center flex-col">
                <h1 className="md:text-[32px] text-xl font-bold text-[#0000FF] text-center mb-4 ">Create Your Password</h1>
                <p className="text-[20px] text-center">Set up your password to get started.</p>

                <form className="grid grid-cols-1 gap-4 mt-10" >
                   

                    <div>
                        <label className="block font-medium mb-1">Create Password</label>
                        <TextField
                            fullWidth
                            placeholder="Enter Your Password"
                            size="small"                           
                            required
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            sx={{
                                backgroundColor: '#fff', 
                                borderRadius: '4px',     
                            }}
                            InputProps={{
                                style: {
                                    backgroundColor: '#fff', 
                                },
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Confirm Password</label>
                        <TextField
                            fullWidth
                            placeholder="Enter Your Password"
                            size="small"                           
                            required
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            sx={{
                                backgroundColor: '#fff', 
                                borderRadius: '4px',     
                            }}
                            InputProps={{
                                style: {
                                    backgroundColor: '#fff', 
                                },
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>

                    <div className="flex justify-center mt-4">
                         
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth={false}

                            sx={{
                                background: '#0000FF',
                                color: 'white',
                                px: 12,
                                py: 1.5,
                                borderRadius: 2,
                                fontsize:'16px',
                                fontWeight: 500,
                                textTransform: 'none',
                                '&:hover': {
                                    background: '#0000FF',
                                },
                            }}
                        >
                            Login
                        </Button>
                    </div>
                </form>


                {/* <div className="text-right mt-2">
                    <button onClick={() => navigate("/forgetpassword")} className="text-[#00B251]  md:text-md">
                        Forgot password?
                    </button>
                </div> */}

                <div className="flex items-center justify-center space-x-2 mt-10">
                    <p className=" text-[#838383] text-[14px]">Don’t have an account? </p>
                    <button onClick={() => navigate("/contact")} className="text-[#0000FF] text-[14px] font-semibold">
                        Contact us 
                    </button>
                </div>
            </div>
        </div>
    </div>
    );
};

export default NewPassword;
