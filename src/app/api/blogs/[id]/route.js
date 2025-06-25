// app/api/blogs/[id]/route.js

import { NextResponse } from 'next/server';
import dbConnect, { collectionNamesObj } from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

// GET a single blog by ID
export async function GET(req, { params }) {
  const blogId = params.id;

  if (!ObjectId.isValid(blogId)) {
    return NextResponse.json({ message: 'Invalid blog ID' }, { status: 400 });
  }

  const blogCollection = await dbConnect(collectionNamesObj.blogCollection);
  const blog = await blogCollection.findOne({ _id: new ObjectId(blogId) });

  if (!blog) {
    return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
  }

  return NextResponse.json(blog, { status: 200 });
}

// PUT (Update) a blog by ID
export async function PUT(req, { params }) {
  const blogId = params.id;

  if (!ObjectId.isValid(blogId)) {
    return NextResponse.json({ message: 'Invalid blog ID' }, { status: 400 });
  }

  const body = await req.json();
  const blogCollection = await dbConnect(collectionNamesObj.blogCollection);

  const result = await blogCollection.updateOne(
    { _id: new ObjectId(blogId) },
    { $set: body }
  );

  if (result.modifiedCount === 0) {
    return NextResponse.json({ message: 'Failed to update blog' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Blog updated successfully' }, { status: 200 });
}

// DELETE a blog by ID (your existing code)
export async function DELETE(req, { params }) {
  const blogId = params.id;

  if (!ObjectId.isValid(blogId)) {
    return NextResponse.json({ message: 'Invalid blog ID' }, { status: 400 });
  }

  const blogCollection = await dbConnect(collectionNamesObj.blogCollection);
  const result = await blogCollection.deleteOne({ _id: new ObjectId(blogId) });

  if (result.deletedCount === 0) {
    return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Blog deleted successfully' }, { status: 200 });
}
