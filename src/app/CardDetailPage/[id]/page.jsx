'use client';
import Loading from '@/app/components/Loading/Loading';
import { useGetCardByIdQuery } from '@/lib/services/blogApi';
import { useParams } from 'next/navigation';
import React from 'react';

export default function CardDetaipagePage() {
  const { id } = useParams();
  const { data: blog, isLoading, error } = useGetCardByIdQuery({ id });

  if (isLoading) return <Loading/>;

  if (error) return <p className="text-center text-red-500 mt-10">Failed to load blog.</p>;

  if (!blog) return <p className="text-center mt-10">No blog found with ID: {id}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 capitalize">{blog.title}</h1>
      <p className="text-sm mb-2">By {blog.authorEmail}</p>
      <p className="text-xs mb-4">{new Date(blog.createdAt).toLocaleDateString()}</p>
      <div className="text-base leading-relaxed">{blog.content}</div>
    </div>
  );
}
