import connectDB from "@/lib/dbConnect";
import { auth } from "../../auth/[...nextauth]/options";
import userModel, { User } from "@/model/User";
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ messageId: string }> }
) {

  const { messageId } = await params;
  const session = await auth();
  console.log("this is your session from delete route ", session);
  const user: User = session?.user;
  await connectDB();
  if (!user || !messageId) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }
  const bytes = Object.values(user?._id.buffer);
  const idString = Buffer.from(bytes).toString("hex");
  try {

    const updateResult = await userModel.updateOne(
      { _id: idString },
      {
        $pull: { messages: { _id: messageId } },
      }
    );

    if (updateResult.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error in deleting msg", error);
    return Response.json(
      { message: "Error deleting message", success: false },
      { status: 500 }
    );
  }
}