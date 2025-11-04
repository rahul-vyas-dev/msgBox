import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/utils/ApiResponse";
import { toast } from "sonner";
import dayjs from "dayjs";

type messageProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

function MessageCard({ message, onMessageDelete }: messageProps) {
  const handleOnClick = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast(response.data.message);
      onMessageDelete(message._id as string);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    }
  };
  return (
    <>
      <Card className="card-bordered">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{message.content}</CardTitle>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <X className="w-5 h-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this message.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleOnClick}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="text-sm">
            {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
          </div>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </>
  );
}

export default MessageCard;
