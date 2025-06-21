import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http"; 
import { Server } from "socket.io";
import userRouter from "./routes/userRoutes.js";
import noteRouter from "./routes/noteRoutes.js";

import connectDB from "./config/dbConfig.js";


dotenv.config();
const app = express();
const server = http.createServer(app); 



//Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});
app.set("io", io);

//Enable CORS and JSON parsing
const corsOptions = {
  origin: "*",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

//Routes
app.use("/user", userRouter);
app.use("/notes", noteRouter); 

// ✅ Connect to DB
connectDB();

// Socket.IO Events
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  // ✅ This is what was missing
  socket.on("join-user-room", (userId) => {
    if (userId) {
      socket.join(userId);
      console.log(`👥 User joined personal room: ${userId}`);
    }
  });

  socket.on("join-note", (noteId) => {
    socket.join(noteId);
    console.log(`📘 Joined note room: ${noteId}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});


// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
