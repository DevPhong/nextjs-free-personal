"use client";

import authApiRequest from "@/apiRequests/auth";
import { clientSessionToken } from "@/lib/http";
import { useEffect } from "react";
import { differenceInHours } from "date-fns";

export default function SlideSession() {
  useEffect(() => {
    const interval = setInterval(async () => {
      if (clientSessionToken.value) {
        const expiresAt = new Date(clientSessionToken.expiresAt);
        const now = new Date();
        const result = differenceInHours(expiresAt, now);
        console.log("res", result);
        if (result < 1) {
          const res = await authApiRequest.slideSessionNextClientToNextServer();
          clientSessionToken.expiresAt = res.payload.data.expiresAt;
        }
      }
    }, 60 * 1000 * 60); // Check hour
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return null;
}
