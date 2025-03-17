import React, { useEffect, useState } from 'react'
import authAPI from '../../apis/authApi';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import moment from 'moment';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import AddEvents from '../../modals/AddEvents';
import EditEvents from '../../modals/EditEvent';
import DeleteConfirm from '../../modals/deleteConfrim.jsx';





const { doGetEvents } = authAPI();
function Events() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openDelete, setOpenDelete] = useState({
    isOpen: false,
    id: null,
  });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    dataToEdit: null
  });
  const [type, setType] = useState(true);


  



  // Fetch all tasks
  const getAllEvents = async () => {
    try {


      const res = await doGetEvents();


      console.log(res, "ress");

      setEvents(res?.data?.events || []); // Ensure default value

    } catch (e) {
      console.error("Error fetching tasks:", e);
    }
  };

  const handleAddEvent = () => {
    setIsModalOpen(true);
  };

  const closeAddEvents = () => {
    setIsModalOpen(false);
  };
  const openModal = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };
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
    getAllEvents();
  }, []);
  return (
    <div className="lg:px-12 md:px-10 px-4 pt-9">
      <div className="mb-4 flex flex-col gap-y-4 xl:flex-row items-center justify-between">
        {/* Toggle Task Type */}

        {/* Add Task Button */}
        <div className="flex flex-row gap-x-2">
          <button
            onClick={handleAddEvent}
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
              <th className="pl-6 py-2 border-r"> Event Date</th>
              <th className="pl-6 py-2 border-r">Title</th>
              <th className="pl-6 py-2 border-r">Description</th>
              <th className="pl-6 py-2 border-r">Task</th>

              <th className="pl-6 py-2 text-center border-r">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events?.length ? (
              events.map((data, index) => (
                <tr key={data._id} className={`${index % 2 === 1 ? "bg-white" : "bg-[#F7FAF1]"} text-sm text-[#5A5D6C] border-gray-300`}>
                  <td className="px-6 py-3 border-r">{moment(data.eventDate).format("MMM DD, YYYY")}</td>
                  <td className="px-6 py-3 border-r">{data.title}</td>

                  <td className="px-6 py-3 border-r">{data.description}</td>
                  {events && (
                    <td className="px-6 py-3 border-r">
                      {data.tasks.length > 0 ? (
                        <button className="text-blue-600 hover:underline" onClick={() => openModal(data?.tasks)}>View</button>
                      ) : (
                        <span className="text-gray-500">No task</span>
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
      {isModalOpen && <AddEvents closeModal={closeAddEvents} getData={getAllEvents} />}
      {editModal.isOpen && (
        <EditEvents
        eventData={editModal?.dataToEdit}
          closeModal={closeEditModal}
          getData={getAllEvents}
        />
      )}
      {modalOpen && selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-1/3 relative">
            {/* Close Icon at Top Right */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setModalOpen(false)}
            >
              ✖
            </button>

            <h2 className="text-xl font-semibold mb-3 text-center">Task in this events</h2>

            {/* Table for Title and Date */}
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>

                  <th className="border border-gray-300 px-4 py-2 text-left">Created Date</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(selectedTask) ? (
                  selectedTask.map((data, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">{data.title}</td>
                      <td className="border border-gray-300 px-4 py-2">{data.duration}</td>

                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(data.createdAt).toLocaleDateString()}
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

       {openDelete?.isOpen && <DeleteConfirm  type={type} id={openDelete?.id} closeDeleteModal={closeDeleteModal} getData={getAllEvents} />} 




    </div>)
}

export default Events