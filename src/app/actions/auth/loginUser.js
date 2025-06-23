        // app/actions/auth/loginUser.js
        "use server";
        import bcrypt from "bcrypt";
        import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
        // import { ObjectId } from 'mongodb'; // Optional, not strictly needed for this file's return

        export const loginUser = async (payload) => {
          const { email, password } = payload;

          try {
            const userCollection = await dbConnect(collectionNamesObj.userCollection);

            if (!userCollection || typeof userCollection.findOne !== 'function') {
              console.error("Database connection or User collection not correctly retrieved.");
              return null;
            }

            // Find the user in the database by email
            const user = await userCollection.findOne({ email });

            if (!user) {
              console.error(`Login attempt failed: User with email "${email}" not found.`);
              return null;
            }

            // Compare the plaintext password with the hashed password from the database
            const isPasswordOk = await bcrypt.compare(password, user.password);

            if (!isPasswordOk) {
              console.error(`Login attempt failed: Invalid password for user "${email}".`);
              return null;
            }

            // Return a serializable user object, ensuring _id is converted to a string 'id'
            // and include other necessary fields like email and name.
            return {
              _id: user._id, // Keep _id as ObjectId for further server-side use if needed (e.g. for debug)
              id: user._id.toString(), // CRUCIAL: Convert ObjectId to string for NextAuth.js 'id' property
              email: user.email,
              name: user.name || user.email, // Include name, fallback to email if not present
            };

          } catch (error) {
            console.error("An unexpected error occurred during login process:", error);
            return null;
          }
        };
        