"use client"
import React, { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';

import {
  useCreateBlogMutation,
  useGenerateBlogContentMutation,
  useUpdateBlogMutation,
} from '@/lib/services/blogApi';

import ButtonFill from '../Buttons/Button_fill/ButtonFill';
import ButtonBorder from '../Buttons/Button_border/ButtonBorder';
import { toast } from 'react-toastify';
import { imageUpload } from '@/lib/utils/imageUpload';

export default function BlogCreator({ blog = null }) {
  const { data: session, status } = useSession();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false)

  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiPrompt, setAIPrompt] = useState('');


  const fileInputRef = useRef();
  const handleImageInput = () => {
    fileInputRef.current.click();
  }

  const allowedExtensions = ["jpg", "jpeg", "png"];
  const checkFiles = () => {
    const check = image.name.substring(image.name.lastIndexOf(".") + 1);
    
    if(!allowedExtensions.includes(check)){
      setImage(null)
      return toast.error("Please upload a valid image (jpg, jpeg, png)");
    }
  }   
  
  useEffect(() => {
  if(image){checkFiles()}
  }, [image])
  

  // RTK Query hooks
  const [createBlog] = useCreateBlogMutation();
  const [generateBlogContent] = useGenerateBlogContentMutation();
  const [updateBlog] = useUpdateBlogMutation();

  useEffect(() => {
    if (blog) {
      setTitle(blog.title || '');
      setDescription(blog.content || '');
    }
  }, [blog]);

  const handleGenerateAI = async () => {
if (!aiPrompt.trim()) {
  setMessage('Please enter a prompt for AI generation.');
  return;
}

    setIsGenerating(true);
    setMessage('Generating content with AI...');

       // generate blog
    try {
      const result = await generateBlogContent({
      prompt: aiPrompt.trim(),
      existingContent: description.trim(),
}).unwrap();
      setDescription(result.generatedContent);
      setMessage('Content generated successfully!');
    } catch (error) {
      console.error('Failed to generate AI content:', error);
      setMessage(`Failed to generate content: ${error.data?.message || error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!image){
      return toast.warning("Please upload you Thumbnail");
    }
    
    setLoading(true)

    if (status !== 'authenticated') {
      setMessage('You must be logged in to create or edit a blog.');
      return;
    }

    if (!title.trim() || !description.trim()) {
      setMessage('Please fill in both title and description.');
      return;
    }

    setIsSaving(true);
    setMessage(blog ? 'Updating blog post...' : 'Saving blog post...');

    // Update blog
    try {
      if (blog?._id) {
        const imageUrl = await imageUpload(image);
        console.log(imageUrl);
        await updateBlog({ id: blog._id, updatedData: { title, content: description, image: imageUrl } }).unwrap();
        toast.success('Blog updated successfully!')
        setLoading(false)
      } 
      
    // create blog      
      else {
        const imageUrl = await imageUpload(image);  
        console.log(imageUrl);
        await createBlog({ title, content: description, image: imageUrl }).unwrap();
        toast.success('Blog created successfully!')
        setLoading(false)
      }

      setTitle('');
      setDescription('');
      setImage('');
      setMessage('');
    } catch (error) {
      console.error('Blog save failed:', error);
      setMessage(`Error: ${error.data?.message || error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto mt-16 p-6 backdrop-blur-md rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-center mb-8">
        {blog ? 'Edit Your Blog Post' : 'Create Your Blog Post'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">Blog Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full rounded-md ring-1 p-2 focus:ring-2"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
        <input
          ref={fileInputRef}
          id="image"
          name="image"
          type="file"
          accept="image/jpeg, image/png, image/jpg"
          onChange={(e) => setImage(e.target.files[0])}
          className="opacity-0 absolute w-0 h-0"
          required
        />

        <label
          htmlFor="image" className="block text-sm font-medium"
        >
          {image === null
            ? "upload your picture"
            : "chose another picture"}
        </label>
        <p className="text-center text-primarry font-bold my-2">
          { image?.name ?

            image?.name.length > 25 ? 
            `${image.name.slice(0, 5)}...${image.name.slice(-4)}`
            :
            image.name

               :
               null
          }
        </p>

        <button
          onClick={handleImageInput}
          className='block w-full'
        >
          <ButtonFill>
          {image ? "Change Thumbnail" : "Upload Thumbnail"}
          </ButtonFill>
        </button>

        </div>

        {/* Content Area */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">Tell your story</label>
          <textarea
            id="description"
            rows={10}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => {
    if (e.key === 'Enter') e.preventDefault();
  }}
            className="block w-full rounded-md ring-1 p-2 focus:ring-2"
            required
          />
          
          <div className="mt-4 space-y-3">
  {/* Toggle AI Prompt Input */}
  {!showAIPrompt && (
    <div className="flex justify-end">
      <p
        onClick={() => setShowAIPrompt(true)}
        disabled={status !== 'authenticated'}
      >
        <ButtonBorder>Generate with AI</ButtonBorder>
      </p>
    </div>
  )}

  {/* AI Prompt Input */}
  {showAIPrompt && (
    <div className="space-y-2">
      <label htmlFor="aiPrompt" className="block text-sm font-medium">
        Enter a topic or idea for AI to generate:
      </label>
      <input
        id="aiPrompt"
        type="text"
        value={aiPrompt}
        onChange={(e) => setAIPrompt(e.target.value)}
        onKeyDown={(e) => {
    if (e.key === 'Enter') e.preventDefault();
  }}
        className="block w-full rounded-md ring-1 p-2 focus:ring-2"
        placeholder="e.g. Benefits of mindfulness"
      />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleGenerateAI}
          disabled={isGenerating || !aiPrompt.trim()}
        >
          <ButtonBorder>
            {isGenerating ? 'Generating...' : 'Generate'}
          </ButtonBorder>
        </button>
      </div>
    </div>
  )}
</div>

        </div>

        {/* Submit Button */}
        <div>
          {message && <p className="text-sm font-semibold">{message}</p>}
          <button type="submit" disabled={isSaving || status !== 'authenticated'} className="w-full">
            {isSaving ? 'Saving...' : <ButtonFill>{blog ? 'Update Blog' : 'Submit Blog'}</ButtonFill>}
          </button>
        </div>
      </form>
    </div>
  );
}
