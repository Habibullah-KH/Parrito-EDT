'use client';
import React from 'react'
import PrivateRoute from '../PrivateRoue/PrivateRoute'
import BlogCreator from './BlogCreator'
import { useSession } from 'next-auth/react';

export default function BlogCreatorPage() {
      const { data: session, status } = useSession();
  return (
    <>
        <PrivateRoute>
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

        <div className="mx-auto max-w-4xl text-center mt-14">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-balance">
            Your Personal Blog Posts
          </h1>
          <p className="mt-4 text-xl">Create, view, and manage your own content.</p>
        </div>

        {status === 'authenticated' && (
          <div className="w-full max-w-xl mb-16 mx-auto">
            <BlogCreator />
          </div>
        )}
        </PrivateRoute>
    </>
  )
}
