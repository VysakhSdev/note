
import React, { useState, useEffect } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import authAPI from "../../apis/authApi";
import moment from "moment";
import DeleteConfirm from "../../modals/deleteConfrim";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import AddTask from "../../modals/AddTask";
import EditTask from "../../modals/EditTask";

const { doGetTasks, doGetPrivateTasks, doCreateTasks } = authAPI();

function Tasks() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [globalTask, setGlobalTask] = useState([]);
  const [privateTask, setPrivateTask] = useState([]);
  const [taskType, setTaskType] = useState("global");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDep, setSelectedDep] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("global");
  const [openDelete, setOpenDelete] = useState({
    isOpen: false,
    id: null,
  });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    dataToEdit: null
  });

  // Open modal for dependencies
  const openModal = (dep) => {
    setSelectedDep(dep);
    setModalOpen(true);
  };

  // Toggle task type (global/private)
  const toggleType = (value) => {
    setTaskType(value);
  };

  // Handle add task modal
  const handleAddTask = () => {
    setIsModalOpen(true);
  };

  // Close add member modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Fetch all tasks
  const getAllTasks = async () => {
    try {
      let res;
      if (taskType === "private") {
        const userId = localStorage.getItem("userId");

        res = await doGetPrivateTasks(userId);
        setPrivateTask(res?.data?.privateTasks || []); // Ensure default value
      } else {
        res = await doGetTasks();
        setGlobalTask(res?.data?.globalTasks || []);
      }
    } catch (e) {
      console.error("Error fetching tasks:", e);
      toast.error("Failed to load tasks");
    }
  };


  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      duration: "",
      dependencies: [],
    },
    onSubmit: async (values) => {
      setLoading(true);
      const data = {
        type: selectedType,
        title: values.title,
        description: values.description,
        duration: values.duration,
        dependencies: values.dependencies,
      };

      try {
        const res = await doCreateTasks(data);
        console.log(res, "res");
        getAllTasks();
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

  const handleEdit = (data) => {
    setEditModal({
      isOpen: true,
      dataToEdit: data
    });
  };

  const closeEditModal = () => {
    setEditModal({
      isOpen: false,
      dataToEdits: null
    });
  };

  const openDeleteModal = (id) => {
    setOpenDelete({
      isOpen: true,
      id: id,
    });
  };

  const closeDeleteModal = () => {
    setOpenDelete({
      isOpen: false,
      id: null,
    });
  };

  useEffect(() => {
    getAllTasks();
  }, [taskType]);

  const tasks = taskType === "private" ? privateTask : globalTask;

  return (
    <div className="lg:px-12 md:px-10 px-4 pt-9">
      <div className="mb-4 flex flex-col gap-y-4 xl:flex-row items-center justify-between">
        {/* Toggle Task Type */}
        <div className="relative flex border rounded-full w-28 h-8">
          <button
            onClick={() => toggleType("global")}
            className={`w-1/2 text-[12px] h-full rounded-full transition-all duration-300 ${taskType === "global" ? "bg-[#022213] text-white" : "text-gray-700"
              }`}
          >
            Global
          </button>
          <button
            onClick={() => toggleType("private")}
            className={`w-1/2 text-[12px] h-full rounded-full transition-all duration-300 ${taskType === "private" ? "bg-[#022213] text-white" : "text-gray-700"
              }`}
          >
            Private
          </button>
        </div>

        {/* Add Task Button */}
        <div className="flex flex-row gap-x-2">
          <button
            onClick={handleAddTask}
            className="px-4 py-2 text-sm h-[40px] w-[100px] flex items-center text-white rounded-lg bg-[#022213] hover:bg-[#72A10F] transition duration-300"
          >
            <AiOutlinePlusCircle size={18} className="mr-2" /> New
          </button>
        </div>
      </div>

      {/* Task Table */}
      <div className="relative overflow-x-auto rounded-lg">
        <table className="min-w-full table-auto bg-white shadow-xs rounded-md border-gray-200">
          <thead>
            <tr className="bg-[#F9F9FB] text-start text-[#5A5D6C] text-sm font-bold">
              <th className="pl-6 py-2 border-r">Date</th>
              <th className="pl-6 py-2 border-r">Title</th>
              <th className="pl-6 py-2 border-r">Type</th>
              <th className="pl-6 py-2 border-r">Duration</th>
              <th className="pl-6 py-2 border-r">Description</th>
              {taskType === "global" && <th className="pl-6 py-2 border-r">Dependencies</th>}
              <th className="pl-6 py-2 text-center border-r">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks?.length ? (
              tasks.map((data, index) => (
                <tr key={data._id} className={`${index % 2 === 1 ? "bg-white" : "bg-[#F7FAF1]"} text-sm text-[#5A5D6C] border-gray-300`}>
                  <td className="px-6 py-3 border-r">{moment(data.createdAt).format("MMM DD, YYYY")}</td>
                  <td className="px-6 py-3 border-r">{data.title}</td>
                  <td className="px-6 py-3 border-r">{data.type}</td>
                  <td className="px-6 py-3 border-r">{data.duration}</td>
                  <td className="px-6 py-3 border-r">{data.description}</td>
                  {taskType === "global" && (
                    <td className="px-6 py-3 border-r">
                      {data.dependencies.length > 0 ? (
                        <button className="text-blue-600 hover:underline" onClick={() => openModal(data?.dependencies)}>View</button>
                      ) : (
                        <span className="text-gray-500">No dependencies</span>
                      )}
                    </td>
                  )}
                  <td className="px-6 py-3 border-r flex justify-center gap-4">
                    <button onClick={() => handleEdit(data)} className="text-blue-600 hover:text-blue-800">
                      <FiEdit size={18} />
                    </button>
                    <button onClick={() => openDeleteModal(data._id)} className="text-red-500 hover:text-red-700">
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">No tasks available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && <AddTask closeModal={closeModal} getData={getAllTasks} />}
      {editModal.isOpen && (
        <EditTask
          data={editModal?.dataToEdit}
          closeModal={closeEditModal}
          getData={getAllTasks}
        />
      )}
      {modalOpen && selectedDep && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-1/3 relative">
            {/* Close Icon at Top Right */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setModalOpen(false)}
            >
              ✖
            </button>

            <h2 className="text-xl font-semibold mb-3 text-center">Dependency Task</h2>

            {/* Table for Title and Date */}
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Created Date</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(selectedDep) ? (
                  selectedDep.map((dep, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">{dep.title}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(dep.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">{selectedDep.title}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(selectedDep.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {openDelete?.isOpen && <DeleteConfirm id={openDelete?.id} closeDeleteModal={closeDeleteModal} getData={getAllTasks} />}




    </div>

  );
}
export default Tasks;
