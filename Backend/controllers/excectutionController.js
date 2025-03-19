import EventModel from "../models/eventModel.js";
import moment from "moment";



export const findExecutionOrder = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Fetch event and populate its tasks
    const event = await EventModel.findById(eventId).populate({
      path: "tasks",
      select: "title duration dependencies",
    });

    if (!event) {
      console.error("Error: Event not found!");
      return res.status(404).json({ error: "Event not found!" });
    }

    const tasks = event.tasks;
    if (!tasks || tasks.length === 0) {
      console.error("Error: No tasks found for this event!");
      return res.status(404).json({ error: "No tasks found for this event!" });
    }

    let adjList = new Map();
    let inDegree = new Map();
    let order = [];

    // Initialize graph
    tasks.forEach((task) => {
      adjList.set(task._id.toString(), []);
      inDegree.set(task._id.toString(), 0);
    });

    // Build graph based on dependencies
    tasks.forEach((task) => {
      if (!task.dependencies || task.dependencies.length === 0) return;

      task.dependencies.forEach((dep) => {
        if (!dep) return;

        if (!adjList.has(dep.toString())) return;

        adjList.get(dep.toString()).push(task._id.toString());
        inDegree.set(task._id.toString(), (inDegree.get(task._id.toString()) || 0) + 1);
      });
    });

    // Find tasks with no dependencies (in-degree 0)
    let queue = [];
    inDegree.forEach((value, key) => {
      if (value === 0) queue.push(key);
    });

    // Process the queue (Topological Sort - Kahn's Algorithm)
    while (queue.length > 0) {
      let taskId = queue.shift();
      order.push(taskId);

      adjList.get(taskId).forEach((nextTask) => {
        inDegree.set(nextTask, inDegree.get(nextTask) - 1);
        if (inDegree.get(nextTask) === 0) queue.push(nextTask);
      });
    }

    // Check for cyclic dependencies
    if (order.length !== tasks.length) {
      console.error("Error: Cyclic dependencies detected!");
      return res.status(400).json({ error: "Cyclic dependencies detected!" });
    }

    // Assign execution order names
    const executionOrder = order.map((taskId, index) => ({
      taskId,
      order: index + 1,
    }));

    // Define event schedule
    let startDate = moment(event.eventDate); // Use eventDate from the schema
    let taskSchedule = [];
    let taskEndDates = new Map();

    executionOrder.forEach(({ taskId, order }) => {
      let task = tasks.find((t) => t._id.toString() === taskId);

      if (!task) return;

      let taskName = task.name || "Unknown Task"; // Fix: Use `name` instead of `title`
      let taskStartDate = startDate.clone();

      if (task.dependencies.length > 0) {
        let latestDependencyEndDate = task.dependencies
          .map((dep) => taskEndDates.get(dep.toString()) || startDate)
          .sort((a, b) => b.diff(a))[0];
        taskStartDate = latestDependencyEndDate.clone();
      }

      let taskEndDate = taskStartDate.clone().add(task.duration || 1, "days");
      taskEndDates.set(task._id.toString(), taskEndDate);

      taskSchedule.push({
        taskName, // Fix: Use `name` instead of `title`
        start: taskStartDate.format("ddd MMM DD YYYY"),
        end: taskEndDate.format("ddd MMM DD YYYY"),
      });

      startDate = taskEndDate.clone(); // Adjust start date for the next task
    });

    // Fix: Correct totalDays calculation
    let lastTaskId = order[order.length - 1];
    let totalDays = taskEndDates.has(lastTaskId)
      ? moment(taskEndDates.get(lastTaskId)).diff(moment(event.eventDate), "days")
      : 0;

    const response = {
      event: event.title, // Fix: Use `name` instead of `title`
      executionOrder: executionOrder.map((t) => t.order),
      totalEstimatedTime: `${totalDays} Hours`,
      eventPlan: `Starts on ${moment(event.eventDate).format("ddd MMM DD YYYY")} and ends on ${moment(event.eventDate).add(totalDays, "days").format("ddd MMM DD YYYY")}`,
      taskSchedule,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching execution order:", error);
    return res.status(500).json({ error: "Error processing execution order!" });
  }
};


