'use client';

import { useGetBlogsQuery } from '@/lib/services/blogApi';
import React from 'react';
import ButtonBorder from '../Buttons/Button_border/ButtonBorder';
import BlogCard from '../BlogCard/BlogCard';
import Loading from '../Loading/Loading';

export default function AllPublicBlogs() {
  const { data: blogs, isLoading, error, refetch } = useGetBlogsQuery({});

  if (isLoading) {
    return (
      <div>
        <Loading/>
      </div>
    );
  }

  if (error) {
    console.error("Error fetching all blogs:", error);
    return (
      <div className="flex flex-col items-center justify-center py-10 ">
        <p className="text-2xl font-semibold text-red-400 mb-4">
          Failed to load all blogs: {error.error || error.status ? `Error ${error.status}` : 'Unknown Error'}
        </p>
        <button
          onClick={refetch}
          className="px-6 py-3 rounded-md text-[#42047e]transition-colors duration-200 shadow-lg"
        >
          Retry Loading All Blogs
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-[1600px] p-2 md:p-0 mx-auto">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-center mb-8">
          All Blogs
        </h2>
        <div className='grid justify-items-center'>

          {blogs && blogs.length > 0 ? (
            blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog}/>
            ))
          ) : (
            <p className="col-span-full text-center text-xl">No blogs found yet. Be the first to create one!</p>
          )}
        </div>

      </div>
    </>
  );
}
