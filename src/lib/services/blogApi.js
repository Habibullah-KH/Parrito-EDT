import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const blogApi = createApi({
  reducerPath: 'blogApi', // Unique key for this API slice
  baseQuery: fetchBaseQuery({
    baseUrl: '/api', // Base URL for your Next.js API routes
    prepareHeaders: (headers, { getState }) => {
      // You can add authentication tokens from NextAuth session here if needed for protected API routes
      // Example (simplified, assuming you get session on server-side then pass token or rely on httpOnly cookies):
      // const session = (getState() as RootState).auth.session; // If you store session in Redux state
      // if (session?.accessToken) {
      //   headers.set('authorization', `Bearer ${session.accessToken}`);
      // }
      return headers;
    },
  }),
  tagTypes: ['Blog'], // Define tags for caching and invalidation
  endpoints: (builder) => ({
    // Query to get all blog posts
    getBlogs: builder.query({
      query: () => 'blogs', // Corresponds to /api/blogs GET
      providesTags: ['Blog'], // Tags this query for caching
    }),
    // Mutation to create a new blog post
    createBlog: builder.mutation({
      query: (newBlog) => ({
        url: 'blogs', // Corresponds to /api/blogs POST
        method: 'POST',
        body: newBlog,
      }),
      invalidatesTags: ['Blog'], // Invalidates 'Blog' tag, triggering refetch of getBlogs
    }),
    // Mutation to generate blog content using AI
    generateBlogContent: builder.mutation({
      query: ({ prompt, existingContent }) => ({
        url: 'generate-blog-content', // Corresponds to /api/generate-blog-content POST
        method: 'POST',
        body: { prompt, existingContent },
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetBlogsQuery, useCreateBlogMutation, useGenerateBlogContentMutation } = blogApi;