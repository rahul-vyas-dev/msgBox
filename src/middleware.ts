import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  console.log(req);
  // console.log("this is secret", process.env.NEXTAUTH_SECRET);
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET});
  //   console.log("received by MW ", req);
  const url = req.nextUrl;
  //   console.log("this is url next", url);.

  //   const our = NextResponse.rewrite(new URL("/dashboard", req.url));
  //   const ulr2 = new URL("/login", req.url);
  //   console.log("this is url2", ulr2, our);

  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify") ||
      url.pathname === "/")
  ) {
    console.log("also received by this token check");
    return NextResponse.redirect(new URL("/dashboard", req.url));
    // return NextResponse.rewrite(new URL("/dashboard", req.url));
  }
  if (!token && url.pathname.startsWith("/dashboard")) {
    console.log("this is req comes to MW ", token, req);
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
  console.log("this is your token", token);
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up", "/verify/:path*"],
};
