import { resend } from "../lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "../utils/ApiResponse";

interface email {
  username: string;
  verificationCode: string;
  email: string;
}

export async function sendEmail({
  username,
  verificationCode,
  email,
}: email): Promise<ApiResponse> {
  try {
    const data = await resend.emails.send({
      from: "mSgBoX <onboarding@resend.dev>",
      to: email,
      subject: "Mystery Message Verification Code",
      react: VerificationEmail({ username, otp: verificationCode }),
    });
    console.log(
      "email sent successfully ->(helpers :: sendVerificationEmail)",
      data
    );
    return {
      success: true,
      message: "Verification email sent successfully.",
    };
  } catch (emailError) {
    console.error(
      "Error sending verification email ->(helpers :: sendVerificationEmail):",
      emailError
    );
    return {
      success: false,
      message: "Failed to send verification email.",
    };
  }
}
