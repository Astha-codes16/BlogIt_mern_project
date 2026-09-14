import express from "express";
import auth from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";
import { adminLogin, approveCommentsById, deleteCommentById, getAllBlogsAdmin, getAllCommentsAdmin, getDashboard } from "../controllers/adminController.js";
const adminRouter=express.Router();
//whenever we hit this /login then adminLogin function will be executed
adminRouter.post('/login',adminLogin);
adminRouter.get('/comments',auth,authorize('admin'),getAllCommentsAdmin);
adminRouter.get('/blogs',auth,authorize('admin'),getAllBlogsAdmin);
adminRouter.post('/deletecomment',auth,authorize('admin'),deleteCommentById);
adminRouter.post('/approveComment',auth,authorize('admin'),approveCommentsById);
adminRouter.get('/dashboard',auth,authorize('admin'),getDashboard);
//exporting this router
export  default adminRouter
//now we are going to add this in our server.js