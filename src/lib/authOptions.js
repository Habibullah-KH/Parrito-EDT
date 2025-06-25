// lib/authOptions.js
import { loginUser } from "@/app/actions/auth/loginUser";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect, { collectionNamesObj } from "./dbConnect";
import { ObjectId } from 'mongodb'; // Import ObjectId to handle MongoDB _id

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Enter Email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const user = await loginUser(credentials); // loginUser should return an object like { _id: ..., email: ... }
        console.log("Authorize callback user:", user); // Debugging log
        if (user) {
          // IMPORTANT: Convert MongoDB's ObjectId to a string here
          return { id: user._id.toString(), email: user.email, name: user.name || user.email }; // Ensure 'id' is a string
        } else {
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  pages: {
    signIn: "/Login"
  },
  callbacks: {

 async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        if (account) {
          token.providerAccountId = account.providerAccountId;
          token.provider = account.provider;
        }
      }
      return token;
    },
    // This callback is called whenever a session is checked.
    async session({ session, token }) {
      // Propagate the id from the token to the session
      if (token.id) {
        session.user.id = token.id;
      }
      if (token.email) {
        session.user.email = token.email;
      }
      if (token.name) {
        session.user.name = token.name;
      }
      // You can add more custom data from token to session here
      return session;
    },
    // This callback is called on sign in, after successful authentication
    async signIn({ user, account, profile, email, credentials }) {
      console.log("signIn callback:", { user, account, profile, email, credentials });
      if (account) {
        const { providerAccountId, provider } = account;
        const userEmail = user.email;
        const name = user.name;
        const image = user.image;

        const userCollection = dbConnect(collectionNamesObj.userCollection);
        let existingUser = null;
        if (providerAccountId) {
            existingUser = await userCollection.findOne({ providerAccountId });
        } else if (userEmail) { // Fallback for credential provider
            existingUser = await userCollection.findOne({ email: userEmail });
        }

        if (!existingUser) {
          const payload = {
            providerAccountId,
            provider,
            email: userEmail,
            image,
            name,
            createdAt: new Date(),
          };
          const result = await userCollection.insertOne(payload);

          user.id = result.insertedId.toString();
        } else {

            user.id = existingUser._id.toString();
        }
      }
      return true; // Return true to allow sign in
    },
  },

};
