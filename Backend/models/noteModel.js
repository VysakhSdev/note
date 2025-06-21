import mongoose from "mongoose";

// Collaborator Sub-Schema
const collaboratorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userSchema", 
    required: true
  },
  permission: {
    type: String,
    enum: ["read", "write"],
    default: "read"
  }
});

// Main Note Schema
const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userSchema", 
    required: true
  },
  collaborators: [collaboratorSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const NoteModel = mongoose.model("noteSchema", noteSchema);
export default NoteModel;
