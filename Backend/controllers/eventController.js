import asyncHandler from "../middleware/asyncHandler.js";
import EventModel from "../models/eventModel.js";
import TaskModel from "../models/taskModel.js";

export const createEvent = asyncHandler(async (req, res) => {
  try {
    const userId = req?.userId; 

    const { title, description, eventDate, tasks } = req.body;

    if (!title || !eventDate) {
      return res.status(400).json({ message: "Title and event date are required." });
    }

    let validTasks = [];
    if (tasks && tasks.length > 0) {
      validTasks = await TaskModel.find({ _id: { $in: tasks } });
      if (validTasks.length !== tasks.length) {
        return res.status(400).json({ message: "Some tasks do not exist." });
      }
    }

    const newEvent = new EventModel({
      title,
      description,
      eventDate,
      tasks: validTasks.map(task => task._id),
      createdBy: userId,
    });

    await newEvent.save();

    res.status(201).json({ message: "Event created successfully!", event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


export const getAllEvents = asyncHandler(async (req, res) => {
    try {
      const events = await EventModel.find().populate("tasks"); 
      res.status(200).json({ success: true, events });
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  export const  deleteEvents = asyncHandler(async (req, res) => {
    const { eventId } = req.params; 
  
    console.log(eventId,"taskId...");
    
  
    const task = await EventModel.findById(eventId);
    if (!task) {
      return res.status(404).json({ message: "event not found" });
    }
  
    
  
    await EventModel.findByIdAndDelete(eventId);
  
    res.status(200).json({ message: "Task deleted successfully" });
  });


  export const updateEvent = asyncHandler(async (req, res) => {
    try {
      const { eventId } = req.params;
      const userId = req?.userId;
      const { title, description, eventDate, tasks } = req.body;
  
      const existingEvent = await EventModel.findById(eventId);
      if (!existingEvent) {
        return res.status(404).json({ message: "Event not found." });
      }
  
      if (existingEvent.createdBy.toString() !== userId) {
        return res.status(403).json({ message: "You don't have permission to edit this event." });
      }
  
      if (!title || !eventDate) {
        return res.status(400).json({ message: "Title and event date are required." });
      }
  
      let validTasks = [];
      if (tasks && tasks.length > 0) {
        validTasks = await TaskModel.find({ _id: { $in: tasks } });
        if (validTasks.length !== tasks.length) {
          return res.status(400).json({ message: "Some tasks do not exist." });
        }
      }
  
      const updatedEvent = await EventModel.findByIdAndUpdate(
        eventId,
        {
          title,
          description,
          eventDate,
          tasks: validTasks.length > 0 ? validTasks.map(task => task._id) : existingEvent.tasks,
        },
        { new: true } // Return the updated document
      );
  
      res.status(200).json({ 
        message: "Event updated successfully!", 
        event: updatedEvent 
      });
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });