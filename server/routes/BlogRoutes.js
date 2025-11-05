import express from "express";
import upload from "../middleware/multer.js";
import { addBlog, addComment, deleteBlogById, generateContent, getAllBlogs, getBlogById, getBlogcomments, togglePublish } from "../controllers/blogController.js";
import auth from "../middleware/auth.js";
const blogRouter=express.Router();
//we will send data from frontend in image property name
blogRouter.post("/add",upload.single('image'),auth,addBlog);
blogRouter.get("/all",getAllBlogs);
blogRouter.get("/:blogid",getBlogById);
//only admin can delete blog
blogRouter.post("/delete",auth,deleteBlogById);
blogRouter.post("/togglePublish",auth,togglePublish);
blogRouter.post("/addComment",addComment);
blogRouter.post("/getBlogComment",getBlogcomments);
blogRouter.post('/generate',auth,generateContent);
//also we will create an auto middleware so that only admin can add blog 
export default blogRouter;
//now we will add it in our main file wiz server.jsnpm 