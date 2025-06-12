import React from "react";
import { cookies } from "next/headers";
// import Profile from "@/app/me/profile";
import accountApiRequest from "@/apiRequests/account";
import ProfileForm from "@/app/me/profile-form";

export default async function MeProfile() {
  const cookieStore = await cookies();
  // token này là lấy từ server
  const sessionToken = cookieStore.get("sessionToken");
  const result = await accountApiRequest.me(sessionToken?.value ?? "");

  return (
    <div>
      <h1>Profile</h1>
      <p className="text-sm font-semibold">
        Họ tên: {result.payload.data.name}
      </p>
      <div className="flex justify-center">
        {/* <Profile /> */}
        <ProfileForm profile={result.payload.data} />
      </div>
    </div>
  );
}
