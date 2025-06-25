// app/api/blogs/route.js
import dbConnect, { collectionNamesObj } from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from "@/lib/authOptions";

export async function GET(req) {
  try {
    // Note: session is not directly used for filtering here, as this endpoint is for ALL blogs.
    // However, keeping getServerSession is fine if you want to ensure the server context is available.
    const session = await getServerSession(authOptions);

    // This endpoint now explicitly returns all blogs, ignoring any query parameters.
    const blogCollection = await dbConnect(collectionNamesObj.blogCollection);
    const blogs = await blogCollection.find({}).toArray(); // Fetch ALL blogs

    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error("Error fetching all blogs:", error);
    return NextResponse.json({ message: "Failed to fetch all blogs." }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ message: 'Title and content are required.' }, { status: 400 });
    }

    const blogCollection = await dbConnect(collectionNamesObj.blogCollection);
    const result = await blogCollection.insertOne({
      title,
      content,
      authorId: session.user.id,
      authorEmail: session.user.email,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: 'Blog created successfully', blogId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json({ message: "Failed to create blog." }, { status: 500 });
  }
}
