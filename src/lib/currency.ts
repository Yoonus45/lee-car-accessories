/**
 * Centralized Indian Rupee (INR / ₹) currency formatting utilities.
 * Lee Car Accessories serves customers in India (Ramanathapuram, Tamil Nadu).
 */

export function formatINR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return '—'
  return `₹${amount.toLocaleString('en-IN')}`
}

export function formatPrice(amount: number | null | undefined, contactForPrice?: boolean): string {
  if (contactForPrice || amount === null || amount === undefined) {
    return 'Contact for Price'
  }
  return `₹${amount.toLocaleString('en-IN')}`
}
