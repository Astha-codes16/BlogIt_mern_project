import mongoose from 'mongoose';

const userSchema=new mongoose.Schema({
    name:{type:String,trim:true},
    email:{type:String,required:true,unique:true,trim:true,lowercase:true},
    passwordHash:{type:String,required:true,select:false},
    role:{type:String,required:true,enum:['admin','author','user'],default:'user'},
    isActive:{type:Boolean,default:true}
},{timestamps:true});

const User=mongoose.model('User',userSchema);
export default User;