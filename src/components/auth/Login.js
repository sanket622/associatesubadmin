import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/auth/authSlice";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import logo from '../../assets/earnlogo.png';
import backgroundimg from './1.png';
import { Button, IconButton, InputAdornment } from "@mui/material";
import { useSnackbar } from 'notistack';
import TextFieldComponent from "../subcompotents/TextFieldComponent";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const auth = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (auth?.accessToken) {
      navigate("/home");
    }
  }, [auth?.accessToken, navigate]);

  useEffect(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
  }, []);

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data.email, data.password));
  
    if (result?.success === true) {
      enqueueSnackbar("Login successful!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      navigate("/home");
    } else {
      enqueueSnackbar(result?.payload?.message || "Login failed or Invalid Credentials!", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
    }
  };
  
  return (
    <div
      className="flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundimg})`,
        height: "100vh",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
      }}
    >
      <div className="w-full h-screen flex items-center justify-end px-4">
        <div className="relative w-[600px] h-[673px] md:px-10 md:mr-10 bg-white p-5 rounded-2xl shadow-lg flex justify-center flex-col">
          <div className="absolute top-6 left-4 z-20">
            <img src={logo} alt="Logo" className="w-[140px] h-auto" />
          </div>

          <div className="mb-4">
            <span className="text-[#535353] text-[18px]">Welcome to</span>
            <span className="font-semibold ml-1 text-[#535353] text-[18px]">
              EarnPlus
            </span>
          </div>

          <h1 className="md:text-[32px] text-xl font-bold text-[#000] mb-4">
            Get started with your Email
          </h1>
          <h1 className="md:text-[32px] text-xl font-bold text-[#000] mb-4">
            & Password
          </h1>

          <form
            className="grid grid-cols-1 gap-4 mt-10"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Email */}
            <div>
              <label className="block font-medium mb-1">Email ID</label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextFieldComponent
                    placeholder="Enter Your Email ID"
                    {...field}
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-medium mb-1">Password</label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextFieldComponent
                    placeholder="Enter Your Password"
                    {...field}
                    type={showPassword ? "text" : "password"}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? (
                              <AiOutlineEyeInvisible />
                            ) : (
                              <AiOutlineEye />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </div>

            {/* Submit */}
            <div className="flex justify-center mt-4">
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={auth.loading}
                sx={{
                  background: "#0000FF",
                  color: "white",
                  px: 12,
                  py: 1,
                  borderRadius: 2,
                  fontSize: "16px",
                  fontWeight: 500,
                  textTransform: "none",
                  "&:hover": { background: "#0000FF" },
                }}
              >
                {auth.loading ? "Logging In..." : "Log In"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
