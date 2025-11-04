"use client";
import React, { useCallback, useEffect, useState } from "react";
// import { auth } from "../../api/auth/[...nextauth]/options";
import { useForm } from "react-hook-form";
import z from "zod";
import { acceptMessageSchema } from "@/schemas/acceptMessage.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { Message, User } from "@/model/User";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/utils/ApiResponse";
import { toast } from "sonner";
import MessageCard from "@/components/MessageCard";
import { Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@react-email/components";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useDebounce } from "@uidotdev/usehooks";
import Link from "next/link";

function Page() {
  const session = useSession();
  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessage: true,
    },
  });
  const [message, setMessage] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [isCopy, setIsCopy] = useState(false);
  //  console.log("this is session obj",session)
  const { register, watch, setValue } = form;
  const acceptMessage = watch("acceptMessage");
  const [navigate, setNavigate] = useState(false);
  const FetchIsAcceptingMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessage", response.data.isAcceptingMessages as boolean);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const FetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const messages = await axios.get("/api/get-messages");
        setMessage(messages.data.messages || []);
        if (refresh) {
          toast("Refreshed Messages", {
            description: "Showing Latest Messages",
          });
        }
        console.log("this is fetching result", messages);
        if (messages.data.status == 204) {
          toast("No messages yet.");
        }
      } catch (error) {
        console.log("this is error in message fetch", error);
        //   if (error.status==401) {
        //     toast(messages.data.message);
        //   }
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(axiosError.message);
      } finally {
        setIsLoading(false);
      }
    },
    [setMessage, setIsLoading]
  );

  const debouncedValue: boolean = useDebounce(isCopy, 1000);
  useEffect(() => {
    if (!session || !session.data?.user) {
      return;
    }
    FetchIsAcceptingMessages();
    FetchMessages();
  }, [session, FetchIsAcceptingMessages, FetchMessages, setValue]);

  useEffect(() => {
    if (!debouncedValue) return;
    setNavigate(true);
    const timer = setTimeout(() => {
      setIsCopy(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [debouncedValue]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        isAcceptingMessages: !acceptMessage,
      });
      setValue("acceptMessage", !acceptMessage);
      toast(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    }
  };
  const handleDeleteMessage = (messageId: string) => {
    setMessage(message.filter((message) => message._id !== messageId));
  };

  if (!session || !session.data?.user) {
    return <div></div>;
  }

  const { username } = session.data.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const CopyToClipboard = () => {
    setIsCopy(true);
    navigator.clipboard.writeText(profileUrl);
    toast("URL copied", {
      description: "URL copied to clipboard successfully!",
      descriptionClassName: "text-black",
    });
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2 bg-black text-amber-50 font-medium font-mono rounded-3xl pl-5"
          />
          <Button
            className="bg-black text-amber-50 font-medium font-mono rounded-3xl p-2 pointer-coarse:bg-red-500 cursor-copy"
            onClick={CopyToClipboard}
          >
            {isCopy ? <>Copied</> : <>Copy</>}
          </Button>
        </div>
        {navigate ? (
          <Link href={profileUrl}>
            <Button className="ml-3 mt-1 text-neutral-600 font-sans font-bold outline-2 rounded-2xl p-0.5">
              Go to Public URL →
            </Button>
          </Link>
        ) : (
          <></>
        )}
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessage")}
          checked={acceptMessage}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessage ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        onClick={(e) => {
          e.preventDefault();
          FetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {message.length > 0 ? (
          message.map((message) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default Page;
