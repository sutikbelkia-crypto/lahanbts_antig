export type StatusOperasi = "AKTIF" | "Terminasi 2025";
export type StatusKIB = "Sudah" | "Belum" | "-";
export type StatusKawasan = "APL" | "Hutan" | "-";

export interface Site {
  id: number;
  site_id: string;
  site_id_opsel: string;
  kecamatan: string;
  desa: string;
  status: StatusOperasi;
  tercatat_kib: StatusKIB;
  nilai_kib: number | null;
  luas: number | null;
  sertifikat: string | null;
  kawasan: StatusKawasan;
  keterangan: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SiteFormData {
  site_id: string;
  site_id_opsel: string;
  kecamatan: string;
  desa: string;
  status: StatusOperasi;
  tercatat_kib: StatusKIB;
  nilai_kib: number | null;
  luas: number | null;
  sertifikat: string | null;
  kawasan: StatusKawasan;
  keterangan: string | null;
}

export interface SiteStats {
  total: number;
  aktif: number;
  terminasi: number;
  kib_sudah: number;
  kib_belum: number;
  kawasan_hutan: number;
  hibah_2026: number;
  total_nilai_kib: number;
}

export interface KecamatanSummary {
  kecamatan: string;
  total: number;
  aktif: number;
  terminasi: number;
  kib_sudah: number;
  kib_belum: number;
  kawasan_hutan: number;
  total_nilai: number;
}

export interface FilterState {
  search: string;
  status: string;
  tercatat_kib: string;
  kawasan: string;
  kecamatan: string;
}

export interface PaginationState {
  page: number;
  perPage: number;
  total: number;
}

export type SortDir = "asc" | "desc";
export interface SortState {
  col: keyof Site;
  dir: SortDir;
}
