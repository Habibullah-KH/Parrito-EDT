// lib/services/blogApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      // For NextAuth.js, session cookies are typically handled automatically by the browser
      // and sent with each request to your /api routes, so manual header addition for session
      // is often not needed here.
      return headers;
    },
  }),
  tagTypes: ['Blog'], // Define tags for caching and invalidation
  endpoints: (builder) => ({
    // 1. Query to get ALL blog posts (for public view)
    getBlogs: builder.query({
      query: () => 'blogs', // This will now ONLY fetch from /api/blogs (all blogs)
      providesTags: ['Blog'], // Tags this query for caching
    }),
    
    // 2. NEW Query to get blogs filtered by user email (for private dashboard view)
    getUserBlogsByEmail: builder.query({
      query: ({ email }) => {
        // This will fetch from /api/blogs/by-email?email=user@example.com
        return `blogs/by-email?email=${email}`;
      },
      // Note: We might also tag this with 'Blog' if creating/deleting any blog
      // should trigger a refetch of user's specific blogs.
      // If user-specific blogs are very isolated, you might use a more specific tag like 'UserBlog'.
      providesTags: ['Blog'], 
    }),

    getCardById: builder.query({
      query: ({id}) => {
        return `blogs/by-id?id=${id}`;
      },
      providesTags: ['Blog'],
    }),

    // Mutation to create a new blog post
    createBlog: builder.mutation({
      query: (newBlog) => ({
        url: 'blogs', // Corresponds to /api/blogs POST
        method: 'POST',
        body: newBlog,
      }),
      invalidatesTags: ['Blog'], // Invalidates 'Blog' tag, triggering refetch of relevant queries
    }),

    // Mutation to delete a blog post by ID
    deleteBlog: builder.mutation({
      query: (blogId) => ({
        url: `blogs/${blogId}`, // Corresponds to /api/blogs/[id] DELETE
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog'], // Invalidate the 'Blog' tag to refetch lists after deletion
    }),

    // Mutation to generate blog content using AI
    generateBlogContent: builder.mutation({
      query: ({ prompt, existingContent }) => ({
        url: 'generate-blog-content', // Corresponds to /api/generate-blog-content POST
        method: 'POST',
        body: { prompt, existingContent },
      }),
    }),

    //update user blog
// lib/services/blogApi.js
updateBlog: builder.mutation({
  query: ({ id, updatedData }) => ({
    url: `blogs/${id}`,
    method: 'PUT',
    body: updatedData,
  }),
  invalidatesTags: ['Blog'],
})


  }),
});

// Export all hooks for usage in functional components
export const {
  useGetBlogsQuery,
  useGetUserBlogsByEmailQuery, 
  useGetCardByIdQuery, 
  useCreateBlogMutation,
  useDeleteBlogMutation,
  useGenerateBlogContentMutation,
  useUpdateBlogMutation
} = blogApi;
