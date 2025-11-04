import connectDB from "@/lib/dbConnect";
import userModel from "@/model/User";
import { Message } from "@/model/User";
export async function POST(req: Request) {
  await connectDB();
  try {
    const { username, content } = await req.json();
    console.log('data',username,content)
    if (!username || !content) {
      return Response.json(
        {
          success: false,
          message: "content or username are required",
        },
        { status: 400 }
      );
    }
    const user = await userModel.findOne({
      username,
    });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "no user found ",
        },
        { status: 401 }
      );
    }
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "user is not accepting messages",
        },
        { status: 401 }
      );
    }
    const newMsg= { content, createdAt: new Date() };

    user.messages.push(newMsg as Message);
    await user.save();
    return Response.json(
      { message: "Message sent successfully", success: true },
      { status: 201 }
    );
  } catch (error) {
    console.log("error in seding msg", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error ",
      },
      { status: 500 }
    );
  }
}
