// import type { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import userModel from "@/model/User";
import { JWT } from "next-auth/jwt";
// import { string } from "zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Enter Username or Email", type: "text" },
        identifier: { label: "Enter Username or Email", type: "text" },
        password: { label: "Enter Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        console.log("this is your credentials", credentials);

        try {
          const User = await userModel.findOne({
            $or: [
              { email: credentials?.identifier },
              { username: credentials?.identifier },
            ],
          });
          console.log("this is user from db ", User);
          if (!User) {
            console.log("error from !user");
            return null;
            // throw new Error("No user found with this credentials");
          }
          console.log("after");
          if (!User.isVerified) {
            console.log("error from !user.isVerified");
            return null;
            // throw new Error(
            //   "Please verify your account first before proceding to SignIn"
            // );
          }
          const strPass = credentials.password as string;
          console.log("this is pass", strPass);
          const isPasswordValid = await bcrypt.compare(
            strPass,
            User.password.toString()
          );
          const hashedPassword = await bcrypt.hash(strPass, 10);
          console.log("hashed pass", hashedPassword);
          console.log("this is pass matching ", isPasswordValid);
          if (isPasswordValid) {
            return User;
          } else {
            return null;
            // throw new Error("Incorrect Password!");
          }
        } catch (err) {
          throw new Error(
            "Error in login User app :: api :: auth :: [...nextauth] :: options",
            { cause: err }
          );
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        token.username = user.username;
        token._id = user._id as string;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.isVerified = user.isVerified;
      }
      return token;
    },
    async session({ token, session }) {
      if (token) {
        session.user._id = token._id as string;
        session.user.username = token.username;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.isVerified = token.isVerified;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-In",
  },
});
