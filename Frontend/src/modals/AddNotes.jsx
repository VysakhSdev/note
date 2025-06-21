import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { RiShieldUserFill } from "react-icons/ri";
import { IoIosClose } from "react-icons/io";
import authAPI from "../apis/authApi";
import toast from "react-hot-toast";

const { doCreateNotes, doUpdateNote } = authAPI();

function AddNotes({ closeModal, getData, editData }) {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: editData?.title || "",
      content: editData?.content || "",
    },
    enableReinitialize: true, // to re-populate values when editData changes
    onSubmit: async (values) => {
      setLoading(true);
      const data = {
        title: values.title,
        content: values.content,
      };

      try {
        let res;
        if (editData?._id) {
          res = await doUpdateNote(editData._id, data);
          toast.success("Note updated successfully", { position: "top-center" });
        } else {
          res = await doCreateNotes(data);
          toast.success("Note created successfully", { position: "top-center" });
        }
        getData();
        closeModal();
      } catch (e) {
        console.error(e);
        toast.error(e.response?.data?.message || "Server error", {
          position: "top-center",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg px-16 relative">
        <button
          className="absolute top-4 border hover:bg-slate-50 rounded right-4 text-gray-500 hover:text-gray-800"
          onClick={closeModal}
        >
          <IoIosClose size={20} />
        </button>

        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-[#D8F3DC] flex items-center justify-center mr-4">
            <RiShieldUserFill size={18} className="text-[#72A10F]" />
          </div>
          <div>
            <h2 className="text-[16px] font-semibold text-gray-800">
              {editData ? "Edit Note" : "Add New Note"}
            </h2>
            <p className="text-gray-500 text-[12px]">
              {editData ? "Update your note content" : "Enter details to create a note"}
            </p>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-black text-[14px] mb-1 font-semibold">Title</label>
            <input
              type="text"
              name="title"
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none"
              placeholder="Enter title"
              value={formik.values.title}
              onChange={formik.handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-black text-[14px] mb-1 font-semibold">Content</label>
            <textarea
              name="content"
              className="w-full px-4 py-4 border border-gray-200 rounded-md focus:outline-none"
              placeholder="Enter content"
              value={formik.values.content}
              onChange={formik.handleChange}
            />
          </div>

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
              disabled={loading}
              className="px-6 py-2 bg-[#022213] text-white rounded-md hover:bg-[#72A10F]"
            >
              {loading ? (editData ? "Updating..." : "Adding...") : editData ? "Update Note" : "Add Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddNotes;
