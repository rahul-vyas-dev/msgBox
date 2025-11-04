'use client';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { messageSchema } from "@/schemas/message.schema";
import { ApiResponse } from "@/utils/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { Link, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Skeleton } from "@/components/ui/skeleton";

function Page() {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });
  const message = form.watch("content");
   const [aiMessage, setAiMessage] = React.useState([]);
   const [isSuggestLoading, setisSuggestLoading] = React.useState(false);
   const fetchSuggestedMessages = async () => {
     setisSuggestLoading(true)
     try {
       setAiMessage([]);
       const response = await axios.get("/api/suggest-messages");
       const streamResponse = response.data.split("||");
       setAiMessage(streamResponse);
     } catch (error) {
       const axiosError = error as AxiosError<ApiResponse>;
       console.log("this is error in ai res", axiosError);
       toast.error(axiosError.response?.data.message);
     } finally { 
       setisSuggestLoading(false);
     }

   };

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };
  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const ApiResponse = await axios.post<ApiResponse>("/api/send-messages", {
        username,
        ...data,
      });
      console.log('res', ApiResponse);
      toast(ApiResponse.data.message);
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      console.log('error part', error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <textarea
                    placeholder="Write your anonymous message here"
                    className="p-0.5 resize-none hover:outline"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled={false}>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !message}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isSuggestLoading}
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="flex justify-center align-baseline text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {isSuggestLoading ? (
              <>
                <Skeleton className="h-[20px] w-[100px] rounded-full" />
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </>
            ) : (
              aiMessage.map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2 whitespace-pre-wrap"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={"/sign-up"}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}

export default Page;
