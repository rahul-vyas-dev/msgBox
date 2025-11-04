"use client";
import { Button } from "@react-email/components";
import { signOut, useSession } from "next-auth/react";
import { Link } from "lucide-react";
import React from "react";

function Navbar() {
  const { data: session } = useSession();
  // const data: User = session?.user;
  console.log("thiss is session", session);
  return (
    <>
      <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <a href="#" className="text-xl font-bold mb-4 md:mb-0">
            True Feedback
          </a>
          {session ? (
            <>
              <span className="mr-4 font-bold text-amber-200">
                Welcome, {session.user.username || session.user.email}
              </span>
              <Button
                onClick={() => signOut()}
                className="w-auto md:w-auto bg-slate-100 text-black rounded-2xl p-1.5 font-medium flex justify-center text-center"
              >
                Logout
              </Button>
            </>
          ) : (
            <Button className="w-full md:w-auto bg-slate-100 text-black">
              <Link href="/sign-in">Login</Link>
            </Button>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
