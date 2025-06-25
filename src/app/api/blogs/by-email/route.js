// app/api/blogs/by-email/route.js
import dbConnect, { collectionNamesObj } from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from "@/lib/authOptions";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    // Crucial: Only authenticated users can access their own blogs by email
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: 'Unauthorized: User email not found in session.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const targetEmail = searchParams.get('email'); // Get the email from the query parameter

    if (!targetEmail) {
      return NextResponse.json({ message: 'Email query parameter is required.' }, { status: 400 });
    }

    // Security Check: Ensure the requested email matches the logged-in user's email
    // This prevents one user from requesting another user's private blogs.
    if (session.user.email !== targetEmail) {
      return NextResponse.json({ message: 'Forbidden: You can only view your own blogs.' }, { status: 403 });
    }

    const blogCollection = await dbConnect(collectionNamesObj.blogCollection);
    const blogs = await blogCollection.find({ authorEmail: targetEmail }).toArray(); // Filter by authorEmail

    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error("Error fetching user blogs by email:", error);
    return NextResponse.json({ message: "Failed to fetch user blogs." }, { status: 500 });
  }
}
