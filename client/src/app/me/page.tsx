import React from "react";
import { cookies } from "next/headers";
// import Profile from "@/app/me/profile";
import accountApiRequest from "@/apiRequests/account";

export default async function MeProfile() {
  const cookieStore = await cookies();
  // token này là lấy từ server
  const sessionToken = cookieStore.get("sessionToken");
  const result = await accountApiRequest.me(sessionToken?.value ?? "");

  return (
    <div>
      <h1>Profile</h1>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold">
          Họ tên: {result.payload.data.name}
        </p>
        {/* <Profile /> */}
      </div>
    </div>
  );
}
