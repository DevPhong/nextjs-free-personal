"use client";

import authApiRequest from "@/apiRequests/auth";
import { useAppContext } from "@/app/AppProvider";
import { Button } from "@/components/ui/button";
import { handleErrorApi } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React from "react";

export default function ButtonLogout() {
  const router = useRouter();
  const { user } = useAppContext();
  // Xóa cookie trên client
  const handleLogout = async () => {
    try {
      await authApiRequest.logoutFromNextClientToNextServer();
      router.push("/login");
    } catch (error) {
      handleErrorApi({ error });
      await authApiRequest.logoutFromNextClientToNextServer();
      router.push("/login");
    } finally {
      router.refresh();
    }
  };

  return (
    <Button size={"sm"} onClick={handleLogout}>
      Đăng xuất
    </Button>
  );
}
