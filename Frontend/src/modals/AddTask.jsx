import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import toast, { Toaster } from 'react-hot-toast';
import { RiShieldUserFill } from "react-icons/ri";
import { IoIosClose } from "react-icons/io";
import PropTypes from 'prop-types';
import authAPI from "../apis/authApi";

import Select from "react-select";

const { doGetPrivateTasks,doCreateTasks } = authAPI();

function AddTask({ closeModal, getData }) {
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("global");
  const [dependenciesTasks, setDependenciesTasks] = useState([]);
  const [selectedDependencies, setSelectedDependencies] = useState([]);

  const getAllTasks = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (selectedType === "global") {
        const res = await doGetPrivateTasks(userId);
        const formattedTasks = res.data?.privateTasks.map(task => ({
          value: task._id || task.id,
          label: task.title
        }));
        setDependenciesTasks(formattedTasks);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };
  
  // Handle changes for the dependencies select
const handleChange = (selectedOptions) => {
  setSelectedDependencies(selectedOptions);
  // Update formik values with an array of IDs
  formik.setFieldValue(
    "dependencies", 
    selectedOptions.map(option => option.value) // Just keep as array, don't join
  );
};

const formik = useFormik({
  initialValues: {
    title: "",
    description: "",
    duration: "",
    dependencies: [], // Initialize as an empty array
  },
  onSubmit: async (values) => {
    setLoading(true);
    const data = {
      type: selectedType,
      title: values.title,
      description: values.description,
      duration: values.duration,
      dependencies: values.dependencies, // Now this will be an array
    };

    try {
      // Replace with actual API call
      const res = await doCreateTasks(data);
      console.log(res, "res");
      getData();
      toast.success("Task Added", { position: "top-center" });
      setTimeout(() => closeModal(), 1000);
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || "Server error", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  },
});

  // Fetch tasks when component mounts or selectedType changes
  useEffect(() => {
    getAllTasks();
  }, [selectedType]);

  return (
    <div>
      <Toaster />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg px-16 relative">
          <button
            className="absolute top-4 border hover:bg-slate-50 rounded right-4 text-gray-500 hover:text-gray-800"
            onClick={closeModal}
          >
            <IoIosClose size={20} />
          </button>

          {/* Title and Description */}
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-[#D8F3DC] flex items-center justify-center mr-4">
              <RiShieldUserFill size={18} className="text-[#72A10F]" />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-gray-800">Add New Task</h2>
              <p className="text-gray-500 text-[12px]">Enter details to create tasks</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Task Type */}
            <div className="relative">
              <label className="block text-black text-[14px] mb-1 font-semibold">Task Type</label>
              <select
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="global">Global</option>
                <option value="private">Private</option>
              </select>
            </div>

            {/* Title */}
            <div className="relative">
              <label className="block text-black text-[14px] mb-1 font-semibold">Title</label>
              <input
                type="text"
                name="title"
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none"
                placeholder="Enter task title"
                value={formik.values.title}
                onChange={formik.handleChange}
                required
              />
            </div>

            {/* Description */}
            <div className="relative">
              <label className="block text-black text-[14px] mb-1 font-semibold">Description</label>
              <textarea
                name="description"
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none"
                placeholder="Enter task description"
                value={formik.values.description}
                onChange={formik.handleChange}
              />
            </div>

            {/* Duration */}
            <div className="relative">
              <label className="block text-black text-[14px] mb-1 font-semibold">Duration</label>
              <input
                type="number"
                name="duration"
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none"
                placeholder="Enter task duration"
                value={formik.values.duration}
                onChange={formik.handleChange}
                required
              />
            </div>

            {/* Dependencies */}
            {selectedType === "global" && (
              <div className="relative">
                <label className="block text-black text-[14px] mb-1 font-semibold">
                  Dependencies Task
                </label>
                <Select
                  options={dependenciesTasks}
                  isMulti
                  value={selectedDependencies}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="Select one or more tasks"
                />
              </div>
            )}

            {/* Buttons */}
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
                {loading ? "Adding..." : "Add Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

AddTask.propTypes = {
  closeModal: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
};

export default AddTask;