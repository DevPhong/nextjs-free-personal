import ButtonLogout from "@/components/button-logout";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import React from "react";
import { cookies } from "next/headers";
import accountApiRequest from "@/apiRequests/account";

export default async function Header() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;

  let user = null;
  if (sessionToken) {
    const data = await accountApiRequest.me(sessionToken);
    user = data.payload;
  }

  console.log(user?.data.name);

  return (
    <div>
      <ul>
        <li>
          <Link href="/products">Sản phẩm</Link>
        </li>

        {user ? (
          <>
            <li>
              <div>
                Xin chào <strong> {user.data.name}</strong>
              </div>
            </li>
            <li>
              <ButtonLogout />
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/login">Đăng nhập</Link>
            </li>

            <li>
              <Link href="/register">Đăng ký</Link>
            </li>
          </>
        )}
      </ul>
      <ModeToggle />
    </div>
  );
}
