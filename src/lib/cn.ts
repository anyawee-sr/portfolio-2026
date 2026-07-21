import { clsx, type ClassValue } from 'clsx';

/**
 * Conditional className joiner. Wraps clsx so the whole app has a
 * single import for class composition — and one swap point if a real
 * Tailwind-conflict case ever needs tailwind-merge later (none exists
 * today; see CLAUDE.md SSoT rules re: custom utilities).
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
