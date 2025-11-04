import connectDB from "@/lib/dbConnect";
import userModel from "@/model/User";
import { verifyUserName } from "@/schemas/signUp.schema";

export async function GET(req: Request) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    console.log(searchParams);
    const username = searchParams.get("username");
    console.log("this is username from params", username);
    const checkedUserNameByZod = verifyUserName.safeParse(username);
    console.log(checkedUserNameByZod);
    if (!checkedUserNameByZod.success) {
      return Response.json({
        success: false,
        message: checkedUserNameByZod?.error.issues[0].message,
      });
    }
    const ValidatedUserName = await userModel.findOne({
      username,
      isVerified: true,
    });
    if (ValidatedUserName) {
      return Response.json({
        success: false,
        message: "user name already taken",
      });
    }
    return Response.json({
      success: true,
      message: "Username is unique",
    });
  } catch (error) {
    console.log("Error in name resolve", error);
    return Response.json({
      success: false,
      message: "error in name resolve",
    });
  }
}
