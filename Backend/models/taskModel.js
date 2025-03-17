import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  type: {
    type: String,
    enum: ["global", "private"],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  duration: {
    type: Number,
    required: true
  },
  dependencies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task"
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const TaskModel = mongoose.model("Task", taskSchema);  
export default TaskModel;
