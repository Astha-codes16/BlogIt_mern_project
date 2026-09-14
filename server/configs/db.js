import mongoose from "mongoose";
const connectDB=async()=>{
    const mongoUri=process.env.MONGODB_URI || process.env.MONGO_URI;
    if(!mongoUri){
        throw new Error('MONGODB_URI or MONGO_URI is required');
    }

    mongoose.connection.on('connected',()=>console.log("Database Connected"));
    await mongoose.connect(`${mongoUri.replace(/\/$/,'')}/Blogit`);
}
export default connectDB;