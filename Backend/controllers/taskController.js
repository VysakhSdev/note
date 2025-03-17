import asyncHandler from "../middleware/asyncHandler.js";
import TaskModel from "../models/taskModel.js";

export const createTask = asyncHandler(async (req, res) => {
  const userId = req?.userId; // User ID from authentication middleware or request
  console.log(userId, "qwertyuiop");

  const { type, title, description, duration, dependencies } = req.body;

  if (!type || !title || !duration) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (!["global", "private"].includes(type)) {
    return res.status(400).json({ message: "Invalid task type" });
  }

  if (type === "private" && !userId) {
    return res.status(400).json({ message: "Private tasks require a userId" });
  }

  if (type === "global" && (!dependencies || dependencies.length === 0)) {
    return res.status(400).json({ message: "Global tasks must have at least one dependency" });
  }

  let validDependencies = [];
  if (dependencies && dependencies.length > 0) {
    validDependencies = await TaskModel.find({ '_id': { $in: dependencies } });
    if (validDependencies.length !== dependencies.length) {
      return res.status(400).json({ message: "Some dependency tasks do not exist" });
    }
  }

  const newTask = new TaskModel({
    userId: type === "private" ? userId : null, 
    type,
    title,
    description,
    duration,
    dependencies: validDependencies.map(task => task._id), 
  });

  // Save to Database
  await newTask.save();
  res.status(201).json({ message: "Task created successfully", task: newTask });
});




export const getTasks = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.query;

    console.log(userId, "userId");

    // Fetch both private tasks for the user and global tasks for all users
    const privateTasks = await TaskModel.find({ type: "private", userId })
      .sort({ createdAt: -1 })
      .exec();

    const globalTasks = await TaskModel.find({ type: "global" })
      .sort({ createdAt: -1 })
      .populate("dependencies", "title createdAt")
      .exec();

    // If both task lists are empty, return 404
    if (privateTasks.length === 0 && globalTasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }

    res.status(200).json({
      message: "Tasks retrieved successfully",
      privateTasks,
      globalTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});





export const editTask = asyncHandler(async (req, res) => {
  const  taskId  = req.query?.id;  
  const userId = req?.userId;    
console.log(taskId,"taskId................");

  const { type, title, description, duration, dependencies } = req.body;

  // Check if task exists
  const task = await TaskModel.findById({_id:taskId});
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // Check if the user is trying to edit a private task they don't own
  if (task.type === "private" && task.userId.toString() !== userId.toString()) {
    return res.status(403).json({ message: "You do not have permission to edit this task" });
  }

  // Validate the provided data
  if (type && !["global", "private"].includes(type)) {
    return res.status(400).json({ message: "Invalid task type" });
  }

  // Validate dependencies if provided
  let validDependencies = [];
  if (dependencies && dependencies.length > 0) {
    validDependencies = await TaskModel.find({ '_id': { $in: dependencies } });
    if (validDependencies.length !== dependencies.length) {
      return res.status(400).json({ message: "Some dependency tasks do not exist" });
    }
  }

  // Update the task with new values
  task.type = type || task.type; // Update only if new value is provided
  task.title = title || task.title;
  task.description = description || task.description;
  task.duration = duration || task.duration;
  task.dependencies = validDependencies.length > 0 ? validDependencies.map(task => task._id) : task.dependencies;

  // Save updated task
  await task.save();

  res.status(200).json({ message: "Task updated successfully", task });
});


export const  deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params; 

  console.log(taskId,"taskId...");
  
  const userId = req?.userId;     

  const task = await TaskModel.findById(taskId);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (task.type === "private" && task.userId.toString() !== userId.toString()) {
    return res.status(403).json({ message: "You do not have permission to delete this task" });
  }

  await TaskModel.findByIdAndDelete(taskId);

  res.status(200).json({ message: "Task deleted successfully" });
});

