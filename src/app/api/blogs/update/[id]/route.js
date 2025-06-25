import dbConnect, { collectionNamesObj } from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

export async function PUT(req, { params }) {
  const blogId = params.id;
  const body = await req.json();

  const blogCollection = await dbConnect(collectionNamesObj.blogCollection);

  const result = await blogCollection.updateOne(
    { _id: new ObjectId(blogId) },
    { $set: body }
  );

  if (result.modifiedCount === 1) {
    return new Response(JSON.stringify({ message: 'Blog updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    return new Response(JSON.stringify({ message: 'Failed to update blog' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
