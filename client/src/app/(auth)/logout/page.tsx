"use client";

import authApiRequest from "@/apiRequests/auth";
import { clientSessionToken } from "@/lib/http";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const sessionToken = searchParams.get("sessionToken");

  console.log(clientSessionToken);

  useEffect(() => {
    if (sessionToken === clientSessionToken.value) {
      authApiRequest.logoutFromNextClientToNextServer(true).then(() => {
        // Chuyển hướng về trang đăng nhập
        router.push(`/login?redirectFrom=${pathName}`);
      });
    }
  }, [router, sessionToken, pathName]);

  return <div>page logout</div>;
}
