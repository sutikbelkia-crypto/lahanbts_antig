import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const fmt = (n: number | null): string => {
  if (n == null) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);
};

export const fmtShort = (n: number | null): string => {
  if (n == null) return "-";
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}jt`;
  return `Rp ${n.toLocaleString("id-ID")}`;
};

export const fmtLuas = (n: number | null): string =>
  n != null ? `${n} m²` : "-";

export const pctOf = (part: number, total: number): string =>
  total === 0 ? "0%" : `${((part / total) * 100).toFixed(1)}%`;
