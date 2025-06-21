import React from "react";
import { IoIosClose } from "react-icons/io";
import { RiShieldUserFill } from "react-icons/ri";
import { useFormik } from "formik";
import authAPI from "../apis/authApi"; 
import toast from "react-hot-toast";

const { doShareNote } = authAPI();

const ShareNotes = ({ closeModal, noteId }) => {
const formik = useFormik({
  initialValues: {
    email: "",
    permission: "read",
  },
  onSubmit: async (values, { resetForm }) => {
    try {
      const res = await doShareNote({
        noteId, 
        email: values.email,
        permission: values.permission,
      });

      console.log(res, "res");
      toast.success(res?.data?.data?.message || "Note shared successfully!");
      closeModal(); 
      resetForm();
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.message || "Failed to share the note."
      );
    }
  },
});


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg px-16 relative">
        {/* Close Button */}
        <button
          className="absolute top-4 border hover:bg-slate-50 rounded right-4 text-gray-500 hover:text-gray-800"
          onClick={closeModal}
        >
          <IoIosClose size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-[#D8F3DC] flex items-center justify-center mr-4">
            <RiShieldUserFill size={18} className="text-[#72A10F]" />
          </div>
          <div>
            <h2 className="text-[16px] font-semibold text-gray-800">
              Share Note
            </h2>
            <p className="text-gray-500 text-[12px]">Add collaborator access</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="relative">
            <label className="block text-black text-[14px] mb-1 font-semibold">
              Collaborator Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none"
              placeholder="Enter collaborator's email"
              value={formik.values.email}
              onChange={formik.handleChange}
              required
            />
          </div>

          {/* Permission Select */}
         <div className="relative">
  <label htmlFor="permission" className="block text-black text-[14px] mb-1 font-semibold">
    Permission
  </label>
  <select
    id="permission"
    name="permission"
    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none"
    value={formik.values.permission}
    onChange={formik.handleChange}
  >
    <option value="read">Read</option>
    <option value="write">Write</option>
  </select>
</div>


          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              className="px-6 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-red-500 hover:text-white"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#022213] text-white rounded-md hover:bg-[#72A10F]"
            >
              Share
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShareNotes;
