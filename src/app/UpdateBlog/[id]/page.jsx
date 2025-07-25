// app/UpdateBlog/[id]/page.jsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUpdateBlogMutation } from '@/lib/services/blogApi';
import { toast } from 'react-toastify';
import ButtonFill from '@/app/components/Buttons/Button_fill/ButtonFill';
import Loading from '@/app/components/Loading/Loading';

export default function UpdateBlogPage() {
  const { id } = useParams();
  const router = useRouter();
  const [updateBlog, { isLoading }] = useUpdateBlogMutation();

  const [blogData, setBlogData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);

  if(loading){
    return <Loading/>;
  }
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${id}`);
        if (!res.ok) throw new Error('Failed to load blog');
        const data = await res.json();
        setBlogData({ title: data.title, content: data.content });
        setLoading(false);
      } catch (err) {
        toast.error(err.message);
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    setBlogData({ ...blogData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateBlog({ id, updatedData: blogData }).unwrap();
      toast.success('Blog updated successfully!');
      router.push('/components/BlogContainer');
    } catch (err) {
      toast.error('Failed to update blog');
    }
  };

  if (loading) return <p className="text-center mt-10 text-xl"><Loading/></p>;

  return (
    <div className="max-w-xl mx-auto my-20 p-6 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={blogData.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Content</label>
          <textarea
            name="content"
            value={blogData.content}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md h-40"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading} 
          className='w-full'
          >
          <ButtonFill>
          {isLoading ? 'Updating...' : 'Update Blog'}
          </ButtonFill>
        </button>
      </form>
    </div>
  );
}
