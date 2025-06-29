'use client';

import React from 'react'
import ButtonBorder from '../Buttons/Button_border/ButtonBorder';
import { useTheme } from '../Theme/useTheme';
import { useRouter } from 'next/navigation';
export default function BlogCard({blog}) {
  const router = useRouter();
  const {darkMode} = useTheme();

  const cardDetailNavigator = (blogId) => {
    router.push(`/CardDetailPage/${blogId}`)
  }
  return (
    <>
<div
  className={`
    backdrop-blur-md p-6 border-b max-w-[45rem]
    ${darkMode == "enabled" ? "border-gray-700" : "border-gray-200"}
    transition-all duration-300
  `}
>
  <div className="grid grid-cols-5 items-center gap-4">
    {/* Text container */}
    <div className="col-span-3">
      <h3 className="text-2xl font-semibold mb-2">{blog.title}</h3>
      <p className="text-[0.8rem] line-clamp-4">{blog.content}</p>

      <p className="text-sm mt-4">
        By {blog.authorEmail || 'Unknown'}
      </p>

      <p className="text-sm">
        {new Date(blog.createdAt).toLocaleDateString()}
      </p>
    </div>

    {/* Empty space to push image to end */}
    <div className="col-span-1"></div>

    {/* Image container */}
    <div className="w-[8rem] h-[5rem] overflow-hidden rounded-md col-span-1 justify-self-end">
      <img
        className="w-full h-full object-cover"
        src="./billi.jpeg"
        alt="blog_image"
      />
    </div>
  </div>

  {/* Read more button */}
  <div className="text-[0.8rem] flex justify-end mt-2">
    <button
    onClick={() => cardDetailNavigator(blog._id)}
    >
      <ButtonBorder>
        readmore
      </ButtonBorder>
    </button>
  </div>
</div>

    </>
  )
}
