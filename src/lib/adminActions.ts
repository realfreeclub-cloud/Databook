"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import bcrypt from "bcrypt";

// Helper to check if current logged-in user is Super Admin
async function checkSuperAdmin(): Promise<boolean> {
  const userId = await getSessionUserId();
  if (!userId) return false;
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        // @ts-ignore
        role: true
      }
    });
    // @ts-ignore
    return user?.role === "SUPER_ADMIN";
  } catch (e) {
    console.error("Auth check failed:", e);
    return false;
  }
}

// Seed a default Super Admin account on system boot if none exists
export async function seedSuperAdmin() {
  try {
    const existingAdmin = await prisma.user.findFirst({
      where: {
        // @ts-ignore
        role: "SUPER_ADMIN"
      }
    });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await prisma.user.create({
        data: {
          phone: "9999999999",
          name: "Super Admin",
          password: hashedPassword,
          // @ts-ignore
          role: "SUPER_ADMIN",
          // @ts-ignore
          subscriptionActive: true,
          // @ts-ignore
          subscriptionPlan: "Lifetime"
        }
      });
      console.log("Super Admin seeded successfully: Phone: 9999999999, Pass: admin123");
    }
  } catch (e) {
    console.error("Failed to seed Super Admin:", e);
  }
}

// Fetch all registered store keepers (Users)
export async function getAllUsers() {
  const isAdmin = await checkSuperAdmin();
  if (!isAdmin) return [];

  try {
    const users = await prisma.user.findMany({
      where: {
        // @ts-ignore
        role: "USER"
      },
      select: {
        id: true,
        name: true,
        phone: true,
        // @ts-ignore
        subscriptionActive: true,
        // @ts-ignore
        subscriptionPlan: true,
        // @ts-ignore
        subscriptionExpiresAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    return users.map((u: any) => ({
      id: u.id,
      name: u.name || "Unnamed Shop",
      phone: u.phone,
      subscriptionActive: u.subscriptionActive,
      subscriptionPlan: u.subscriptionPlan || "None",
      subscriptionExpiresAt: u.subscriptionExpiresAt ? u.subscriptionExpiresAt.toISOString() : null,
      createdAt: u.createdAt.toISOString()
    }));
  } catch (e) {
    console.error("Failed to fetch users:", e);
    return [];
  }
}

// Reset any user's password
export async function resetUserPassword(targetUserId: string, newPassword: string) {
  const isAdmin = await checkSuperAdmin();
  if (!isAdmin) return { success: false, error: "Unauthorized access" };

  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: "Password must be at least 6 characters long" };
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: targetUserId },
      data: { password: hashedPassword }
    });
    return { success: true };
  } catch (e) {
    console.error("Failed to reset password:", e);
    return { success: false, error: "Failed to update password in database" };
  }
}

// Activate or Extend a user's subscription
export async function updateUserSubscription(targetUserId: string, planName: string, durationMonths: number) {
  const isAdmin = await checkSuperAdmin();
  if (!isAdmin) return { success: false, error: "Unauthorized access" };

  try {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + durationMonths);

    await prisma.user.update({
      where: { id: targetUserId },
      data: {
        // @ts-ignore
        subscriptionActive: true,
        // @ts-ignore
        subscriptionPlan: planName,
        // @ts-ignore
        subscriptionExpiresAt: expiryDate
      }
    });
    return { success: true, expiresAt: expiryDate.toISOString() };
  } catch (e) {
    console.error("Failed to update subscription:", e);
    return { success: false, error: "Failed to update subscription" };
  }
}

// Get user's own subscription status
export async function getMySubscription() {
  const userId = await getSessionUserId();
  if (!userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        // @ts-ignore
        subscriptionActive: true,
        // @ts-ignore
        subscriptionPlan: true,
        // @ts-ignore
        subscriptionExpiresAt: true,
        // @ts-ignore
        role: true
      }
    });
    if (!user) return null;
    return {
      // @ts-ignore
      active: user.subscriptionActive,
      // @ts-ignore
      plan: user.subscriptionPlan || "None",
      // @ts-ignore
      expiresAt: user.subscriptionExpiresAt ? user.subscriptionExpiresAt.toISOString() : null,
      // @ts-ignore
      role: user.role
    };
  } catch (e) {
    console.error("Failed to fetch subscription status:", e);
    return null;
  }
}

// Request a subscription update/activation
export async function requestSubscriptionActivation(planName: string) {
  const userId = await getSessionUserId();
  if (!userId) return { success: false, error: "Not logged in" };

  try {
    // In a fully integrated system, you could create a request log.
    // For now, we update the user's plan name and set active to false so Super Admin sees the request plan.
    await prisma.user.update({
      where: { id: userId },
      data: {
        // @ts-ignore
        subscriptionPlan: `${planName} (Pending Activation)`
      }
    });
    return { success: true };
  } catch (e) {
    console.error("Failed to request activation:", e);
    return { success: false, error: "Failed to submit request" };
  }
}
