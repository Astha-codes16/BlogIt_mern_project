import React, { useEffect, useState } from 'react'
import { assets, blogCategories } from '../../assets/assets'
import { useRef } from 'react';
import Quill from 'quill';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import {parse} from 'marked';
const AddBlog = () => {
  const {axios,token}=useAppContext()
  const [isAdding,setIsadding]=useState(false);
  const [isLoading,setLoading]=useState(false);
  const [saveStatus,setSaveStatus]=useState('idle');
  const [versions,setVersions]=useState([]);
  const [showVersions,setShowVersions]=useState(false);
  const [versionsLoading,setVersionsLoading]=useState(false);
  const [versionsError,setVersionsError]=useState('');
  const [versionSaving,setVersionSaving]=useState(false);
  const [image,setImage]=useState(false);
  const [title,setTitle]=useState('');
  const [subtitle,setSubtitle]=useState('');
  const [description,setDescription]=useState('');
  const [isPublished,setisPublished]=useState(false);
  const [category,setCategory]=useState('Startup');
  const editorRef=useRef(null);
  const quillRef=useRef(null);
  const draftIdRef=useRef(null);
  const draftCreationGuardRef=useRef(false);
  const draftGenerationRef=useRef(0);
  const draftSessionRef=useRef(0);
  const autosaveSequenceRef=useRef(0);
  const autosaveTimeoutRef=useRef(null);
  const hasChangesRef=useRef(false);
  const isAddingRef=useRef(false);
  const versionsRequestRef=useRef(false);
  const versionSaveRef=useRef(false);
  const [draftSession,setDraftSession]=useState(0);

  const setDraftId=(id)=>{
    draftIdRef.current=id;
    setDraftIdState(id);
  };
  const [draftIdState,setDraftIdState]=useState(null);

  const fetchVersions=async()=>{
    if(!draftIdState || versionsRequestRef.current){
      return;
    }

    versionsRequestRef.current=true;
    setVersionsLoading(true);
    setVersionsError('');
    try {
      const {data}=await axios.get(`/api/blog/${draftIdState}/versions`);
      if(data.success){
        setVersions(data.versions);
      } else {
        setVersionsError(data.message || 'Unable to load versions');
      }
    } catch (error) {
      setVersionsError(error.response?.data?.message || error.message || 'Unable to load versions');
    } finally {
      versionsRequestRef.current=false;
      setVersionsLoading(false);
    }
  };

  const toggleVersionHistory=async()=>{
    const nextShowVersions=!showVersions;
    setShowVersions(nextShowVersions);
    if(nextShowVersions){
      await fetchVersions();
    }
  };

  const saveVersion=async()=>{
    if(!draftIdState || versionSaveRef.current){
      return;
    }

    versionSaveRef.current=true;
    setVersionSaving(true);
    try {
      const {data}=await axios.post(`/api/blog/${draftIdState}/version`);
      if(data.success){
        toast.success(data.message);
        await fetchVersions();
      } else {
        toast.error(data.message || 'Unable to save version');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Unable to save version');
    } finally {
      versionSaveRef.current=false;
      setVersionSaving(false);
    }
  };
 
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
    setDescription(quillRef.current.root.innerHTML)
    hasChangesRef.current=true
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
      isAddingRef.current=true;
      autosaveSequenceRef.current+=1;
      clearTimeout(autosaveTimeoutRef.current);
      const blog={
        title,subtitle,
        description:quillRef.current?.root.innerHTML ?? description,
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
        setDescription('');
        setisPublished(false);
        quillRef.current.root.innerHTML=''
        setCategory('Startup');
        hasChangesRef.current=false;
        draftGenerationRef.current+=1;
        draftCreationGuardRef.current=false;
        setDraftId(null);
        draftSessionRef.current+=1;
        setDraftSession(draftSessionRef.current);
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    finally{
      setIsadding(false)
      isAddingRef.current=false;
    }

  }
  useEffect(()=>{
  // Initiate Quill only once and use its text changes for autosave.
  if(!quillRef.current && editorRef.current){
    quillRef.current=new Quill(editorRef.current,{theme:'snow'})
  }

  const handleTextChange=()=>{
    setDescription(quillRef.current.root.innerHTML);
    hasChangesRef.current=true;
  };
  quillRef.current?.on('text-change',handleTextChange);

  return ()=>{
    quillRef.current?.off('text-change',handleTextChange);
  };
  },[])
  useEffect(()=>{
    if(!token || draftCreationGuardRef.current){
      return;
    }

    draftCreationGuardRef.current=true;
    const generation=draftGenerationRef.current;
    const session=draftSessionRef.current;
    axios.post('/api/blog/draft')
      .then(({data})=>{
        if(generation!==draftGenerationRef.current || session!==draftSessionRef.current){
          return;
        }
        setDraftId(data.blog._id);
      })
      .catch(()=>{
        if(generation===draftGenerationRef.current && session===draftSessionRef.current){
          setSaveStatus('error');
          toast.error('Unable to create draft');
        }
      });
  },[axios,draftSession,token])
  useEffect(()=>{
    if(!draftIdState || !hasChangesRef.current || isAdding){
      return;
    }

    const sequence=++autosaveSequenceRef.current;
    clearTimeout(autosaveTimeoutRef.current);
    autosaveTimeoutRef.current=setTimeout(async()=>{
      if(isAddingRef.current){
        return;
      }

      setSaveStatus('saving');
      try {
        await axios.put(`/api/blog/${draftIdState}/draft`,{
          title,
          subtitle,
          description:quillRef.current?.root.innerHTML ?? description,
          category,
          isPublished
        });

        if(sequence===autosaveSequenceRef.current && !isAddingRef.current && draftIdRef.current===draftIdState){
          setSaveStatus('saved');
        }
      } catch (error) {
        if(sequence===autosaveSequenceRef.current && !isAddingRef.current){
          if(import.meta.env.DEV){
            console.error('Draft autosave failed',{
              requestUrl:`/api/blog/${draftIdState}/draft`,
              status:error.response?.status,
              responseData:error.response?.data,
              message:error.message
            });
          }
          setSaveStatus('error');
          toast.error(error.response?.data?.message || error.message || 'Unable to save draft');
        }
      }
    },2000);

    return ()=>clearTimeout(autosaveTimeoutRef.current);
  },[axios,category,description,draftIdState,isAdding,isPublished,subtitle,title])
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
 required className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded ' onChange={e=>{setTitle(e.target.value); hasChangesRef.current=true}} value={title}/>
 <p className='mt-4'>Subtitle</p>
<input type='text' placeholder='Type Here'
 required className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded ' onChange={e=>{setSubtitle(e.target.value); hasChangesRef.current=true}} value={subtitle}/>
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
{saveStatus==='saving' && <p className='text-xs text-gray-500'>Saving...</p>}
{saveStatus==='saved' && <p className='text-xs text-green-600'>Draft saved ✓</p>}
{saveStatus==='error' && <p className='text-xs text-red-500'>Unable to save draft</p>}
{draftIdState && <div className='mt-4 border-t border-gray-200 pt-4'>
  <div className='flex flex-wrap items-center gap-3'>
    <button type='button' onClick={toggleVersionHistory} disabled={versionsLoading || versionSaving} className='border border-gray-300 rounded px-3 py-1.5 text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-60'>
      {showVersions?'Hide Version History':'Version History'}
    </button>
    <button type='button' onClick={saveVersion} disabled={versionSaving || versionsLoading} className='bg-primary text-white rounded px-3 py-1.5 text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-60'>
      {versionSaving?'Saving Version...':'Save Version'}
    </button>
  </div>
  {showVersions && <div className='mt-3 space-y-3'>
    {versionsLoading && <p className='text-sm text-gray-500'>Loading versions...</p>}
    {versionsError && <p className='text-sm text-red-500'>{versionsError}</p>}
    {!versionsLoading && !versionsError && versions.length===0 && <p className='text-sm text-gray-500'>No versions yet.</p>}
    {!versionsLoading && !versionsError && versions.map((version)=>(
      <div key={version._id} className='border border-gray-200 rounded p-3 text-sm'>
        <div className='flex flex-wrap justify-between gap-2 text-xs text-gray-500'>
          <span>{new Date(version.createdAt).toLocaleString()}</span>
          <span>{version.category || 'Uncategorized'}</span>
        </div>
        <p className='mt-1 font-medium text-gray-700'>{version.title || 'Untitled draft'}</p>
        <p className='mt-1 text-xs text-gray-500 line-clamp-2'>{version.description || 'No description'}</p>
      </div>
    ))}
  </div>}
</div>}
<p className='mt-4'>Blog Category</p>
<select onChange={e=>{setCategory(e.target.value); hasChangesRef.current=true}}name="category"  className='mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded'>
  <option value="">Select Category</option>
  {blogCategories.map((item,index)=>{
    return <option key={index} value={item}>{item}</option>


  })}
</select>
<div className='flex gap-4 mt-4'>
  Publish Now
  <input type="checkbox" checked={isPublished} className='scale-125 cursoe-pointer' onChange={e=>{
    setisPublished(e.target.checked)
    hasChangesRef.current=true
  }}/>
</div>
<button disabled={isAdding} type="submit" className='flex items-center gap-2 rounded text-sm mt-4  bg-primary text-white px-10 py-2.5 cursor-pointer'>{isAdding?'Adding':'Add Blog'}</button>
 </div>
     </form>
  )
}

export default AddBlog
