import mongoose from 'mongoose';

const userSchema=new mongoose.Schema({
    email:{type:String,required:true,unique:true,trim:true,lowercase:true},
    passwordHash:{type:String,required:true,select:false},
    role:{type:String,required:true,enum:['admin'],default:'admin'},
    isActive:{type:Boolean,default:true}
},{timestamps:true});

const User=mongoose.model('user',userSchema);
export default User;