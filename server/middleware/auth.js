import jwt from 'jsonwebtoken';

const auth=(req,res,next)=>{
const authorization=req.headers.authorization;
if(!authorization || !authorization.startsWith('Bearer ')){
    return res.status(401).json({success:false,message:'Authentication required'});
}

const token=authorization.slice(7).trim();
if(!token){
    return res.status(401).json({success:false,message:'Authentication required'});
}

try {
    const payload=jwt.verify(token,process.env.JWT_SECRET);
    req.user={id:payload.id,email:payload.email,role:payload.role};
    next();
} catch (error) {
    return res.status(401).json({success:false,message:error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token'});
}
}
export default auth;