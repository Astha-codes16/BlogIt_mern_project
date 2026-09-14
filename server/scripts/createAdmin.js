import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import connectDB from '../configs/db.js';
import User from '../models/user.js';

dotenv.config();

const createAdmin=async()=>{
    const email=process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password=process.env.ADMIN_PASSWORD;

    if(!email || !password){
        throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required');
    }

    await connectDB();
    const passwordHash=await bcrypt.hash(password,12);
    await User.findOneAndUpdate(
        {email},
        {email,passwordHash,role:'admin',isActive:true},
        {upsert:true,new:true,setDefaultsOnInsert:true}
    );
};

createAdmin()
    .then(async()=>{
        await import('mongoose').then(({default:mongoose})=>mongoose.disconnect());
        process.exit(0);
    })
    .catch((error)=>{
        console.error(error.message);
        process.exit(1);
    });