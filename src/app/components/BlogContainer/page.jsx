// app/page.js
'use client';
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetBlogsQuery } from '@/lib/services/blogApi';
import BlogCreator from '../BlogCreator/BlogCreator';
import ButtonFill from '../Buttons/Button_fill/ButtonFill';
import PrivateRoute from '../PrivateRoue/PrivateRoute';

export default function Blog() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: blogs, isLoading, error, refetch } = useGetBlogsQuery(); // Fetch blogs using RTK Query

  useEffect(() => {
    // Optionally redirect if not logged in for certain features or paths
    // For a Medium-like app, the main page might be public, but creating blogs requires login.
    // This example focuses on displaying all blogs.
  }, [status, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr">
        <p className="text-2xl font-semibold">Loading blogs...</p>
      </div>
    );
  }

  if (error) {
    console.error("Error fetching blogs:", error);
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr p-6">
        <p className="text-2xl font-semibold text-red-400">Failed to load blogs: {error.error || error.status}</p>
        <button onClick={refetch} className="mt-4 px-4 py-2 rounded-md">Retry</button>
      </div>
    );
  }

  return (
    <PrivateRoute>
    <div className="min-h-screen flex flex-col items-center md:p-6 bg-gradient-to-tr">
      {/* Background blur element */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-1/2 -z-10 aspect-1155/678 w-144.5 max-w-none -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#07f49e] to-[#42047e] opacity-30 sm:left-[calc(50%-40rem)] sm:w-288.75"
        />
      </div>

      <div className="mx-auto max-w-4xl text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-balance">
          Welcome to Your Blog Platform
        </h1>
        <p className="mt-4 text-xl">
          Share your thoughts, read articles, and create content with AI assistance.
        </p>
        {status === 'unauthenticated' && (
          <Link href="/Login" className="mt-6 inline-block font-semibold rounded-lg shadow-lg transition-colors">
          <ButtonFill>
           <p className='p-1'>Login to Create Blogs</p> 
          </ButtonFill>
          </Link>
        )}
      </div>

      {/* Blog Creator Component */}
      {status === 'authenticated' && (
        <div className="w-full max-w-xl mb-16">
          <BlogCreator />
        </div>
      )}

      {/* Display All Blogs Section */}
      <div className="w-full max-w-4xl p-2 md:p-0">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-center mb-8">
          All Blogs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {blogs && blogs.length > 0 ? (
            blogs.map((blog) => (
              <div key={blog._id}
               className="backdrop-blur-md rounded-2xl shadow-xl p-6  transition-all duration-300 border">
                <h3 className="text-2xl font-semibold mb-2">{blog.title}</h3>
                <p className=" line-clamp-4">{blog.content}</p>
                <p className=" text-sm mt-4">
                  By {blog.authorEmail || 'Unknown'}
                </p>
                <p>{new Date(blog.createdAt).toLocaleDateString()}</p>
                {/* You can add a "Read More" link here if you have a detailed blog post page */}
                {/* <Link href={`/blog/${blog._id}`} className="mt-4 inline-block text-indigo-300 hover:underline">Read More</Link> */}
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-red-400 text-xl">No blogs found. Be the first to create one!</p>
          )}
        </div>
      </div>
    </div>
    </PrivateRoute>
  );
}
