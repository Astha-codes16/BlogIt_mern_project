import { createContext, useContext } from "react";
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import toast from "react-hot-toast";
import { useEffect

 } from "react";
 import { useState } from "react";
axios.defaults.baseURL=import.meta.env.VITE_BASE_URL;
//to share global state in global components
const AppContext=createContext();
const getUserFromToken=(token)=>{
    try {
        const payload=JSON.parse(atob(token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));
        return {id:payload.id,email:payload.email,role:payload.role};
    } catch {
        return null;
    }
};
//provider func
export const AppProvider=({children})=>{
    const navigate=useNavigate();
    const [token,setTokenState]=useState(null);
    const [user,setUser]=useState(null);
    const [authReady,setAuthReady]=useState(false);
    const [blogs,setBlogs]=useState([]);
    const [input,setInput]=useState("");
    const setToken=(nextToken)=>{
        setTokenState(nextToken);
        setUser(nextToken ? getUserFromToken(nextToken) : null);
    };
    const fetchBlogs=async()=>{
        try {
            const {data} = await axios.get('/api/blog/all');
            data.success? setBlogs(data.blogs) : toast.error(data.message)
               } 
               catch (error) {
                toast.error(error.message)
        }
    }
    useEffect(()=>{
fetchBlogs();
const token =localStorage.getItem('token')
if(token){
    setToken(token)
    axios.defaults.headers.common['Authorization']=`Bearer ${token}`;
}
setAuthReady(true);
    },[])
    const value={
        axios,navigate,token,setToken,user,authReady,blogs,setBlogs,input,setInput
    }
    return(
       
        <AppContext.Provider value={value} >
            {children}
        </AppContext.Provider>
    )
}
export const useAppContext=()=>{
    return useContext(AppContext)
}