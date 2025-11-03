import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

import { useParams } from 'react-router-dom'
import { assets, blog_data, comments_data } from '../assets/assets'
import Navbar from '../components/Navbar'
import Moment from 'moment'
import Footer from '../components/Footer'
import { useAppContext } from '../context/AppContext'
const Blog = () => {
  const {id}=useParams()
  const {axios}=useAppContext();

  const [data,Setdata]=useState(null)
  const [comments,setcomments]=useState([])
  const [name,setName]=useState('')
  const [content,setContent]=useState('')
  const fetchblogdata=async ()=>{
    try {
     const {data}=await axios.get(`/api/blog/${id}`)
     data.success ? Setdata(data.blog) :toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }
  const fetchComments=async()=>{
try {
  const {data}=await axios.post('/api/blog/getBlogComment',{blog:id})
  if (data.success)
  {
    setcomments(data.comments);
    console.log("Fetched Comments:", data.comments);
  }
  else
  {
    toast.error(data.message)
  }
} catch (error) {
  toast.error(error.message)
}
  }
  const addComment=async(e)=>{
e.preventDefault();
try {
  const {data}=await axios.post('/api/blog/addComment',{blog:id,name,content}) ;
  if(data.success)
  {
    toast.success(data.message)
    setName('')
    setContent('')
  }
else{
  toast.error(data.message);
}
} catch (error) {
  toast.error(error.message)
}
  }
  useEffect(()=>{
fetchblogdata()
fetchComments()
  },[])
  return data? (
    <div className='relative'>
      <img src={assets.gradientBackground} alt="" className='absolute -top-50 -z-1 opacity-50' />
      <Navbar/>
<div className='text-center mt-20 text-gray-600'>
  <p className='text-primary py-4 font-medium'>Published on {Moment(data.createdAt).format('MMMM Do YYYY')} </p>
  <h1 className='text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800'>{data.title}</h1>

  <h2 className='my-5 max-w-lg truncate mx-auto' dangerouslySetInnerHTML={{__html:data.subTitle}}></h2>
  <p className='inline-flex justify-center items-center gap-1 px-2 py-2.5 text-sm border border-primary bg-primary/10 text-primary rounded-full'>Michael Brown</p>
</div>
<div className='mx-5 max-w-5xl md:mx-auto my-10 mt-6'>
<img src={data.image} alt="" className='rounded-3xl mb-5' />
<div className='rich-text max-w-3xl mx:auto' dangerouslySetInnerHTML={{__html:data.description}}></div>
{/* commemt */}
<div className='mt-14 mb-10 max-w-3xl mx-auto'>
  <p>Comments ({comments.length})</p>
  <div className='flex flex-col gap-4'>
    
    {
    comments.map((item,index)=>(<div key={index} className='relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600'>
     <div className='flex items-center gap-2 ml-8'>
      <img src={assets.user_icon} alt="" className='w-6' />
      <span className='font-medium'>{item.name}</span>
    </div>
    
    <p className='text-sm max-w-md ml-8'>{item.content}</p>
    <div className='absolute right-4 bottom-3 flex items-center gap-2 text-xs'>
      {Moment(item.createdAt).fromNow()}
    </div>
    </div>))
    }
   
  </div>

</div>
{/* add comment section */}
<div className='max-w-3xl mx-auto' >
<p className='font-semibold mb-4'>Add your Comment</p>
<form onSubmit={addComment} className='flex flex-col items-start gap-4 max-w-lg'>
<input onChange={(e)=>setName(e.target.value)} value={name} type="text" placeholder='Name' className='w-full p-2 border border-gray-300 rounded outline-none' required/>
<textarea onChange={(e)=>setContent(e.target.value)} value={content} placeholder='Comment' className='w-full p-2 border border-gray-300 rounded outline-none' required></textarea>
<button className='bg-primary text-white rounded p-2 px-8 hover:scale-102 transition-all cursor-pointer ' type="submit">Submit</button>
</form>

</div>
{/* share buttons */}
<div className='my-24 max-w-3xl mx-auto'>
<p className='font-semibold my-4'>Share this article on Social media</p>
<div className='flex '>
  <img src={assets.facebook_icon} className='w-16' alt="" />
  <img src={assets.twitter_icon} className='w-16' alt="" />
  <img src={assets.googleplus_icon} className='w-16' alt="" />
</div>
</div>

</div>
{/* footer */}
<Footer/>
    </div>
  ) :<div>Loading..</div>
}

export default Blog
