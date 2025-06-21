"use server";
import bcrypt from "bcrypt";
import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";

export const registerUser = async (payload) => {
    const userCollection = dbConnect(collectionNamesObj.userCollection)
    //validation

    const { email, password} = payload;
    if(!email || !password) return {success: false, error: "Invalid input"};

    const user = await userCollection.findOne({email: payload.email})
    if(!user){
        const hashedPassword =  await bcrypt.hash(password, 10)
        payload.password = hashedPassword
        const result =  await userCollection.insertOne(payload);
        result.insertedId = result.insertedId.toString();
        
        return {
            success: true,
            insertedId: result.insertedId.toString(),
        };
    }
return { success: false, error: "User already exists" };
}