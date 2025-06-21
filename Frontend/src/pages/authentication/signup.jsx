import React, { useState } from "react";
import { login } from "../../redux/features/authSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import img from "../../assets/bgMain.png";
import { useFormik } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signUpInitialValues, signUpSchema } from "../../schemas";
import toast, { Toaster } from "react-hot-toast";
import authAPI from "../../apis/authApi";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  const { doSignUp } = authAPI();

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: signUpInitialValues,
      validationSchema: signUpSchema,
      onSubmit: async (values) => {
        try {
          setLoading(true);
          toast.dismiss();
          const data = {
            name: values.name,
            email: values.email,
            password: values.password,
            confirmPassword: values.confirmPassword,
          };
          const res = await doSignUp(data);
          console.log(res);

          if (res.status === 201) {
            toast.success("Signup Successfully!", {
              style: {
                background: "#72A10F",
                color: "#fff",
              },
            });

            setTimeout(() => {
              navigate("/");
            }, 1000);
          }
        } catch (err) {
          toast.error(err?.response?.data?.message || "Server error");
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
              KEEP{" "}
              <span className="bg-gradient-to-br from-green-400 to-green-700 bg-clip-text text-transparent">
                NOTES
              </span>
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mb-4">
              <label
                className="block text-sm font-semibold text-white mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full p-3 pr-10 bg-[#2D3748] text-white rounded-lg border-gray-400 focus:outline-none focus:border-green-400"
                placeholder="Enter Name"
              />
              {errors.name && touched.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

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
                className="w-full p-3 pr-10 bg-[#2D3748] text-white rounded-lg border-gray-400 focus:outline-none focus:border-green-400"
                placeholder="Enter Email"
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-4 relative">
              <label
                className="block text-sm text-white mb-2 font-medium"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full p-3 pr-10 bg-[#2D3748] text-white rounded-lg border-gray-400 focus:outline-none focus:border-green-400"
                placeholder="Enter Password"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-9 text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && touched.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="mb-4 relative">
              <label
                className="block text-sm text-white mb-2 font-medium"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full p-3 pr-10 bg-[#2D3748] text-white rounded-lg border-gray-400 focus:outline-none focus:border-green-400"
                placeholder="Confirm Password"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-9 text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                disabled={loading}
                type="submit"
                className="w-full sm:mt-3 bg-green-600 hover:bg-green-500 text-white font-medium py-3 px-4 rounded-lg transition duration-300"
              >
                {loading ? "Loading..." : "Register"}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                to="/"
                className="text-green-400 font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
