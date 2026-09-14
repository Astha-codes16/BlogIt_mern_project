import express from "express";
import upload from "../middleware/multer.js";
import { addBlog, addComment, deleteBlogById, generateContent, getAllBlogs, getBlogById, getBlogcomments, togglePublish, updateBlog } from "../controllers/blogController.js";
import auth from "../middleware/auth.js";
import authorize, { authorizeBlogOwnership } from "../middleware/authorize.js";
const blogRouter=express.Router();
//we will send data from frontend in image property name
blogRouter.post("/add",auth,authorize('admin','author'),upload.single('image'),addBlog);
blogRouter.get("/all",getAllBlogs);
blogRouter.get("/:blogid",getBlogById);
//only admin can delete blog
blogRouter.put("/update",auth,authorize('admin','author'),authorizeBlogOwnership(),updateBlog);
blogRouter.post("/delete",auth,authorize('admin','author'),authorizeBlogOwnership(),deleteBlogById);
blogRouter.post("/togglePublish",auth,authorize('admin','author'),authorizeBlogOwnership(),togglePublish);
blogRouter.post("/addComment",addComment);
blogRouter.post("/getBlogComment",getBlogcomments);
blogRouter.post('/generate',auth,authorize('admin'),generateContent);
//also we will create an auto middleware so that only admin can add blog 
export default blogRouter;
//now we will add it in our main file wiz server.jsnpm 