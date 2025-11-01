import React from 'react'
import  { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast';

const Login = () => {
  const {axios,setToken }=useAppContext(); 
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const handleSubmit=async(e)=>{
e.preventDefault()
try {
  const {data}=await axios.post('/api/admin/login',{email,password})
  if(data.success)
  {
    setToken(data.token)
    localStorage.setItem('token',data.token)
    axios.defaults.headers.common['Authorization']=data.token;
  }
  else{
    toast.error(data.message)
  }
} catch (error) {
  toast.error(error.message)
}
  }
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg'>
        <div className='flex flex-col items-center justify-center'>
<div className='w-full py-6 text-center'>
    <h1 className='text-3xl font-bold'><span className='text-primary'>Admin</span> Login</h1>
    <p className='font-light my-2'>Enter your credentials</p>
</div>
<form onSubmit={handleSubmit} className='mt-6 w-full sm:max-w-md text-gray-600'>
  <div className='flex flex-col'>
    <label>Email</label>
    <input onChange={e=>setEmail(e.target.value)} value={email} type='email'required placeholder='Your Email Id' className='border-b-2 border-gray-300 p-2 outline-none mb-6'></input>
  </div>
   <div className='flex flex-col'>
    <label>Password</label>
    <input onChange={e=>setPassword(e.target.value)} value={password} 
      type='password' required placeholder='Your Password' className='border-b-2 border-gray-300 p-2 outline-none mb-6'></input>
  </div>
  <div className="flex justify-center">
  <button className=" w-full flex justify-center items-center gap-2 rounded text-sm bg-primary text-white px-10 py-3 my-5 cursor-pointer hover:bg-primary/90 transition-all">
    Login
  </button>
</div>

</form>
        </div>
      </div>
    </div>
  )
}

export default Login
