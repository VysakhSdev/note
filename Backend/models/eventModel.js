import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    eventDate: {
      type: Date,
      required: true
    },
    tasks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task"
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

const EventModel = mongoose.model("Event", EventSchema); 

export default EventModel;