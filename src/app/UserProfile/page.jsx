"use client";
import { useSession } from 'next-auth/react';
import React from 'react';
import PrivateRoute from '../components/PrivateRoue/PrivateRoute';

export default function UserProfileCard() {
      const {data : session} = useSession();
  return (
    <PrivateRoute>
    <div className="max-w-xs mx-auto p-4 border rounded-xl shadow-md text-center">
      <img
        src={session?.user?.image}
        alt={session?.user.name}
        className="w-20 h-20 rounded-full mx-auto mb-3 border"
      />
      <h2 className="text-lg font-semibold">{session?.user.name}</h2>
      <p className="text-sm">{session?.user.email}</p>
    </div>
    </PrivateRoute>
  );
}
