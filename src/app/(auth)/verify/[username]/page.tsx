"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifySchema } from "@/schemas/verify.schema";
import { ApiResponse } from "@/utils/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

function Page() {
  const [code, setCode] = useState("");
  const username = useParams<{ username: string }>();
  console.log("username", username);
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });
  const router = useRouter();
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      console.log("this is data", data);
      const response = await axios.post("/api/verify-code", {
        verifycode: code,
        username: username.username,
      });
        console.log("this is response", response);
         toast("success", {
           description: response.data.message,
         });
      router.replace("/dashboard");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 ">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setCode(e.target.value);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Verify</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Page;
