"use client";

import React, { useEffect } from "react";
import accountApiRequest from "@/apiRequests/account";

export default function Profile() {
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const result = await accountApiRequest.meClient();
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRequest();
  }, []);

  return <div>profile</div>;
}
