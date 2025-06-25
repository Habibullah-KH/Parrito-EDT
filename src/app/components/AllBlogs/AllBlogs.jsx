// app/components/AllPublicBlogs.js
'use client'; // This component will use client-side hooks

import { useGetBlogsQuery } from '@/lib/services/blogApi';
import React from 'react';
// import Link from 'next/link'; // Uncomment if you add a "Read More" link

export default function AllPublicBlogs() {
  // This query will fetch ALL blogs because no userId is passed
  const { data: blogs, isLoading, error, refetch } = useGetBlogsQuery({}); // Pass empty object to get all blogs

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10 ">
        <p className="text-2xl font-semibold">Loading all blogs...</p>
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
      <div className="w-full max-w-4xl p-2 md:p-0 mx-auto">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-center mb-8">
          All Blogs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {blogs && blogs.length > 0 ? (
            blogs.map((blog) => (
              <div
                key={blog._id}
                className=" backdrop-blur-md rounded-2xl shadow-xl p-6 border20  transition-all duration-300"
              >
                <h3 className="text-2xl font-semibold mb-2">{blog.title}</h3>
                <p className=" line-clamp-4">{blog.content}</p>
                <p className=" text-sm mt-4">
                  By {blog.authorEmail || 'Unknown'}
                </p>
                <p className=" text-sm">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                {/* You can add a "Read More" link here if you have a detailed blog post page */}
                {/* <Link href={`/blog/${blog._id}`} className="mt-4 inline-block text-indigo-300 hover:underline">Read More</Link> */}
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-xl">No blogs found yet. Be the first to create one!</p>
          )}
        </div>
      </div>
    </>
  );
}
