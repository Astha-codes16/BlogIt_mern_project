import Blog from '../models/blog.js';

const authorize=(...requiredRoles)=>{
    return (req,res,next)=>{
        if(!req.user || !requiredRoles.includes(req.user.role)){
            return res.status(403).json({success:false,message:'Insufficient permissions'});
        }
        next();
    };
};

export const authorizeBlogOwnership=(idSource='body')=>{
    return async(req,res,next)=>{
        try {
            const blogId=idSource === 'params' ? req.params.id : req.body?.id;
            if(!blogId){
                return res.status(400).json({success:false,message:'Blog id is required'});
            }

            const blog=await Blog.findById(blogId);
            if(!blog){
                return res.status(404).json({success:false,message:'Blog not found'});
            }

            if(req.user.role !== 'admin' && (!blog.author || blog.author.toString() !== req.user.id)){
                return res.status(403).json({success:false,message:'You cannot modify this blog'});
            }

            req.blog=blog;
            next();
        } catch (error) {
            if(error.name === 'CastError'){
                return res.status(404).json({success:false,message:'Blog not found'});
            }
            next(error);
        }
    };
};

export default authorize;