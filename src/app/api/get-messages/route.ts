import connectDB from "@/lib/dbConnect";
import userModel from "@/model/User";
import { auth } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(req: Request) {
  await connectDB();
  try {
    const session = await auth();
    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "Invalid session!!",
        },
        {
          status: 401,
        }
      );
    }
    const user: User = session?.user;
    // const id = user._id.buffer
    // console.log('this is session data ', id);
    const bytes = Object.values(user._id.buffer); // [104, 210, 79, ...]
    const idString = Buffer.from(bytes).toString("hex");

    // console.log('this is array ',idString);
    const dbUser = await userModel
      .aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(idString as string) },
        },
        {
          $unwind: "$messages",
        },
        {
          $sort: { "messages.createdAt": -1 },
        },
        {
          $group: { _id: "$_id", messages: { $push: "$messages" } },
        },
      ])
      .exec();
    console.log("this is db user", dbUser);
    if (!dbUser) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized User!",
        },
        { status: 404 }
      );
    }
    // console.log('no user ');
    if (dbUser.length === 0) {
      return Response.json({ status: 204 });
    }

    return Response.json(
      { messages: dbUser[0].messages },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Internal server error", error);
    return Response.json(
      {
        success: false,
        message: "failed to get user data",
      },
      { status: 500 }
    );
  }
}
