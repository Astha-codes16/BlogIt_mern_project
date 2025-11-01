//blog model
// Create a Model class called Blog that interacts with the MongoDB collection named blogs."
import mongoose, { Mongoose } from "mongoose";
const blogSchema=new mongoose.Schema({
    title:{type:String,required:true},
    subtitle:{type:String},
    description:{type:String,required:true},
    category:{type:String,required:true},
    image:{type:String,required:true},
    isPublished:{type:Boolean,required:true},

//this timestamps will automatically get the current data and time
},{timestamps:true})
//it will create a model using this schema
const Blog=mongoose.model('blog',blogSchema)
export default Blog;
//we will add controller function to add the new data