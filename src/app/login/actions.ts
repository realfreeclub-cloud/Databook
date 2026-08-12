"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { setSession, clearSession } from "@/lib/session";
import { seedSuperAdmin } from "@/lib/adminActions";

export async function loginUser(phone: string, password: string, isAdminPortal: boolean = false) {
  try {
    // Seed Super Admin if missing
    await seedSuperAdmin();
    
    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return { success: false, error: "Invalid phone number or password" };
    }

    // @ts-ignore
    if (user.role === "SUPER_ADMIN" && !isAdminPortal) {
      return { success: false, error: "Admin login is not allowed from this portal. Please use the dedicated admin login page." };
    }

    // @ts-ignore
    if (user.role !== "SUPER_ADMIN" && isAdminPortal) {
      return { success: false, error: "Unauthorized access. Store managers must use the regular login portal." };
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
        phone: user.phone,
        // @ts-ignore
        role: user.role,
        // @ts-ignore
        subscriptionActive: user.subscriptionActive,
        // @ts-ignore
        subscriptionPlan: user.subscriptionPlan
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
