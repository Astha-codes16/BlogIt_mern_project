import React, { useState } from 'react'
import { blog_data, blogCategories } from '../assets/assets'
import { motion } from "motion/react"
import BlogCard from './BlogCard'
import { useAppContext } from '../context/AppContext'

const BlogList = () => {
    const [menu,setMenu]=useState("All")
    //displaying data from database
    const {blogs,input}=useAppContext()

    const filteredBlogs = () => {
      // ✅ FIX: Check if 'blogs' is an array. If not, return an empty array []
      if (!Array.isArray(blogs)) {
          return [];
      }
      
      if(input==='')
      {
        return blogs
      }
      
      // Now it's safe to call .filter because we know 'blogs' is an array.
      return blogs.filter((blog)=>
          blog.title.toLowerCase().includes(input.toLowerCase()) || 
          blog.category.toLowerCase().includes(input.toLowerCase())
      )
    }

  return (
    <div>
      <div className='flex justify-center gap-4 sm:gap-8 my-10 relative'>
{blogCategories.map((item)=>(<div key={item} className='relative'>
    <button onClick={()=>setMenu(item)} className={`cursor-pointer text-gray-500 ${menu===item && 'text-white px-4 pt-0.5'}`}>{item}
        {menu==item && (<motion.div
        layoutId='underline'
        transition={{type:'spring', stiffness:500,damping:30}}
        className='absolute left-0 right-0 top-0 h-7 -z-1 bg-primary rounded-full'></motion.div>)}
        
    </button>
</div>))}
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40'>
        {/* Line 31/33 is now safe because filteredBlogs() returns [] if blogs is undefined */}
        {filteredBlogs().filter((blog)=>menu==="All" ? true :blog.category===menu).map((blog)=><BlogCard key={blog._id} blog={blog}/>)}
      </div>
    </div>
  )
}

export default BlogList