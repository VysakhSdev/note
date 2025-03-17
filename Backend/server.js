import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes.js"; 
import taskRouter from "./routes/taskRoutes.js"; 
import eventRouter from "./routes/eventRoutes.js"; 

import connectDB from "./config/dbConfig.js";

dotenv.config();
const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions)); 
app.use(express.json());

app.use("/user", userRouter); 
app.use("/task", taskRouter); 
app.use("/event", eventRouter); 

connectDB(); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
