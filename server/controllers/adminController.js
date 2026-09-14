import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Blog from "../models/blog.js";
import commentmodel from "../models/comment.js";
import User from "../models/user.js";

export const adminLogin=async(req,res)=>{
 try {
   const {email,password}=req.body || {};
      if(typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password)
    {
            return res.status(400).json({success:false,message:"Email and password are required"})
    }

      const user=await User.findOne({email:email.trim().toLowerCase(),isActive:true}).select('+passwordHash');
      const isPasswordValid=user && await bcrypt.compare(password,user.passwordHash);
      if(!isPasswordValid)
      {
            return res.status(401).json({success:false,message:"Invalid credentials"})
      }

      const token=jwt.sign(
         {id:user._id.toString(),email:user.email,role:user.role},
         process.env.JWT_SECRET,
         {expiresIn:process.env.JWT_EXPIRES_IN || '1h'}
      );
      res.json({success:true,token})
 } catch (error) {
      res.status(500).json({success:false,message:"Unable to complete login"})
 }
}
//admin can see all the blogs whether thay are published or unpublished
export const getAllBlogsAdmin=async(req,res)=>{
try {
   const blogs=await Blog.find({}).sort({createdAt:-1});
   res.json({success:true,blogs});
} catch (error) {
   res.json({success:false,message:error.message}) 
}
}
export const getAllCommentsAdmin=async(req,res)=>{
   try {
      // using populate
      //  You get the full blog document embedded in the blog field. 
      //  This is the output your code produces:
      const comments=await commentmodel.find({}).populate("blog").sort({createdAt:-1});
      res.json({success:true,comments});
   } catch (error) {
      res.json({success:false,message:error.message}) 
   }

}
export const getDashboard=async(req,res)=>{
   const recentBlogs=await Blog.find({}).sort({createdAt:-1}).limit(5);
   const Blogs=await Blog.countDocuments();
   const comments=await commentmodel.countDocuments();
   const drafts=await Blog.countDocuments({isPublished:false});
   const dashboardData={
      Blogs,recentBlogs,comments,drafts
   }
   res.json({ success: true, data: dashboardData });
}
//function where admin can delete comment
export const deleteCommentById=async(req,res)=>{
   try {
     const {id}=req.body;
     await commentmodel.findByIdAndDelete(id);
     res.json({success:true,message:"Comment deleted successfully"})
   } catch (error) {
      res.json({success:false,message:error.message}) 
   }
}
//function to approve the cooments 
export const approveCommentsById=async(req,res)=>{
   try {
     const {id}=req.body;
     await commentmodel.findByIdAndUpdate(id,{isApproved:true});

     res.json({success:true,message:"Comment Approved successfully"})
   } catch (error) {
      res.json({success:false,message:error.message});
   }
}