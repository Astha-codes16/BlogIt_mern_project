import mongoose from 'mongoose';

const blogVersionSchema=new mongoose.Schema({
    blog:{type:mongoose.Schema.Types.ObjectId,ref:'blog',required:true},
    author:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:false},
    title:{type:String,required:false},
    subtitle:{type:String,required:false},
    description:{type:String,required:false},
    category:{type:String,required:false},
    image:{type:String,required:false}
},{timestamps:true});

const BlogVersion=mongoose.model('BlogVersion',blogVersionSchema);
export default BlogVersion;
