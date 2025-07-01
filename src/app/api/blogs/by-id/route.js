import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const targetId = searchParams.get('id');

    if (!targetId) {
      return NextResponse.json({ message: 'ID query parameter is required.' }, { status: 400 });
    }

    const blogCollection = await dbConnect(collectionNamesObj.blogCollection);
    const blog = await blogCollection.findOne({
      _id: new ObjectId(targetId),
    });

    if (!blog) {
      return NextResponse.json({ message: 'Blog not found.' }, { status: 404 });
    }

    return NextResponse.json(blog, { status: 200 });

  } catch (err) {
    console.error("Error fetching blog by ID:", err); // ✅ Use correct variable name
    return NextResponse.json({ message: "Failed to fetch blog." }, { status: 500 });
  }
}
