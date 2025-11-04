import connectDB from "@/lib/dbConnect";
import userModel from "@/model/User";
// import { success } from "zod";

export async function POST(req: Request) {
  await connectDB();
  try {
    const { username, verifycode } = await req.json();
    console.log("this is verify code and username", username, verifycode);
    if (!username || !verifycode?.trim()) {
      return Response.json({
        success: false,
        message: "please enter the username and verify code",
      });
    }
    //   const validUser = decodeURIComponent(username);
    //   console.log('this is valid user',validUser)
    const user = await userModel.findOne({
      username,
    });
    console.log("this is user", user);
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const isValidCode = user.verifyCode === verifycode;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    console.log(
      "this is code expiry",
      isCodeNotExpired,
      new Date(),
      new Date(user.verifyCodeExpiry)
    );
    console.log("this is code expiry ", isCodeNotExpired);
    if (isValidCode && !isCodeNotExpired) {
      user.isVerified = true;
      const isSaved = await user.save();
      console.log("this is save res", isSaved);
      return Response.json(
        {
          success: true,
          message: "User verified successfully!!",
        },
        {
          status: 200,
        }
      );
    } else if (isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code has expired. Please sign up again to get a new code.",
        },
        { status: 401 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Please enter a valid Verify Code!!",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.log("there was an error in verify-code", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error!!!",
      },
      { status: 500 }
    );
  }
}
