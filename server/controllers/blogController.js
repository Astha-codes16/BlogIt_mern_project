import fs from 'fs';
import cloudinary from '../configs/cloudinary.js'; // ⬅️ NEW IMPORT
import Blog from '../models/blog.js';
import BlogVersion from '../models/blogVersion.js';
import commentmodel from '../models/comment.js';
import main from '../configs/GEMINI.js';
import { canManageBlog } from '../middleware/authorize.js';
export const addBlog = async (req, res) => {
    try {
        if(typeof req.body?.blog !== 'string'){
            return res.status(400).json({success:false,message:'Blog data is required'});
        }

        let blogData;
        try {
            blogData=JSON.parse(req.body.blog);
        } catch (error) {
            return res.status(400).json({success:false,message:'Invalid blog data'});
        }

        const {title, subtitle, description, category, isPublished}=blogData;
        const imagefile = req.file;

        // 1. Initial Validation
        if (!title || !description || !subtitle || !category || typeof isPublished !== 'boolean' || !imagefile) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields (title, description, subtitle, or image).'
            });
        }

        // --- CLOUDINARY UPLOAD ---
        // Cloudinary can directly upload from the local file path (req.file.path),
        // making fs.readFileSync unnecessary, but using the path is common.
        
        // 2. Cloudinary Upload
        const uploadOptions = {
            folder: 'blog-images',
            // Apply transformations during upload for optimization: 
            // 1280px width, auto quality, and convert to WebP format.
            transformation: [
                { width: 1280, crop: "limit", quality: "auto" },
                { fetch_format: "webp" }
            ],
            // Use original filename for easier management
            public_id: imagefile.originalname.split('.').slice(0, -1).join('_') 
        };

        // Upload the file from the temporary path created by Multer
        const response = await cloudinary.uploader.upload(imagefile.path, uploadOptions);

        // 3. Get the optimized URL (Cloudinary provides the final URL in the response)
        const image = response.secure_url;
        
        // --- END CLOUDINARY ---

        // 4. Database Save
        await Blog.create({title, subtitle, description, category, image, isPublished, author:req.user.id});
        
        // 5. Success and File Cleanup (Crucial for Multer)
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path); 
        }

        res.status(201).json({success: true, message: 'Blog added successfully'});

    } catch (error) {
        // ... (Your existing robust error handling remains the same) ...
        console.error("Error during blog creation:", error); 

        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.error("Error cleaning up temp file:", unlinkError);
            }
        }
        
        // Check for Cloudinary-specific authentication errors
        if (error.http_code === 401 || error.http_code === 400) {
            return res.status(401).json({ 
                success: false, 
                message: "Cloudinary Authentication Failed. Check your CLOUDINARY_URL.", 
                details: error.message 
            });
        }
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: error.message, source: 'Mongoose Validation' });
        }
        
        res.status(500).json({
            success: false, 
            message: 'A server error occurred before database validation.', 
            details: error.message 
        });
    }
}
export const createBlogDraft=async(req,res)=>{
    try {
        const createdBlog=await Blog.create({
            author:req.user.id,
            isPublished:false
        });

        return res.status(201).json({
            success:true,
            message:'Draft created successfully',
            blog:createdBlog
        });
    } catch (error) {
        return res.status(500).json({success:false,message:'Unable to create draft'});
    }
}
export const updateBlog=async(req,res)=>{
    try {
        const {title,subtitle,description,category,isPublished}=req.body || {};
        if(typeof title !== 'string' || typeof description !== 'string' || typeof category !== 'string' || typeof isPublished !== 'boolean'){
            return res.status(400).json({success:false,message:'Invalid blog update data'});
        }

        req.blog.title=title;
        req.blog.subtitle=subtitle;
        req.blog.description=description;
        req.blog.category=category;
        req.blog.isPublished=isPublished;
        await req.blog.save();
        res.json({success:true,message:'Blog updated successfully'});
    } catch (error) {
        res.status(500).json({success:false,message:'Unable to update blog'});
    }
}
export const createBlogVersion=async(req,res)=>{
    try {
        const {id}=req.params;
        if(!id){
            return res.status(400).json({success:false,message:'Blog id is required'});
        }

        const blog=await Blog.findById(id);
        if(!blog){
            return res.status(404).json({success:false,message:'Blog not found'});
        }

        if(!canManageBlog(req.user,blog)){
            return res.status(403).json({success:false,message:'You cannot modify this blog'});
        }

        const version=await BlogVersion.create({
            blog:blog._id,
            author:blog.author || req.user.id,
            title:blog.title,
            subtitle:blog.subtitle,
            description:blog.description,
            category:blog.category,
            image:blog.image
        });

        return res.status(201).json({
            success:true,
            message:'Blog version created successfully',
            version
        });
    } catch (error) {
        if(error.name === 'CastError'){
            return res.status(400).json({success:false,message:'Invalid blog id'});
        }
        return res.status(500).json({success:false,message:'Unable to create blog version'});
    }
}
export const getBlogVersions=async(req,res)=>{
    try {
        const {id}=req.params;
        if(!id){
            return res.status(400).json({success:false,message:'Blog id is required'});
        }

        const blog=await Blog.findById(id);
        if(!blog){
            return res.status(404).json({success:false,message:'Blog not found'});
        }

        if(!canManageBlog(req.user,blog)){
            return res.status(403).json({success:false,message:'You cannot view this blog history'});
        }

        const versions=await BlogVersion.find({blog:blog._id}).sort({createdAt:-1});
        return res.status(200).json({success:true,versions});
    } catch (error) {
        if(error.name === 'CastError'){
            return res.status(400).json({success:false,message:'Invalid blog id'});
        }
        return res.status(500).json({success:false,message:'Unable to load blog versions'});
    }
}
// Autosaves the current draft without creating a BlogVersion snapshot.
export const updateBlogDraft=async(req,res)=>{
    try {
        const {id}=req.params;
        if(!id){
            return res.status(400).json({success:false,message:'Blog id is required'});
        }

        const blog=await Blog.findById(id);
        if(!blog){
            return res.status(404).json({success:false,message:'Blog not found'});
        }

        if(!canManageBlog(req.user,blog)){
            return res.status(403).json({success:false,message:'You cannot modify this blog'});
        }

        const allowedFields=['title','subtitle','description','category','image','isPublished'];
        const body=req.body || {};
        for(const field of allowedFields){
            if(Object.prototype.hasOwnProperty.call(body,field) && body[field] !== undefined){
                blog[field]=body[field];
            }
        }

        await blog.save();

        return res.status(200).json({
            success:true,
            message:'Draft saved successfully',
            blog
        });
    } catch (error) {
        if(error.name === 'CastError'){
            return res.status(400).json({success:false,message:'Invalid blog id'});
        }
        return res.status(500).json({success:false,message:'Unable to save draft'});
    }
}
//function to get all blogs
export const getAllBlogs=async(req,res)=>{
    try {
        const blogs=await Blog.find({isPublished:true})
        res.json({success:true,blogs})
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
}
//getting individual blog data
export const getBlogById=async(req,res)=>{
try {
    const {blogid}=req.params;
    const blog=await Blog.findById(blogid)
    if(!blog)
    {
        return res.status(404).json({success:false,message:"Blog Not found"})
    }
    res.json({success:true,blog})
} catch (error) {
    if(error.name === 'CastError'){
        return res.status(404).json({success:false,message:"Blog Not found"});
    }
    res.status(500).json({ success: false, message: "Unable to load blog" });
}
}
//function to delete any blog
export const deleteBlogById=async(req,res)=>{
    try {
        const {id}=req.body;

        await req.blog.deleteOne();
        //delete all commnets associated with this blog as well
        // "Go into the comments collection and delete every document where
        //  the blog field is equal to "60d5c0..."."
        await commentmodel.deleteMany({blog:id});
        res.json({success:true,message:"Blog deleted successfully"})
    } catch (error) {
        res.json({ success: false, message: error.message }); 
    }
    }
    //function to publish or not publish a blog
    export const togglePublish=async(req,res)=>{
        try {
           req.blog.isPublished=!req.blog.isPublished;
           //making the changes in data base as well
           await req.blog.save();
           res.json({success: true, message:'Blog status updated'})
        } catch (error) {
            res.json({ success: false, message: error.message }); 
        }
    }
    //to create api endpoints for these functions we open blog routes
    //function to add comments
    export const addComment=async(req,res)=>{
        try {
            //we get these data from frontend to add comments
            const {blog,name,content}=req.body;
            await commentmodel.create({blog,name,content});
            res.json({success:true,message:"comment added for review"})
        } catch (error) {
            res.json({ success: false, message: error.message }); 
        }
    }
    export const getBlogcomments=async(req,res)=>{
        try {
            const {blog}=req.body;
            const comments=await commentmodel.find({blog:blog,isApproved:true}).sort({createdAt:-1});
            res.json({success:true,comments})   
        } catch (error) {
          res.json({ success: false, message: error.message });
        }
    }
    export const generateContent=async(req,res)=>{
      try {
        //whenever we make api call we have to pass response in body
        const {prompt}=req.body;
        const content=await main(prompt+'Generate a blog content for this topic in a simple text format')
        res.json({success:true,content})
      } catch (error) {
        res.json({success:false,message: error.message })
      }
    }