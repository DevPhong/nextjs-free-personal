"use client";

import React, { useEffect } from "react";
import envConfig from "@/config";
import { useAppContext } from "@/AppProvider";

export default function Profile() {
  const { sessionToken } = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
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
      console.log("result", result);
    };

    // Gửi dữ liệu lên server nextjs (set-token)
    fetchData();
  }, [sessionToken]);

  return <div>profile</div>;
}
