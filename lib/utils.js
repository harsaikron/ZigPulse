import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatSGD(amount) {
  return new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD', maximumFractionDigits: 0 }).format(amount)
}

export function formatNumber(n) {
  return new Intl.NumberFormat('en-SG').format(Math.round(n))
}
