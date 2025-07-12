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

export default function BlogCreator({ blog = null }) {
  const { data: session, status } = useSession();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [image, setImage] = useState(null);

  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef();
  const handleImageInput = () => {
    fileInputRef.current.click();
  }

  const allowedExtensions = ["jpg", "jpeg", "png"];
  const checkFiles = () => {
    const check = image.name.substring(image.name.lastIndexOf(".") + 1);
    
    if(!allowedExtensions.includes(check)){
      setImage(null)
      return toast.error("Please upload jpg, jpeg or png image format");
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
    if (!description.trim()) {
      setMessage('Please type some initial text or a topic for AI generation.');
      return;
    }
    setIsGenerating(true);
    setMessage('Generating content with AI...');

       // generate blog
    try {
      const result = await generateBlogContent({ prompt: description.trim(), existingContent: description.trim() }).unwrap();
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
        await updateBlog({ id: blog._id, updatedData: { title, content: description } }).unwrap();
        setMessage('Blog updated successfully!');
      } 
      
    // create blog      
      else {
        await createBlog({ title, content: description }).unwrap();
        setMessage('Blog created successfully!');
      }

      setTitle('');
      setDescription('');
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
          accept="image/"
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
          <label htmlFor="description" className="block text-sm font-medium mb-2">Blog Content</label>
          <textarea
            id="description"
            rows={10}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full rounded-md ring-1 p-2 focus:ring-2"
            required
          />
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={isGenerating || status !== 'authenticated'}
            >
              <ButtonBorder>
                {isGenerating ? 'Generating...' : 'Generate with AI'}
              </ButtonBorder>
            </button>
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
