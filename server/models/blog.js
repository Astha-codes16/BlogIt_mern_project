//blog model
// Create a Model class called Blog that interacts with the MongoDB collection named blogs."
import mongoose, { Mongoose } from "mongoose";
const blogSchema=new mongoose.Schema({
    title:{type:String},
    subtitle:{type:String},
    description:{type:String},
    category:{type:String},
    image:{type:String},
    isPublished:{type:Boolean,default:false},
    author:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:false},

//this timestamps will automatically get the current data and time
},{timestamps:true})
//it will create a model using this schema
const Blog=mongoose.model('blog',blogSchema)
export default Blog;
//we will add controller function to add the new data