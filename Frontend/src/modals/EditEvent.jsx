import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { IoIosClose } from "react-icons/io";
import PropTypes from "prop-types";
import authAPI from "../apis/authApi";
import Select from "react-select";
import { RiShieldUserFill } from "react-icons/ri";

const { doGetPrivateTasks, doUpdateEvent, doGetTasks } = authAPI();

function EditEvents({ closeModal, getData, eventData}) {
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(eventData);
  const [privateTask, setPrivateTask] = useState([]);
  const [globalTask, setGlobalTask] = useState([]);
  const [dependenciesTasks, setDependenciesTasks] = useState([]);
  const [selectedDependencies, setSelectedDependencies] = useState(
    eventData.tasks.map((task) => ({ value: task._id, label: task.title })) || []
  );

  const getAllTasks = async () => {
    try {
      let res;
      if (selectedType === "private") {
        const userId = localStorage.getItem("userId");
        res = await doGetPrivateTasks(userId);
        setPrivateTask(res?.data?.privateTasks || []);
      } else {
        res = await doGetTasks();
        setGlobalTask(res?.data?.globalTasks || []);
      }
    } catch (e) {
      console.error("Error fetching tasks:", e);
      toast.error("Failed to load tasks");
    }
  };

  useEffect(() => {
    getAllTasks();
  }, [selectedType]);

  useEffect(() => {
    const formattedTasks =
      selectedType === "private"
        ? privateTask.map((task) => ({ value: task._id, label: task.title }))
        : globalTask.map((task) => ({ value: task._id, label: task.title }));
    setDependenciesTasks(formattedTasks);
  }, [privateTask, globalTask, selectedType]);

  const handleChange = (selectedOptions) => {
    setSelectedDependencies(selectedOptions);
    formik.setFieldValue(
      "tasks",
      selectedOptions ? selectedOptions.map((option) => option.value) : []
    );
  };

  const formik = useFormik({
    initialValues: {
      title: eventData.title || "",
      description: eventData.description || "",
      eventDate: eventData.eventDate || "",
      tasks: eventData.tasks.map((task) => task._id) || [],
    },
    onSubmit: async (values) => {
      setLoading(true);
      const data = {
        title: values.title,
        description: values.description,
        eventDate: values.eventDate,
        tasks: values.tasks,
      };

      try {
        await doUpdateEvent(eventData._id, data);
        getData();
        toast.success("Event Updated", { position: "top-center" });
        setTimeout(() => closeModal(), 1000);
      } catch (e) {
        toast.error(e.response?.data?.message || "Server error", {
          position: "top-center",
        });
      } finally {
        setLoading(false);
      }
    },
  });

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

          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-[#D8F3DC] flex items-center justify-center mr-4">
              <RiShieldUserFill size={18} className="text-[#72A10F]" />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-gray-800">
                Edit Event
              </h2>
              <p className="text-gray-500 text-[12px]">
                Modify event details
              </p>
            </div>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label className="block text-black text-[14px] mb-1 font-semibold">
                Title
              </label>
              <input
                type="text"
                name="title"
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none"
                value={formik.values.title}
                onChange={formik.handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-black text-[14px] mb-1 font-semibold">
                Description
              </label>
              <textarea
                name="description"
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none"
                value={formik.values.description}
                onChange={formik.handleChange}
              />
            </div>

            <div>
              <label className="block text-black text-[14px] mb-1 font-semibold">
                Date
              </label>
              <input
                type="date"
                name="eventDate"
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none"
                value={formik.values.eventDate}
                onChange={formik.handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-black text-[14px] mb-1 font-semibold">
                Dependencies
              </label>
              <Select
                options={dependenciesTasks}
                isMulti
                value={selectedDependencies}
                onChange={handleChange}
                className="w-full"
                placeholder="Select dependencies"
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
                {loading ? "Updating..." : "Update Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

EditEvents.propTypes = {
  closeModal: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
  eventData: PropTypes.object.isRequired,
};

export default EditEvents;
