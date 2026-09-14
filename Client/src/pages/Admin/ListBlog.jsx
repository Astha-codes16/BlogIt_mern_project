import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import BlogTableItem from '../../components/Admin/BlogTableItem';
import { useAppContext } from '../../context/AppContext';
const ListBlog = () => {
    const [blogs,setBlogs]=useState([]);
    const { axios,user } = useAppContext();
    const fetchBlogs=async ()=>{
try {
  //data is the data we are getting from the API 
  const endpoint=user?.role==='admin' ? '/api/admin/blogs' : '/api/blog/all';
  const {data}=await axios.get(endpoint)
  if(data.success)
  {
    const availableBlogs=user?.role==='author'
      ? data.blogs.filter(blog=>blog.author===user.id || blog.author?._id===user.id)
      : data.blogs;
    setBlogs(availableBlogs)
  }
  else{
    toast.error(data.message)
  }
} catch (error) {
  toast.error(error.message)
}
    }
    useEffect(()=>{
        fetchBlogs()
    },[user])
  return (
    <div className='flex-1 pt-5 px-5 sm:pl-16 bg-blue-50/50'>
      <h1>All Blogs</h1>
      
              <div className='relative max-w-4xl h-4/5 mt-4 overflow-x-auto shadow rounded-lg scrollbar-hide bg-white'>
                <table className='w-full text-sm text-gray-500'>
                  <thead className='text-xs text-gray-600 text-left uppercase'>
                    <tr>
                      <th scope='col' className='px-2 py-4 xl:px-6'>#</th>
                      <th scope='col' className='px-2 py-4'>Blog Title</th>
                      <th scope='col' className='px-2 py-4 max-sm:hidden'>Date</th>
                      <th scope='col' className='px-2 py-4 max-sm:hidden'>Status</th>
                      <th scope='col' className='px-2 py-4'>Actions</th>
                    </tr>
                  </thead>
      
                  <tbody>
                    {/* we are passing this data in BlogTableItem */}
                    {blogs.map((blog, index) => (
                      <BlogTableItem
                        key={blog._id}
                        blog={blog}
                        fetchBlogs={fetchBlogs}
                        index={index + 1}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
    </div>
  )
}

export default ListBlog