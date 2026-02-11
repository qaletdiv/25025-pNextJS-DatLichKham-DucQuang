"use client";
import Container from "../Container/Container";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { type UserInfo } from "@/app/types/Api/GetMeType";
import { Logout } from "@/app/(Auth)/login/action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  user: UserInfo | null;
}

export default function Header({ user }: HeaderProps) {
  const [show, setShow] = useState<boolean>(false);

  // Debug log
  console.log('🔍 Header - User:', user);

  // Function to get dashboard URL based on user role
  const getDashboardUrl = (role: string) => {
    switch (role) {
      case 'doctor':
        return '/doctor';
      case 'patient':
        return '/patient';
      case 'staff':
        return '/staff';
      default:
        return '/';
    }
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <Container>
        <div className="flex justify-between items-center text-[#0b3558] font-bold">
          <div>
            <Link href="/">Logo</Link>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-4">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/our-doctors">Our Doctors</Link>
            </li>
            <li>
              <Link href="/about-us">About Us</Link>
            </li>
          </ul>

          {/* Desktop User Menu */}
          {user ? (
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <User size={20} />
                    <span>{user.username}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardUrl(user.role)} className="flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => Logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex gap-2">
              <Link
                className="rounded-2xl bg-blue-700 px-6 py-2 text-md font-bold text-white hover:bg-blue-800 transition-colors"
                href="/login"
              >
                Login
              </Link>
              <Link
                className="rounded-2xl bg-blue-400 px-6 py-2 text-md font-bold text-white hover:bg-blue-500 transition-colors"
                href="/register"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button className="md:hidden" onClick={() => setShow(!show)}>
            {show ? <X /> : <Menu />}
          </button>
        </div>
      </Container>

      {/* Mobile Menu */}
      {show && (
        <div className="md:hidden border-t">
          <ul className="flex flex-col gap-4 p-4">
            <li>
              <Link href="/" onClick={() => setShow(false)}>Home</Link>
            </li>
            <li>
              <Link href="/our-doctors" onClick={() => setShow(false)}>Our Doctors</Link>
            </li>
            <li>
              <Link href="/about-us" onClick={() => setShow(false)}>About Us</Link>
            </li>

            {user ? (
              <>
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-600 mb-3">Welcome, {user.username}</p>
                  <div className="flex flex-col gap-2">
                    <Link
                      href={getDashboardUrl(user.role)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg text-left"
                      onClick={() => setShow(false)}
                    >
                      <LayoutDashboard size={18} />
                      <span>Dashboard</span>
                    </Link>
                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg text-left">
                      <User size={18} />
                      <span>Profile</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg text-left">
                      <Settings size={18} />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={() => Logout()}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 rounded-lg text-left"
                    >
                      <LogOut size={18} />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <li className="pt-2 border-t">
                  <Link
                    href="/login"
                    className="block px-4 py-2 bg-blue-700 text-white rounded-lg text-center hover:bg-blue-800"
                    onClick={() => setShow(false)}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="block px-4 py-2 bg-blue-400 text-white rounded-lg text-center hover:bg-blue-500"
                    onClick={() => setShow(false)}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}