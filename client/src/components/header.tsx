import ButtonLogout from "@/components/button-logout";
import { ModeToggle } from "@/components/mode-toggle";
import { AccountResType } from "@/schemaValidations/account.schema";
import Link from "next/link";
import React from "react";

export default async function Header({
  user,
}: {
  user: AccountResType["data"] | null;
}) {
  return (
    <div>
      <ul>
        <li>
          <Link href="/products">Sản phẩm</Link>
        </li>

        {user ? (
          <>
            <li>
              <Link href={`/me`}>
                <div>
                  Xin chào <strong> {user.name}</strong>
                </div>
              </Link>
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
