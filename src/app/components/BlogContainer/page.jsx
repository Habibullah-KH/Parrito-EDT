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
import Swal from 'sweetalert2';

export default function BlogContainerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: blogs, isLoading, error, refetch } = useGetUserBlogsByEmailQuery(
    { email: session?.user?.email },
    { skip: status !== 'authenticated' || !session?.user?.email }
  );

  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

  const handleDelete = async (blogId) => {

  Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then( async (result) => {
  if (result.isConfirmed) {
      try {
        await deleteBlog(blogId).unwrap();
        toast.success('Blog deleted successfully!');
        refetch();
      } catch (err) {
        console.error('Failed to delete blog:', err);
        toast.error(`Failed to delete blog: ${err.data?.message || err.message}`);
      }
    Swal.fire({
      title: "Deleted!",
      text: "Your file has been deleted.",
      icon: "success"
    });
  }
});

  
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
