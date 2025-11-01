//blog model
import mongoose, { Mongoose } from "mongoose";
const commentSchema=new mongoose.Schema({
   blog:{type:mongoose.Schema.Types.ObjectId,ref:'blog',required:true},
   name:{type:String,required:true},
   content:{type:String,required:true},
   isApproved:{type:Boolean,default:false},


//this timestamps will automatically get the current data and time
},{timestamps:true})
//it will create a model using this schema
const commentmodel=mongoose.model('comment',commentSchema);
export default commentmodel;
//we will add controller function to add the new data