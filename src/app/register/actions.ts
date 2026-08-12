"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { setSession } from "@/lib/session";

export async function registerUser(name: string, phone: string, password: string) {
  try {
    // Basic validation
    if (!name || name.trim().length < 2) {
      return { success: false, error: "Please enter a valid name" };
    }
    if (!phone || phone.trim().length < 10) {
      return { success: false, error: "Please enter a valid 10-digit phone number" };
    }
    if (!password || password.length < 4) {
      return { success: false, error: "Password must be at least 4 characters" };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return { success: false, error: "Phone number is already registered. Please login." };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        password: hashedPassword,
      },
    });

    // Set secure HTTP-only session cookie
    await setSession(user.id);

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
      },
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Failed to create account. Please try again." };
  }
}
