"use server";

import { LoginDTO } from "@/app/types/DTO/LoginDTO/LoginDTO";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { type UserInfo, GetMeResponse } from "@/app/types/Api/GetMeType";

export async function Login(data: LoginDTO) {
  const response = await fetch("http://localhost:5000/api/v1/accounts/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? "Login failed");
  }
  const result = await response.json();

  const cookieStore = await cookies();
  cookieStore.set("token", result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  redirect("/");
}

export async function GetMe(): Promise<UserInfo | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

   
    if (!token) {
      return null;
    }

   
    const res = await fetch(
      "http://localhost:5000/api/v1/accounts/get-me",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    console.log('📡 GetMe - Response status:', res.status);

    if (!res.ok) {
     
      const errorText = await res.text();
      return null;
    }

    const data: GetMeResponse = await res.json();
    return data.account;
  } catch (error) {
    return null;
  }
}

export async function Logout() {
  const cookiesStore = await cookies();
  cookiesStore.delete('token');
  redirect("/")
}