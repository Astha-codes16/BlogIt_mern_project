import express from "express";
import auth from "../middleware/auth.js";
import { adminLogin, approveCommentsById, deleteCommentById, getAllBlogsAdmin, getAllCommentsAdmin, getDashboard } from "../controllers/adminController.js";
const adminRouter=express.Router();
//whenever we hit this /login then adminLogin function will be executed
adminRouter.post('/login',adminLogin);
adminRouter.get('/comments',auth,getAllCommentsAdmin);
adminRouter.get('/blogs',auth,getAllBlogsAdmin);
adminRouter.post('/deletecomment',auth,deleteCommentById);
adminRouter.post('/approveComment',auth,approveCommentsById);
adminRouter.get('/dashboard',auth,getDashboard);
//exporting this router
export  default adminRouter
//now we are going to add this in our server.js