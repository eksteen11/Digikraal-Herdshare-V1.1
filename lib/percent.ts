/**
 * Percentage parsing and formatting utilities
 */

/**
 * Parse a percentage string to a decimal number
 * Examples:
 * - "50%" → 0.5
 * - "100%" → 1.0
 * - "25.5%" → 0.255
 * - "50" → 0.5 (assumes percentage if no % sign)
 * - "" → 0
 * - null/undefined → 0
 */
export function parsePercent(value: string | null | undefined): number {
  if (!value || typeof value !== "string") return 0;

  // Remove "%" sign and spaces
  const cleaned = value.trim().replace(/%/g, "");

  // Parse to number
  const parsed = parseFloat(cleaned);

  // Return 0 if NaN
  if (isNaN(parsed)) return 0;

  // Convert percentage to decimal (50% → 0.5)
  return parsed / 100;
}

/**
 * Format a decimal number as percentage string
 * Examples:
 * - 0.5 → "50%"
 * - 1.0 → "100%"
 * - 0.255 → "25.5%"
 * - 0 → "0%"
 */
export function formatPercent(value: number | null | undefined, decimals: number = 1): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "0%";
  }

  // Convert decimal to percentage (0.5 → 50)
  const percentage = value * 100;

  // Format with specified decimal places
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * Format a decimal number as percentage string with no decimals
 * Examples:
 * - 0.5 → "50%"
 * - 0.255 → "26%" (rounded)
 */
export function formatPercentNoDecimals(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "0%";
  }

  const percentage = Math.round(value * 100);
  return `${percentage}%`;
}

