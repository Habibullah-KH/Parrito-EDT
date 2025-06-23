// lib/store.js
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
// Removed: import { authApi } from './services/authApi';
import { blogApi } from './services/blogApi'; // Import your blog API slice

export const store = configureStore({
  reducer: {
    // Removed: [authApi.reducerPath]: authApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer, // THIS IS CRUCIAL for blogApi
    // You can add other standard Redux reducers here later if needed
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of RTK Query.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      // Removed: .concat(authApi.middleware)
      .concat(blogApi.middleware), // THIS IS CRUCIAL for blogApi
});

// Optional: For `refetchOnFocus` and `refetchOnReconnect` behaviors
setupListeners(store.dispatch);
