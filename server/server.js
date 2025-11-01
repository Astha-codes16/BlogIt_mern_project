import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors'
import connectDB from './configs/db.js';
import adminRouter from './routes/adminRoutes.js';
import { adminLogin } from './controllers/adminController.js';
import blogRouter from './routes/BlogRoutes.js';
const app=express();
await connectDB();
//Middlware
app.use(cors());
app.use(express.json());
//routes--
app.get('/',(req,res)=>res.send("API is working"))
//adding admin route 
//to test this we open postman api
//we send email and password at this end point
app.use('/api/admin',adminRouter)
//using this api endpoint user can upload a new blog post,image will be uploade on media kit 
// and we will get optimized image url that we can display on our webpage
app.use('/api/blog',blogRouter)
const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
export default app;