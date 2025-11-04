import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, "content must be atleast 6 char long")
    .max(300, "content must be 300 char long"),
});
