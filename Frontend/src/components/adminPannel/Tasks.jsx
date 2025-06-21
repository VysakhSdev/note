import React, { useState, useEffect } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FiEdit, FiShare2, FiTrash2 } from "react-icons/fi";
import authAPI from "../../apis/authApi";
import moment from "moment";
import AddNotes from "../../modals/AddNotes";
import ShareNotes from "../../modals/ShareNotes";
import socket from "../../config/socket";
import toast from "react-hot-toast";

const { doGetNotes } = authAPI();

function Notes() {
  const [isModalOpen, setIsModalOpen] = useState({
    addNote: false,
    shareNote: false,
    editNote: false,
  });
  const [shareNoteId, setShareNoteId] = useState(null);
  const [noteType, setNoteType] = useState("myNote");
  const [note, setNote] = useState([]);
  const [shared, setShared] = useState([]);
  const [editingNotes, setEditingNotes] = useState({});
  console.log(editingNotes,"editingNotes")
  const [editData, setEditData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 10;

  const toggleType = (value) => {
    setNoteType(value);
    setCurrentPage(1);
  };

  const getAllNotes = async () => {
    try {
      const res = await doGetNotes();
      setNote(res?.data?.myNotes || []);
      setShared(res?.data?.sharedNotes || []);
    } catch (e) {
      console.error("Error fetching notes:", e);
      toast.error("Failed to load notes");
    }
  };

useEffect(() => {
  getAllNotes();

  const userId = localStorage.getItem("userId");
  if (userId) socket.emit("join-user-room", userId);

  socket.on("note-notification", (data) => {
    toast(data.message);
    getAllNotes();
  });

  socket.on("note-being-edited", ({ noteId }) => {
    setEditingNotes((prev) => ({ ...prev, [noteId]: true }));

    setTimeout(() => {
      setEditingNotes((prev) => {
        const updated = { ...prev };
        delete updated[noteId];
        return updated;
      });
    }, 5000);
  });

  return () => {
    socket.off("note-notification");
    socket.off("note-being-edited");
  };
}, []);



  const allTasks = noteType === "shared" ? shared : note;
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentTasks = allTasks.slice(indexOfFirstNote, indexOfLastNote);
  const totalPages = Math.ceil(allTasks.length / notesPerPage);

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddNote = () => setIsModalOpen((prev) => ({ ...prev, addNote: true }));
  const handleShare = (noteId) => {
    setIsModalOpen((prev) => ({ ...prev, shareNote: true }));
    setShareNoteId(noteId);
  };
  const handleEdit = (data) => {
    setEditData(data);
    setIsModalOpen((prev) => ({ ...prev, editNote: true }));
  };
  const closeModal = () => {
    setIsModalOpen({ addNote: false, shareNote: false, editNote: false });
    setEditData(null);
  };

  return (
    <div className="lg:px-12 md:px-10 px-4 pt-9">
      <div className="mb-4 flex flex-col gap-y-4 xl:flex-row items-center justify-between">
        <div className="relative flex border rounded-full w-32 h-8">
          <button
            onClick={() => toggleType("myNote")}
            className={`w-1/2 text-[12px] h-full rounded-full transition-all duration-300 ${
              noteType === "myNote" ? "bg-[#022213] text-white" : "text-gray-700"
            }`}
          >
            My Notes
          </button>
          <button
            onClick={() => toggleType("shared")}
            className={`w-1/2 text-[12px] h-full rounded-full transition-all duration-300 ${
              noteType === "shared" ? "bg-[#022213] text-white" : "text-gray-700"
            }`}
          >
            Shared
          </button>
        </div>

        {noteType === "myNote" && (
          <div className="flex flex-row gap-x-2">
            <button
              onClick={handleAddNote}
              className="px-4 py-2 text-sm h-[40px] w-[100px] flex items-center text-white rounded-lg bg-[#022213] hover:bg-[#72A10F] transition duration-300"
            >
              <AiOutlinePlusCircle size={18} className="mr-2" /> New
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {currentTasks?.length ? (
          currentTasks.map((data) => (
            <div
              key={data._id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-4 flex flex-col justify-between"
            >
              <div>
                <div className="text-xs text-gray-400 mb-1">
                  {moment(data.createdAt).format("MMM DD, YYYY")}
                </div>
                <h3 className="text-lg font-semibold text-[#1E3167]">
                  {data.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{data.content}</p>
                <div className="flex items-center gap-2 mt-1">
                  {noteType === "shared" && (
                    <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                      Shared
                    </span>
                  )}
                  {noteType === "myNote" && data.collaborators?.length > 0 && (
                    <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                      Shared with {data.collaborators.length}
                    </span>
                  )}
                  {editingNotes[data._id] && (
                    <span className="text-[10px] text-yellow-600 font-medium">
                      ✍️ Editing...
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-4">
                {noteType === "myNote" && (
                  <>
                    <button
                      onClick={() => handleEdit(data)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit size={18} />
                    </button>

                    <button
                      onClick={() => handleShare(data._id)}
                      className="text-purple-600 hover:text-purple-800"
                      title="Share"
                    >
                      <FiShare2 size={18} />
                    </button>

                    <button
                      onClick={() => toast("Delete modal not implemented")}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </>
                )}
                {noteType === "shared" && (
                  <>
                    {data.collaborators?.find(
                      (c) =>
                        c.userId === localStorage.getItem("userId") &&
                        c.permission === "write"
                    ) ? (
                      <button
                        onClick={() => handleEdit(data)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit size={18} />
                      </button>
                    ) : (
                      <span className="text-[10px] text-gray-500">View Only</span>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No notes available
          </div>
        )}
      </div>

      {/* ✅ Custom Pagination Bar */}
        <div className="flex text-sm justify-end items-center mt-6 space-x-2">
          <button
            className={`py-2 px-4 rounded-lg hover:bg-gray-200 ${
              currentPage <= 1 ? "text-gray-500 cursor-not-allowed" : "text-gray-700"
            }`}
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={`py-2 px-4 rounded-lg ${
                currentPage === index + 1
                  ? "bg-[#72A10F] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => changePage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className={`py-2 px-4 rounded-lg hover:bg-gray-200 ${
              currentPage === totalPages ? "text-gray-500 cursor-not-allowed" : "text-gray-700"
            }`}
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

      {(isModalOpen.addNote || isModalOpen.editNote) && (
        <AddNotes
          closeModal={closeModal}
          getData={getAllNotes}
          editData={editData}
        />
      )}
      {isModalOpen.shareNote && (
        <ShareNotes
          closeModal={closeModal}
          noteId={shareNoteId}
          getData={getAllNotes}
        />
      )}
    </div>
  );
}

export default Notes;
