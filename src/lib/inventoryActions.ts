"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";

export async function getNextJobNumber(): Promise<string> {
  try {
    const lastRecord = await prisma.repairRecord.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    if (!lastRecord || !lastRecord.jobNumber) {
      return "JOB-1001";
    }
    
    // Match digits in the job number
    const match = lastRecord.jobNumber.match(/\d+/);
    if (match) {
      const numStr = match[0];
      const nextNum = parseInt(numStr, 10) + 1;
      // Preserve padding of zero if needed, e.g. JOB-0001
      const padded = String(nextNum).padStart(numStr.length, '0');
      return lastRecord.jobNumber.replace(numStr, padded);
    }
    
    return lastRecord.jobNumber + "-1";
  } catch (e) {
    console.error("Failed to generate next job number:", e);
    return "JOB-1001";
  }
}

export async function getInventoryItems() {
  const userId = await getSessionUserId();
  if (!userId) return [];

  try {
    const items = await prisma.inventoryItem.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });
    return items;
  } catch (e) {
    console.error("Failed to fetch inventory items:", e);
    return [];
  }
}

export async function addInventoryItem(data: { name: string; sku?: string; stock: number; price: number }) {
  const userId = await getSessionUserId();
  if (!userId) return { success: false, error: "Not logged in" };

  try {
    const created = await prisma.inventoryItem.create({
      data: {
        name: data.name,
        sku: data.sku || null,
        stock: data.stock,
        price: data.price,
        userId
      }
    });
    return { success: true, item: created };
  } catch (e) {
    console.error("Failed to add inventory item:", e);
    return { success: false, error: "Failed to add inventory item" };
  }
}

export async function updateInventoryItem(id: string, data: Partial<{ name: string; sku?: string; stock: number; price: number }>) {
  const userId = await getSessionUserId();
  if (!userId) return { success: false, error: "Not logged in" };

  try {
    const updated = await prisma.inventoryItem.updateMany({
      where: { id, userId },
      data: {
        name: data.name,
        sku: data.sku || undefined,
        stock: data.stock,
        price: data.price
      }
    });
    return { success: true, count: updated.count };
  } catch (e) {
    console.error("Failed to update inventory item:", e);
    return { success: false, error: "Failed to update inventory item" };
  }
}

export async function deleteInventoryItem(id: string) {
  const userId = await getSessionUserId();
  if (!userId) return { success: false, error: "Not logged in" };

  try {
    await prisma.inventoryItem.deleteMany({
      where: { id, userId }
    });
    return { success: true };
  } catch (e) {
    console.error("Failed to delete inventory item:", e);
    return { success: false, error: "Failed to delete inventory item" };
  }
}

export async function recordSale(itemId: string, quantity: number, price: number) {
  const userId = await getSessionUserId();
  if (!userId) return { success: false, error: "Not logged in" };

  try {
    // Fetch item first to ensure stock matches and exists
    const item = await prisma.inventoryItem.findFirst({
      where: { id: itemId, userId }
    });

    if (!item) {
      return { success: false, error: "Inventory item not found" };
    }

    if (item.stock < quantity) {
      return { success: false, error: `Insufficient stock. Only ${item.stock} left in inventory.` };
    }

    // Record the sale
    const sale = await prisma.saleItem.create({
      data: {
        inventoryItemId: itemId,
        quantity,
        totalAmount: price * quantity,
        userId
      }
    });

    // Decrement stock
    await prisma.inventoryItem.update({
      where: { id: itemId },
      data: {
        stock: item.stock - quantity
      }
    });

    return { success: true, sale };
  } catch (e) {
    console.error("Failed to record sale:", e);
    return { success: false, error: "Failed to record transaction" };
  }
}

export async function getSalesHistory() {
  const userId = await getSessionUserId();
  if (!userId) return [];

  try {
    const sales = await prisma.saleItem.findMany({
      where: { userId },
      include: {
        inventoryItem: {
          select: {
            name: true,
            sku: true
          }
        }
      },
      orderBy: { saleDate: 'desc' }
    });
    return sales.map(s => ({
      id: s.id,
      quantity: s.quantity,
      totalAmount: s.totalAmount,
      saleDate: s.saleDate,
      itemName: s.inventoryItem?.name || "Unknown Item",
      sku: s.inventoryItem?.sku || ""
    }));
  } catch (e) {
    console.error("Failed to fetch sales history:", e);
    return [];
  }
}
