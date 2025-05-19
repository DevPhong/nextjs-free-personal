import React from "react";
import envConfig from "@/config";
import { cookies } from "next/headers";
import Profile from "@/app/me/profile";

export default async function MeProfile() {
  const cookieStore = cookies();
  const sessionToken = (await cookieStore).get("sessionToken")?.value;

  const result = await fetch(
    `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/account/me`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  ).then(async (res) => {
    const payload = await res.json();
    const data = {
      status: res.status,
      payload,
    };

    if (!res.ok) {
      throw data;
    }

    return data;
  });

  return (
    <div>
      <h1>Profile</h1>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold">
          Họ tên: {result.payload.data.name}
        </p>
        <Profile />
      </div>
    </div>
  );
}
