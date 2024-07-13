// import modules
import mongoose from "mongoose";

// create connection
export const connectDb =() => {
        mongoose.connect('mongodb://localhost:27017/Job-Search');
        //check connection
        console.log('DB connected successfully');
}