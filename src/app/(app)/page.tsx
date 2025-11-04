"use client";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@react-email/components";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/utils/ApiResponse";
import { toast } from "sonner";

export default function CarouselDemo() {
  // const sds="f,'dfs||?sdsfsd'\";
  const [message, setMessage] = React.useState([]);
  const suggestmsg = async () => {
    try {
      setMessage([]);
      const response = await axios.get("/api/suggest-messages");
      console.log("data", response.headers);
      console.log("data", response.data);
      console.log("data", response);
      const streamResponse = response.data.split("||");
      setMessage(streamResponse);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log("this is error in ai res", axiosError);
      toast.error(axiosError.response?.data.message);
    }
  };
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold">
          Dive into the World of Anonymous Feedback
        </h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">
          True Feedback - Where your identity remains a secret.
        </p>
      </section>
      <Carousel
        className="w-full max-w-xs"
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
      >
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <Button onClick={suggestmsg}>
        try new msg
        {message.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </Button>
      <footer className="text-center p-4 md:p-6  text-white">
        © 2025 True Feedback. All rights reserved.
      </footer>
    </main>
  );
}
