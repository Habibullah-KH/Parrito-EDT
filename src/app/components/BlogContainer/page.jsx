'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useGetUserBlogsByEmailQuery, useDeleteBlogMutation } from '@/lib/services/blogApi';
import { FaEdit, FaTrash } from 'react-icons/fa';
import PrivateRoute from '../PrivateRoue/PrivateRoute';
import ButtonFill from '../Buttons/Button_fill/ButtonFill';
import BlogCreator from '../BlogCreator/BlogCreator';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Loading from '../Loading/Loading';

export default function BlogContainerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: blogs, isLoading, error, refetch } = useGetUserBlogsByEmailQuery(
    { email: session?.user?.email },
    { skip: status !== 'authenticated' || !session?.user?.email }
  );

  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteBlog(blogId).unwrap();
        toast.success('Blog deleted successfully!');
        refetch();
      } catch (err) {
        console.error('Failed to delete blog:', err);
        toast.error(`Failed to delete blog: ${err.data?.message || err.message}`);
      }
    }
  };

  const handleEdit = (blogId) => {
    router.push(`/UpdateBlog/${blogId}`);
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr">
      <Loading/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr p-6">
        <p className="text-2xl font-semibold text-red-400 mb-4">
          Failed to load your blogs: {error.error || error.status}
        </p>
        <button onClick={refetch} className="mt-4 px-4 py-2 rounded-md">
          <ButtonFill>Retry</ButtonFill>
        </button>
      </div>
    );
  }

  if (status === 'unauthenticated' || !session?.user?.email) {
    return null;
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen flex flex-col items-center md:p-6 bg-gradient-to-tr relative">
        {/* Background gradient blur */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-1/2 -z-10 aspect-[1155/678] w-[72.1875rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#07f49e] to-[#42047e] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[90rem]"
          />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-balance">
            Your Personal Blog Posts
          </h1>
          <p className="mt-4 text-xl">Create, view, and manage your own content.</p>
        </div>

        {status === 'authenticated' && (
          <div className="w-full max-w-xl mb-16">
            <BlogCreator />
          </div>
        )}

        <div className="w-full max-w-4xl p-2 md:p-0">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-center mb-8">
            Your Blogs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          
            {blogs && blogs.length > 0 ? (
              blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="backdrop-blur-md rounded-2xl shadow-xl p-6 transition-all duration-300 border"
                >
                  <h3 className="text-2xl font-semibold mb-2">{blog.title}</h3>
                  <p className="line-clamp-4">{blog.content}</p>
                  <p className="text-sm mt-4">By {blog.authorEmail || 'You'}</p>
                  <p>{new Date(blog.createdAt).toLocaleDateString()}</p>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      onClick={() => handleEdit(blog._id)}
                      className="p-2 rounded-full transition-colors disabled:opacity-50"
                      title="Edit Blog"
                      disabled={isDeleting}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="p-2 rounded-full transition-colors disabled:opacity-50"
                      title="Delete Blog"
                      disabled={isDeleting}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-xl">
                You haven't created any blogs yet. Be the first to create one!
              </p>
            )}
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}
