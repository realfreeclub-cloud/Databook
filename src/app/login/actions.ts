"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { setSession, clearSession } from "@/lib/session";

export async function loginUser(phone: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return { success: false, error: "Invalid phone number or password" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, error: "Invalid phone number or password" };
    }

    // Set secure HTTP-only cookie
    await setSession(user.id);

    return { 
      success: true, 
      user: { 
        id: user.id, 
        name: user.name, 
        phone: user.phone 
      } 
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function logoutUser() {
  await clearSession();
  return { success: true };
}
