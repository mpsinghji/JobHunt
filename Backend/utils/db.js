import mongoose from "mongoose";

const connectDB = async() =>{
    try {
        const con=await mongoose.connect(process.env.MONGODB_URL,{
            dbName: "JobHunt",
        });
        console.log(`MongoDB connected successfully`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default connectDB;