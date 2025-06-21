import asyncHandler from "../middleware/asyncHandler.js";
import NoteModel from "../models/noteModel.js";
import UserModel from "../models/userModel.js";
// Create a Note
export const createNote = asyncHandler(async (req, res) => {
  const userId = req?.userId;

  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newNote = await NoteModel.create({
    title,
    content,
    createdBy: userId,
  });

  res.status(201).json({
    message: "Note created successfully",
    note: newNote,
  });
});
// Get Notes with pagination
export const getNotes = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalNotes = await NoteModel.countDocuments({ createdBy: userId });

  const myNotes = await NoteModel.find({ createdBy: userId })
    .sort({ lastUpdated: -1 })
    .skip(skip)
    .limit(limit);

  const sharedNotes = await NoteModel.find({
    "collaborators.userId": userId,
  })
    .sort({ lastUpdated: -1 });

  res.status(200).json({
    currentPage: page,
    totalPages: Math.ceil(totalNotes / limit),
    totalNotes,
    myNotes,
    sharedNotes, 
  });
});

// Update an existing note
export const updateNote = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const noteId = req.params.id;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const note = await NoteModel.findById(noteId).populate("createdBy", "name email");

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  const isOwner = note.createdBy._id.toString() === userId.toString();
  const isCollaboratorWithWriteAccess = note.collaborators?.some(
    (collab) =>
      collab.userId.toString() === userId.toString() &&
      collab.permission === "write"
  );

  if (!isOwner && !isCollaboratorWithWriteAccess) {
    return res.status(403).json({ message: "Unauthorized to edit this note" });
  }

  note.title = title;
  note.content = content;
  note.lastUpdated = new Date();

  const updatedNote = await note.save();

  const io = req.app.get("io");

  const notifiedUserIds = new Set();

  if (note.createdBy._id.toString() !== userId.toString()) {
    notifiedUserIds.add(note.createdBy._id.toString());
  }

  note.collaborators.forEach((collab) => {
    const targetId = collab.userId.toString();
    if (targetId !== userId.toString()) {
      notifiedUserIds.add(targetId);
    }
  });

  notifiedUserIds.forEach((targetId) => {
    io.to(targetId).emit("note-being-edited", { noteId });
    io.to(targetId).emit("note-notification", {
      message: `Note "${title}" was updated by ${note.createdBy?.name || "a collaborator"}`,
      noteId: note._id,
    });
  });

  res.status(200).json({
    message: "Note updated successfully",
    note: updatedNote,
  });
});


//Share Note by permission
export const shareNote = asyncHandler(async (req, res) => {
  const userId = req?.userId; 
  const { noteId, email, permission } = req.body;

  if (!noteId || !email || !permission) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const note = await NoteModel.findById(noteId);
  if (!note) return res.status(404).json({ message: "Note not found" });

  if (!note.createdBy.equals(userId)) {
    return res.status(403).json({ message: "Only the owner can share this note" });
  }

  const user = await UserModel.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const alreadyShared = note.collaborators.some((c) =>
    c.userId.equals(user._id)
  );

  if (alreadyShared) {
    return res.status(400).json({ message: "User already a collaborator" });
  }

  note.collaborators.push({ userId: user._id, permission });
  await note.save();

  res.status(200).json({ message: "Note shared successfully", note });
});

