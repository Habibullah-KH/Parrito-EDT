// app/components/BlogCreator.js
'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCreateBlogMutation, useGenerateBlogContentMutation } from '@/lib/services/blogApi';
import ButtonFill from '../Buttons/Button_fill/ButtonFill';
import ButtonBorder from '../Buttons/Button_border/ButtonBorder';


export default function BlogCreator() {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  // RTK Query hooks
  const [createBlog] = useCreateBlogMutation();
  const [generateBlogContent] = useGenerateBlogContentMutation();

  const handleGenerateAI = async () => {
    if (!description.trim()) {
      setMessage('Please type some initial text or a topic for AI generation.');
      return;
    }
    setIsGenerating(true);
    setMessage('Generating content with AI...');
    try {
      // Call the RTK Query mutation to generate content
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
      setMessage('You must be logged in to create a blog.');
      return;
    }

    if (!title.trim() || !description.trim()) {
      setMessage('Please fill in both title and description.');
      return;
    }

    setIsSaving(true);
    setMessage('Saving blog post...');
    try {
      // Call the RTK Query mutation to create a blog
      const result = await createBlog({ title, content: description }).unwrap();
      setMessage(`Blog saved successfully! ID: ${result.blogId}`);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Failed to save blog:', error);
      setMessage(`Failed to save blog: ${error.data?.message || error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-xl sm:mt-20 p-6 backdrop-blur-md rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-center mb-8">
        Create Your Blog Post
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium leading-6">
            Blog Title
          </label>
          <div className="mt-2">
            <input
              id="title"
              name="title"
              type="text"
              autoComplete="off"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full rounded-md border py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium leading-6 ">
            Blog Content
          </label>
          <div className="mt-2">
            <textarea
              id="description"
              name="description"
              rows={10}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 p-2"
              placeholder="Start typing your blog post or provide a topic for AI generation..."
              required
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={isGenerating || status !== 'authenticated'}
              className="px-4 py-2 font-semibold "
            >
            <ButtonBorder>
             {isGenerating ? 'Generating...' : 'Generate with AI'}   
            </ButtonBorder>  
            </button>
          </div>
        </div>

        <div className="text-center">
          {message && <p className="mt-4 text-sm font-semibold text-red-400">{message}</p>}
        </div>

        <div>
          <button
            type="submit"
            disabled={isSaving || status !== 'authenticated'}
            className="w-full"
          >
            {isSaving ? 'Saving...' : <ButtonFill>Submit Blog</ButtonFill>}
          </button>
        </div>
      </form>
    </div>
  );
}
