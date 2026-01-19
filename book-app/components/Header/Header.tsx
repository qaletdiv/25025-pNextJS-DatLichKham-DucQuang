"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/app/redux/hook";
import { type MenuItem } from "@/lib/MenuType/MenuType";
import { logout } from "@/app/redux/slices/auth/auth.slices";
export default function Header() {
  const account = useAppSelector((state) => state.auth.account);
  const pathname = usePathname();
  const dispatch = useAppDispatch()

  const linkActive = (path: string) => {
    return pathname === path
      ? "text-white font-normal nav-active"
      : "text-[#C9D2DA] font-light";
  };

  const menu: MenuItem[] = [
    { label: "Home", href: "/" },
    { label: "Our Doctors", href: "/doctors" },
    { label: "How it works", href: "/how-it-works" },
    { label: "Health Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
    
      <div className="container mx-auto px-8 flex justify-between items-center">
        <Link href="/">
          <Image
            src="/assets/icons/Logo.svg"
            alt="Logo"
            width={30}
            height={30}
          />
        </Link>

        {/* Thanh điều hướng */}
        <nav>
          <ul className="flex gap-2">
            {menu.map((item) => (
              <li
                key={item.href}
                className={`text-[16px] py-2 px-[21px] ${linkActive(
                  item.href,
                )}`}
              >
                <Link
                  className="hover:text-white px-4 font-normal"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>


        {account ? (
          <div className="flex items-center gap-4">
            <span className="text-white">Xin chào, {account.username}</span>

            <Link
              href={`/${account.role}`}
              className="text-white bg-[#2E80CE] px-4 py-2 rounded-3xl"
            >
              Quản lý
            </Link>
            <button
              onClick={() => {
                dispatch(logout());
                window.location.href = "/login";
              }}
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link
              className="text-[#C9D2DA] text-[16px] py-2 px-[21px]"
              href="/login"
            >
              Login
            </Link>
            <Link
              className="text-white text-[16px] py-2 px-[21px] bg-[#2E80CE] rounded-3xl"
              href="/signup"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
