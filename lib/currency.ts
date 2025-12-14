/**
 * Currency parsing and formatting utilities
 * Handles South African Rand (R) currency strings
 */

/**
 * Parse a currency string to a number
 * Examples:
 * - "R1,250" → 1250
 * - "R1,250.50" → 1250.50
 * - "1,250" → 1250
 * - "1250" → 1250
 * - "" → 0
 * - null/undefined → 0
 */
export function parseCurrency(value: string | null | undefined): number {
  if (!value || typeof value !== "string") return 0;

  // Remove "R" prefix, spaces, and commas
  const cleaned = value.trim().replace(/^R\s*/i, "").replace(/,/g, "");

  // Parse to number
  const parsed = parseFloat(cleaned);

  // Return 0 if NaN
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format a number as currency string
 * Examples:
 * - 1250 → "R1,250.00"
 * - 1250.5 → "R1,250.50"
 * - 0 → "R0.00"
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "R0.00";
  }

  // Format with 2 decimal places and thousand separators
  return `R${value.toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format a number as currency string without decimals (for display)
 * Examples:
 * - 1250 → "R1,250"
 * - 1250.5 → "R1,251"
 */
export function formatCurrencyNoDecimals(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "R0";
  }

  return `R${Math.round(value).toLocaleString("en-ZA")}`;
}

