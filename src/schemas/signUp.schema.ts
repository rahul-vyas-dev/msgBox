import { z } from "zod";

export const verifyUserName = z
  .string()
  .min(2, "User Name must be greater than 2")
  .max(20, "User Name must be less than 20 char")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "user name should not contain any special character"
  );

export const signUpSchema = z.object({
  username: verifyUserName,
  email: z.string().email({ message: "email is not valid" }),
  password: z.string().min(6, "passwrod must be atleast 6 char long"),
});
