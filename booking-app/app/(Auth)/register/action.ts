"use server"
import { RegisterDTO } from "@/app/types/DTO/RegisterDTO/RegisterDTO"
import {redirect} from "next/navigation" 

export async function Register(data: RegisterDTO) {
    const response = await fetch("http://localhost:5000/api/v1/accounts/", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json", 
        },
        body: JSON.stringify({
            username: data.username,
            email: data.email,
            password: data.password
        })
    }); 
    if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? "Register Failed");
  }
  redirect("/login")
}   