/**
 * TypeScript types for Airtable tables
 * These types match the EXACT field names from Airtable
 * (including spacing and typos)
 */

// Re-export from lib/airtable.ts for convenience
export type { AirtableUser, AirtableTransaction } from "@/lib/airtable";

/**
 * User role type
 */
export type UserRole = "Admin" | "Partner" | "Investor" | "Farmer";

/**
 * Transaction type (purchase or sale)
 */
export type TransactionType = "Purchase" | "Sale";

/**
 * Payment method type
 */
export type PaymentMethod = "Cash" | "EFT" | "Other";

