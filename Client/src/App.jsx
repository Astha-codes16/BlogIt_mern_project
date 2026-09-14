import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Blog from './pages/Blog'
import Layout from './pages/Admin/Layout'
import Dashboard from './pages/Admin/Dashboard'
import AddBlog from './pages/Admin/AddBlog'
import ListBlog from './pages/Admin/ListBlog'
import Comments from './pages/Admin/Comments'
import Login from './pages/Admin/Login'
import 'quill/dist/quill.snow.css'
import {Toaster} from 'react-hot-toast'
import { useAppContext } from './context/AppContext'
const App = () => {
  const {token,user,authReady}=useAppContext()
  const canManageBlogs=['admin','author'].includes(user?.role)
  return (
    <div>
      <Toaster/>
      <test/>
      <Routes>
        <Route path='/' element={<Home/>}/>
         <Route path='/test' element={<ListBlog/>}/>
        <Route path='/blog/:id' element={<Blog/>}/>
        <Route path='/admin' element={!authReady?null:token&&canManageBlogs?<Layout/>:token?<Navigate to='/' replace/>:<Login/>}>
        <Route index element={user?.role==='admin'?<Dashboard/>:<Navigate to='/admin/AddBlog' replace/>}/>
        <Route path='AddBlog' element={<AddBlog/>}/>
        <Route path='ListBlog' element={<ListBlog/>}/>
        <Route path='Comments' element={user?.role==='admin'?<Comments/>:<Navigate to='/admin/AddBlog' replace/>}/>
        </Route>
        
      </Routes>
    </div>
  )
}

export default App
