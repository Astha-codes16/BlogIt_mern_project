import React, { useEffect, useState } from 'react'
import { assets, blogCategories } from '../../assets/assets'
import { useRef } from 'react';
import Quill from 'quill';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import {parse} from 'marked';
const AddBlog = () => {
  const {axios}=useAppContext()
  const [isAdding,setIsadding]=useState(false);
  const [isLoading,setLoading]=useState(false);
  const [image,setImage]=useState(false);
  const [title,setTitle]=useState('');
  const [subtitle,setSubtitle]=useState('');
  const [isPublished,setisPublished]=useState(false);
  const [category,setCategory]=useState('Startup');
  const editorRef=useRef(null);
  const quillRef=useRef(null);
 
  const GenerateContent=async()=>{
if(!title)
{
  return toast.error('Please Enter a title')
}
try {
  setLoading(true);
  const {data}=await axios.post('/api/blog/generate',{prompt:title})
  if(data.success)
{
  quillRef.current.root.innerHTML=parse(data.content)
}
else{
  toast.error(data.message)
}
} catch (error) {
  toast.error(error.message)
}
finally{
  //after generating data it will set the loading to false
  setLoading(false);
}
  }
  const onSubmitHandler=async(e)=>{
    try {
      e.preventDefault();
      setIsadding(true);
      const blog={
        title,subtitle,
        description:quillRef.current.root.innerHTML,
        category,isPublished
      }
      const formData=new FormData();
      formData.append('blog',JSON.stringify(blog))
      formData.append('image',image)
      const {data}=await axios.post('/api/blog/add',formData);
      if(data.success)
      {
        toast.success(data.message);
        setImage(false);
        setTitle('');
        setSubtitle('');
        quillRef.current.root.innerHTML=''
        setCategory('Startup');
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    finally{
      setIsadding(false)
    }

  }
  useEffect(()=>{
  //initiate Quill only once
  if(!quillRef.current && editorRef.current){
    quillRef.current=new Quill(editorRef.current,{theme:'snow'})
  }
  },[])
  return (
     <form onSubmit={onSubmitHandler} className='flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll'>
<div className='bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded'>
<p>Upload Thumbnail</p>
<label htmlFor='image'>
  <img src={!image?assets.upload_area:URL.createObjectURL(image)} className='mt-2 h-16 rounded cursor-pointer' />
  <input onChange={(e)=>{
    setImage(e.target.files[0])
  }} type="file" id='image' hidden required />
</label>
<p className='mt-4'>Blog Title</p>
<input type='text' placeholder='Type Here'
 required className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded ' onChange={e=>setTitle(e.target.value)} value={title}/>
 <p className='mt-4'>Subtitle</p>
<input type='text' placeholder='Type Here'
 required className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded ' onChange={e=>setSubtitle(e.target.value)} value={subtitle}/>
 <p className='mt-4'>Blog Description</p>
<div className='max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative'>
  <div ref={editorRef}></div>
  {isLoading && (<div className='absolute right-0 top-0 bottom-0 left-0  flex items-center justify-center bg-black/10 mt-2'>
  {/* //spinning animation */}
  <div className='w-8 h-8  rounded-full border-2 border-t-white animate-spin'>
    

  </div>
    </div>)}
   <button type='button' disabled={isLoading} onClick={GenerateContent} className='absolute bottom-1 right-2  text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cusor-pointer' >Generate with AI</button>
</div>
<p className='mt-4'>Blog Category</p>
<select onChange={e=>setCategory(e.target.value)}name="category"  className='mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded'>
  <option value="">Select Category</option>
  {blogCategories.map((item,index)=>{
    return <option key={index} value={item}>{item}</option>


  })}
</select>
<div className='flex gap-4 mt-4'>
  Publish Now
  <input type="checkbox" checked={isPublished} className='scale-125 cursoe-pointer' onChange={e=>{
    setisPublished(e.target.checked)
  }}/>
</div>
<button disabled={isAdding} type="submit" className='flex items-center gap-2 rounded text-sm mt-4  bg-primary text-white px-10 py-2.5 cursor-pointer'>{isAdding?'Adding':'Add Blog'}</button>
 </div>
     </form>
  )
}

export default AddBlog
