"use server";

import { prisma } from "@/lib/prisma";

export interface CustomerSafeRecord {
  id: string;
  jobNumber: string;
  name: string;
  maskedPhone: string;
  laptop: string;
  issue: string;
  extraProblem?: string;
  chargerCollected: boolean;
  signature: boolean;
  workStatus: string;
  amount: number;
  isPaid: boolean;
  pendingAmount: number;
  receivedDate: string;
  expectedDeliveryDate: string;
  completedDate?: string;
  actualDeliveryDate?: string;
  finalStatus: string;
  createdAt: string;
  shopName: string;
  shopPhone: string;
}

/**
 * Clean a phone string to the last 10 digits.
 */
function extract10Digits(phoneStr: string): string {
  const digits = phoneStr.replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

/**
 * Mask a 10-digit phone number for customer privacy (e.g. "******0721").
 */
function maskPhoneNumber(clean10: string): string {
  if (clean10.length === 10) {
    return "******" + clean10.slice(-4);
  }
  return clean10;
}

/**
 * Secure Customer Lookup:
 * Requires verified customer 10-digit phone number.
 * Ensures NO password or secret technician credentials leak to the public.
 */
export async function getCustomerRepairRecords({
  phone,
  jobNumber
}: {
  phone: string;
  jobNumber?: string;
}): Promise<{
  success: boolean;
  records?: CustomerSafeRecord[];
  error?: string;
}> {
  try {
    const cleanPhone = extract10Digits(phone || "");
    if (!cleanPhone || cleanPhone.length < 10) {
      return { 
        success: false, 
        error: "Please enter a valid 10-digit registered mobile number." 
      };
    }

    // Query records matching the phone number
    const foundRecords = await prisma.repairRecord.findMany({
      where: {
        phone: {
          contains: cleanPhone
        },
        ...(jobNumber && jobNumber.trim()
          ? {
              jobNumber: {
                equals: jobNumber.trim(),
                mode: "insensitive"
              }
            }
          : {})
      },
      include: {
        user: {
          select: {
            name: true,
            phone: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    if (!foundRecords || foundRecords.length === 0) {
      return {
        success: false,
        error: jobNumber 
          ? `No repair record found for Job #${jobNumber} matching mobile number ${cleanPhone}.`
          : `No repair records found registered with mobile number ${cleanPhone}.`
      };
    }

    // Map to customer-safe data structure with zero credentials/passwords exposed
    const safeRecords: CustomerSafeRecord[] = foundRecords.map(r => ({
      id: r.id,
      jobNumber: r.jobNumber,
      name: r.name,
      maskedPhone: maskPhoneNumber(cleanPhone),
      laptop: r.laptop,
      issue: r.issue,
      extraProblem: r.extraProblem ?? undefined,
      chargerCollected: r.chargerCollected,
      signature: r.signature,
      workStatus: r.workStatus,
      amount: r.amount,
      isPaid: r.isPaid,
      pendingAmount: r.pendingAmount ?? 0,
      receivedDate: r.receivedDate,
      expectedDeliveryDate: r.expectedDeliveryDate,
      completedDate: r.completedDate ?? undefined,
      actualDeliveryDate: r.actualDeliveryDate ?? undefined,
      finalStatus: r.finalStatus,
      createdAt: r.createdAt.toISOString(),
      shopName: r.user?.name || "National Computer Allahabad",
      shopPhone: r.user?.phone || "7786961902"
    }));

    return {
      success: true,
      records: safeRecords
    };
  } catch (err: any) {
    console.error("Error in getCustomerRepairRecords:", err);
    return {
      success: false,
      error: "Unable to retrieve records at this moment. Please check your connection or contact our support."
    };
  }
}
