import React from 'react'
import { assets } from '../assets/assets'
const Header = () => {
  return (
    <div className='mx-16 sm:mx-8 xl:mx-24 relative'>
        <div className='text-center mt-20 mb-8'>
        <div className='inline-flex justify-center items-center gap-1 px-2 py-2.5 text-sm border border-primary bg-primary/10 text-primary rounded-full'>
    <p>New: AI feature integrated</p>
    <img src={assets.star_icon} className='w-2.5'/>

        </div>
        <h1 className='text-3xl my-2 sm:text-6xl font-semibold sm:leading-16 text-gray-700'>Your Own <span className='text-primary'>Blogging</span> <br/>Platform.</h1>
        <p className='my-6 sm:my-8 max-w-2xl m-auto max-sm:text-xs text-gray-500'>This is your space to think out loud, to share what matters, and to write without filters. Whether it's one word or a thousand, your story starts right here.</p>
        <form className='flex justify-between max-w-lg max-sm:scale-75 mx-auto border border-gray-300 bg-white rounded overflow-hidden gap-1'>
            <input type='text' placeholder='Search for Blogs' className='outline-none pl-4 w-full'></input>
            <button type='Submit' className='bg-primary text-white px-8 py-2  rounded hover:scale-105 transition-all cursor-pointer'>Search</button>
        </form>
        </div>
      <img src={assets.gradientBackground} className='absolute -top-20 -z-1 opacity-50'/>
    </div>
  )
}

export default Header
