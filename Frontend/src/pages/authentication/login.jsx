import React, { useState } from "react";
import { login } from "../../redux/features/authSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import img from "../../assets/bgMain.png";
import { useFormik } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginInitialValues, loginSchema } from "../../schemas";
import toast, { Toaster } from "react-hot-toast";
import authAPI from "../../apis/authApi";

const { doLogin } = authAPI();

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => setShowPassword(!showPassword);

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
        useFormik({
            initialValues: loginInitialValues,
            validationSchema: loginSchema,
            onSubmit: async (values) => {
                try {
                    setLoading(true);
                      toast.dismiss();
                    
                    const data = {
                        email: values.email,
                        password: values.password,
                    };
                    const res = await doLogin(data);
                    console.log(res);

                    if (res.status === 200) {
                        toast.success("Login Success!", {
                            style: { background: "#4CAF50", color: "#fff" },
                        });
                        setTimeout(() => {
                            const token = res?.data?.data?.token;
                            const id = res?.data?.data?.user?.id;
                            const adminName = res?.data?.data?.user ?.name;
                            dispatch(login({ token, id, adminName }));
                            navigate("/overview");
                        }, 1000);
                    }
                } catch (err) {
                    if (err.response && err.response.status === 401) {
                        toast.error(err.response.data.message);
                    } else {
                        toast.error("Server error");
                    }
                } finally {
                    setLoading(false);
                }
            },
        });

    return (
        <div className="bg-[#1E293B] w-full h-screen">
            <div className="flex flex-row justify-center items-center w-full h-screen">
                <Toaster />
                {/* Left Image Section */}
                <div className="relative w-1/2 hidden lg:block">
                    <img
                        src={img}
                        alt="Admin control panel preview"
                        className="h-screen w-full object-cover"
                    />

                </div>

                {/* Right Form Section */}
                <div className="lg:w-2/3 xl:w-1/2 w-full px-12 xs:px-16 md:px-52 lg:px-56 xl:px-32 pb-14">
                    <div className="flex flex-row gap-x-1 justify-center items-center pb-8">
                        <span className="text-lg xl:text-xl xlx:text-[24px] font-semibold text-white">
                            EVENT{" "}
                            <span className="bg-gradient-to-br from-green-400 to-green-700 bg-clip-text text-transparent">
                                MANAGER
                            </span>
                        </span>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-semibold text-white mb-2"
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="w-full p-3 bg-[#2D3748] text-white border rounded-lg focus:outline-none focus:border-green-400"
                                placeholder="Enter Email"
                            />
                            <div className="min-h-[20px]">
                                {touched.email && errors.email && (
                                    <p className="text-sm text-red-400">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="mb-4 relative">
                            <label
                                className="block text-sm text-white mb-2 font-medium"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className="w-full p-3 pr-10 bg-[#2D3748] text-white rounded-lg border-gray-400 focus:outline-none focus:border-green-400"
                                    placeholder="Enter Password"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <span
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                                    onClick={togglePassword}
                                    role="button"
                                    tabIndex="0"
                                    aria-label="Toggle password visibility"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            togglePassword();
                                        }
                                    }}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            <div className="min-h-[20px]">
                                {touched.password && errors.password && (
                                    <p className="text-sm text-red-400">{errors.password}</p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full sm:mt-3 bg-green-600 hover:bg-green-500 text-white font-medium py-3 px-4 rounded-lg transition duration-300"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin h-6 w-6 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8H4z"
                                            ></path>
                                        </svg>
                                        <span className="ml-2 font-normal">Wait...</span>
                                    </div>
                                ) : (
                                    "Login now"
                                )}
                            </button>
                        </div>
                    </form>
                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-400">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="text-green-400 font-medium hover:underline"
                            >
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
