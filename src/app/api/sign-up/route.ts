import * as bcrypt from "bcryptjs";
import userModel from "../../../model/User";
import connectDB from "../../../lib/dbConnect";
import { sendEmail } from "../../../helpers/sendVerificationEmail";
import { signUpSchema } from "@/schemas/signUp.schema";
// import { ApiResponse } from "@/utils/ApiResponse";

export async function POST(request: Request) {
  console.log('your req come to this endpint',request)
  await connectDB();
  try {
    const { username, email, password } = await request.json();
    if (!password && (!email || !username)) {
      return Response.json({
        success: false,
        message:"please enter email or username with password"
      }, {status:401})
    }
    const isValidData = signUpSchema.safeParse({
      username,
      email,
      password
    });
    console.log('this is ZOD', isValidData);
    if (!isValidData.success) {
      return Response.json({
        success: false,
        message: isValidData?.error.issues[0].message,
      });
    }

    const existingUserWithName = await userModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserWithName) {
      return Response.json({
        success: false,
        message: "user name already taken by a verified user",
      });
    }

    const existingUserWithEmail = await userModel.findOne({
      email,
    });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserWithEmail) {
      if (existingUserWithEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "a verified user already exists with this email",
          },
          { status: 400 }
        );
      } else {
        if (await bcrypt.compare(password.toString(), existingUserWithEmail.password.toString())) {
          return Response.json(
            {
              success: false,
              message: "Same Password",
            },
            { status: 400 }
          );
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserWithEmail.password = hashedPassword;
        existingUserWithEmail.verifyCode = verifyCode;
        existingUserWithEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserWithEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 1);
      const newUser = new userModel({
        username,
        email,
        password: hashedPassword,
        verifyCodeExpiry: expiry,
        verifyCode,
        isAcceptingMessage: true,
        isVerified: false,
        messages: [],
      });
      await newUser.save();
    }
    const emailResponse = await sendEmail({
      username,
      verificationCode: verifyCode,
      email,
    });
    console.log("this is your email res",emailResponse)
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: emailResponse.message,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(
      "error in registering user ->(src :: app :: api :: signUp :: route)",
      error
    );
    return Response.json(
      {
        success: false,
        message: "error in registering user",
      },
      {
        status: 500,
      }
    );
  }
}
