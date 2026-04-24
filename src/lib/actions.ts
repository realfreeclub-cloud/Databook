"use server";

import { prisma } from "@/lib/prisma";
import { RecordItem } from "@/lib/data";

export async function getRecordsFromDB(userId: string): Promise<RecordItem[]> {
  if (!userId) return [];
  
  try {
    const records = await prisma.repairRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    
    // Map to RecordItem
    return records.map(r => ({
      ...r,
      workStatus: r.workStatus as RecordItem["workStatus"],
      finalStatus: r.finalStatus as RecordItem["finalStatus"],
      pendingAmount: r.pendingAmount ?? undefined,
      completedDate: r.completedDate ?? undefined,
      actualDeliveryDate: r.actualDeliveryDate ?? undefined,
      password: r.password ?? undefined,
      extraProblem: r.extraProblem ?? undefined,
      notes: r.notes ?? undefined,
    }));
  } catch (e) {
    console.error("Failed to fetch records:", e);
    return [];
  }
}

export async function addRecordToDB(userId: string, record: Omit<RecordItem, 'id'>) {
  if (!userId) return { success: false, error: "Not logged in" };

  try {
    const created = await prisma.repairRecord.create({
      data: {
        ...record,
        userId,
      }
    });
    return { success: true, record: created };
  } catch (e) {
    console.error("Failed to add record:", e);
    return { success: false, error: "Failed to save record" };
  }
}

export async function deleteRecordFromDB(userId: string, id: string) {
  if (!userId) return { success: false };
  try {
    await prisma.repairRecord.deleteMany({
      where: { id, userId }
    });
    return { success: true };
  } catch (e) {
    console.error("Failed to delete record:", e);
    return { success: false };
  }
}

export async function syncRecordsToDB(userId: string, records: Omit<RecordItem, 'id'>[]) {
  if (!userId) return { success: false };
  try {
    // For import feature, we'll create many
    // First, map to include userId
    const data = records.map(r => ({
      ...r,
      userId,
    }));
    
    // To handle unique constraints properly (jobNumber), we could use upsert or ignore duplicates
    // But createMany skipDuplicates is easiest
    await prisma.repairRecord.createMany({
      data,
      skipDuplicates: true,
    });
    return { success: true };
  } catch (e) {
    console.error("Failed to sync records:", e);
    return { success: false };
  }
}
