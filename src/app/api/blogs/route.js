import { authOptions } from '@/lib/authOptions';
import dbConnect, { collectionNamesObj } from '@/lib/dbConnect';
import { getServerSession } from 'next-auth'; // To get the user session on the server
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      // You might want to allow public viewing of blogs, or restrict to logged-in users.
      // For now, let's assume blogs are public for viewing on the main page.
      // If restricted, return: return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const blogCollection = await dbConnect(collectionNamesObj.blogCollection);
    const blogs = await blogCollection.find({}).toArray(); // Fetch all blogs
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ message: "Failed to fetch blogs." }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) { // Ensure user is logged in and has an ID
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
      authorId: session.user.id, // Associate blog with the logged-in user
      authorEmail: session.user.email, // Store author email for display
      createdAt: new Date(),
    });

    return NextResponse.json({ message: 'Blog created successfully', blogId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json({ message: "Failed to create blog." }, { status: 500 });
  }
}
