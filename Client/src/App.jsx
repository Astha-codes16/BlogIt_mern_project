import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Blog from './pages/Blog'
import Layout from './pages/Admin/Layout'
import Dashboard from './pages/Admin/Dashboard'
import AddBlog from './pages/Admin/AddBlog'
import ListBlog from './pages/Admin/ListBlog'
import Comments from './pages/Admin/Comments'
import Login from './pages/Admin/Login'
import 'quill/dist/quill.snow.css'
const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
         <Route path='/test' element={<ListBlog/>}/>
        <Route path='/blog/:id' element={<Blog/>}/>
        <Route path='/admin' element={true?<Layout/>:<Login/>}>
        <Route index element={<Dashboard/>}/>
        <Route path='AddBlog' element={<AddBlog/>}/>
        <Route path='ListBlog' element={<ListBlog/>}/>
        <Route path='Comments' element={<Comments/>}/>
        </Route>
        
      </Routes>
    </div>
  )
}

export default App
