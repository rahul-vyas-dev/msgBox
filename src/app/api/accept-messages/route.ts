import connectDB from "@/lib/dbConnect";
import userModel from "@/model/User";
import { auth } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function POST(req: Request) {
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
    const { isAcceptingMessages } = await req.json();
    console.log("this is user session data", user);
    const bytes = Object.values(user._id.buffer); 
    const idString = Buffer.from(bytes).toString("hex");
    const updatedUser = await userModel.findByIdAndUpdate(
      { _id: idString},
      {
        isAcceptingMessage: isAcceptingMessages,
      }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "User not found!",
        },
        { status: 401 }
      );
    }
    await updatedUser.save();
    return Response.json(
      {
        success: true,
        message: "User Updated Successfully.",
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Internal server error", error);
    return Response.json(
      {
        success: false,
        message: "failed to update user data",
      },
      { status: 500 }
    );
  }
}

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
    console.log("this is session data", user);
    const bytes = Object.values(user._id.buffer); // [104, 210, 79, ...]
    const idString = Buffer.from(bytes).toString("hex");
    const dbUser = await userModel.findById(idString);
    if (!dbUser) {
      return Response.json(
        {
          success: false,
          message: "User not found!",
        },
        { status: 401 }
      );
    }
    return Response.json({
      success: true,
      message: "status fetched successfully",
      isAcceptingMessages: user.isAcceptingMessages,
    });
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
