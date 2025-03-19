import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://vysakhs_dev:Vysakh123@mern-todo.o0dtbrx.mongodb.net/?retryWrites=true&w=majority&appName=Mern-todo');
        console.log('MongoDB connected for user service');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1); 
    }
};

export default connectDB;



