const authorize=(requiredRole)=>{
    return (req,res,next)=>{
        if(!req.user || req.user.role !== requiredRole){
            return res.status(403).json({success:false,message:'Insufficient permissions'});
        }
        next();
    };
};

export default authorize;