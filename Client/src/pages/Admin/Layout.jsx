import React from 'react'
import { assets } from '../../assets/assets'
import {  Outlet } from 'react-router-dom'  // ✅ import Outlet
import Sidebar from './Sidebar'
import { useAppContext } from '../../context/AppContext';
const Layout = () => {
     // ✅ lowercase by convention
  const {axios,setToken,navigate}=useAppContext();

  const logout = () => {
    localStorage.removeItem('token');
    axios.defaults.headers.common['Authorization']=null;
    setToken(null);
    navigate('/')
  }

  return (
    <>
      {/* Header */}
      <div className='flex  items-center  justify-between p-4 '>
        <img 
          src={assets.logo} 
          alt="Logo" 
          className='w-32 sm:w-40 cursor-pointer' 
          onClick={() => navigate('/')} 
        />
        <button 
          onClick={logout} 
          className='bg-primary text-white rounded p-2 px-8 hover:scale-102 transition-all cursor-pointer'>
          Logout
        </button>
      </div>

    <div className='flex h-[calc(100vh-70px)]'>
        
          <Sidebar/>
        <Outlet/>
    </div>
    </>
  )
}

export default Layout
