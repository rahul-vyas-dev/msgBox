'use client';
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@uidotdev/usehooks";
import { toast } from "sonner";
import { signUpSchema } from "@/schemas/signUp.schema";
// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/utils/ApiResponse";
import { Loader2 } from "lucide-react";

function Page() {
  const [username, setUsername] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");

  const debouncedUsername = useDebounce(username, 500);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const result = await axios.get(
            `/api/check-username?username=${debouncedUsername}`
          );
          setUsernameMessage(result.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error in checking Username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  const onsubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      toast("successfully registered!!", {
        description: `${response.data?.message}`,
      });
      router.replace(`/verify/${username}`);

      setIsSubmitting(false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const Error =
        axiosError?.response?.data.message ??
        "There was a problem with your sign-up. Please try again.";
      toast.error(Error);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join True Feedback
            </h1>
            <p className="mb-4">Sign up to start your anonymous adventure</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-6">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setUsername(e.target.value);
                      }}
                    />
                    {isCheckingUsername && <Loader2 className="animate-spin" />}
                    {!isCheckingUsername && usernameMessage && (
                      <p
                        className={`text-sm font-bold ${
                          usernameMessage === "Username is unique"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {usernameMessage}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input {...field} name="email" />
                    <p className="text-gray-400 text-sm">
                      We will send you a verification code
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" {...field} name="password" />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p>
              Already a member?{" "}
              <Link
                href="/sign-in"
                className="text-blue-600 hover:text-blue-800"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
