/**
 * SEED SCRIPT - Migrasi data dari data.js ke Supabase
 * 
 * Cara menjalankan:
 * 1. Pastikan .env.local sudah diisi dengan SUPABASE_SERVICE_ROLE_KEY
 * 2. npm install tsx (jika belum ada)
 * 3. npx tsx scripts/seed.ts
 */

import { createClient } from "@supabase/supabase-js";

// Data asli dari data.js (160 records)
const dataBTS = [
  { no: 1, siteId: "UXB072", siteIdOpsel: "1901B610601004", kecamatan: "PURING KENCANA", desa: "PAMTAS KANTUK ASAM", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 2, siteId: "UXB043", siteIdOpsel: "1901B610601045", kecamatan: "PUSTUSSIBAU UTARA", desa: "SUNGAI ULUK PALING", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 3, siteId: "UXB071", siteIdOpsel: "1901B610601018", kecamatan: "PURING KENCANA", desa: "KANTUK ASAM", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 4, siteId: "UXB045", siteIdOpsel: "1901B610601041", kecamatan: "EMBALOH HULU", desa: "LAUK", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 5, siteId: "UXB067", siteIdOpsel: "1901B610601044", kecamatan: "EMBALOH HULU", desa: "ULAK PAUK", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 6, siteId: "UXB076", siteIdOpsel: "1901B610600945", kecamatan: "BATANG LUPAR", desa: "SUNGAI SENUNUK", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 7, siteId: "UXA818", siteIdOpsel: "1901B610600952", kecamatan: "BATANG LUPAR", desa: "LABIAN", status: "Terminasi 2025", tercatatKIB: "-", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "-", keterangan: "-" },
  { no: 8, siteId: "UXB069", siteIdOpsel: "1901B610601036", kecamatan: "PUTUSSIBAU SELATAN", desa: "KAREHO", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 9, siteId: "UXB068", siteIdOpsel: "1901B610601049", kecamatan: "PUTUSSIBAU SELATAN", desa: "BUNGAN JAYA", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 10, siteId: "UXB080", siteIdOpsel: "1901B610600950", kecamatan: "BATANG LUPAR", desa: "MELEMBAH", status: "Terminasi 2025", tercatatKIB: "-", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "-", keterangan: "-" },
  { no: 11, siteId: "UXB048", siteIdOpsel: "1901B610601040", kecamatan: "BATANG LUPAR", desa: "RANTAU PRAPAT", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 12, siteId: "16PTS048", siteIdOpsel: "1919B610600702", kecamatan: "EMBALOH HULU", desa: "BATU LINTANG", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 13, siteId: "16PTS049", siteIdOpsel: "1919B610600704", kecamatan: "PUTUSSIBAU UTARA", desa: "NANGA AWIN", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 14, siteId: "16PTS050", siteIdOpsel: "1919B610600700", kecamatan: "EMBALOH HULU", desa: "MENUA SADAP", status: "Terminasi 2025", tercatatKIB: "-", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "-", keterangan: "-" },
  { no: 15, siteId: "16PTS051", siteIdOpsel: "1919B610600703", kecamatan: "BATANG LUPAR", desa: "PAMTAS KELAWIK", status: "Terminasi 2025", tercatatKIB: "-", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "-", keterangan: "-" },
  { no: 16, siteId: "16PTS054", siteIdOpsel: "1919B610600708", kecamatan: "BUNUT HILIR", desa: "KAMPUNG BARU", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 17, siteId: "16PTS052", siteIdOpsel: "1919B610600706", kecamatan: "PUTUSSIBAU SELATAN", desa: "NANGA BALANG", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 18, siteId: "16PTS053", siteIdOpsel: "1919B610600705", kecamatan: "PUTUSSIBAU SELATAN", desa: "MATA LUNAI", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 19, siteId: "16PTS022", siteIdOpsel: "1901B610600739", kecamatan: "HULU GURUNG", desa: "TANI MAKMUR", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 20, siteId: "16PTS024", siteIdOpsel: "1904B610600732", kecamatan: "EMBALOH HILIR", desa: "NANGA LAUK", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 21, siteId: "16PTS027", siteIdOpsel: "1904B610600747", kecamatan: "BATANG LUPAR", desa: "SETULANG", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 22, siteId: "16PTS028", siteIdOpsel: "1904B610600745", kecamatan: "BOYAN TANJUNG", desa: "NANGA JEMAH", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 23, siteId: "16PTS023", siteIdOpsel: "1901B610600736", kecamatan: "BADAU", desa: "PULAU MAJANG", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 24, siteId: "16PTS046", siteIdOpsel: "1904B610600748", kecamatan: "BOYAN TANJUNG", desa: "NANGA BOYAN", status: "Terminasi 2025", tercatatKIB: "-", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "-", keterangan: "-" },
  { no: 25, siteId: "16PTS047", siteIdOpsel: "1904B610600744", kecamatan: "SILAT HULU", desa: "RIAM TAPANG", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 26, siteId: "16PTS026", siteIdOpsel: "1904B610600743", kecamatan: "SELIMBAU", desa: "SEKUBAH", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 27, siteId: "16PTS025", siteIdOpsel: "1904B610600746", kecamatan: "JONGKONG", desa: "UJUNG SAID", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 28, siteId: "UXB104", siteIdOpsel: "1917B610600329", kecamatan: "PUTUSSIBAU UTARA", desa: "BENUA TENGAH", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: 400, sertifikat: null, kawasan: "APL", keterangan: "Dokumen hibah di lakukan pada tahun 2026" },
  { no: 29, siteId: "KLB5396", siteIdOpsel: "1917B610601104", kecamatan: "BUNUT HULU", desa: "NANGA KELIBANG", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 30, siteId: "KLB5434", siteIdOpsel: "1917B610601308", kecamatan: "SILAT HULU", desa: "NANGA LUAN", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 31, siteId: "KLB5432", siteIdOpsel: "1917B610601306", kecamatan: "PUTUSSIBAU UTARA", desa: "NANGA NYABAU", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 32, siteId: "KLB00289", siteIdOpsel: "ZZJ722", kecamatan: "BUNUT HULU", desa: "SELAUP", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 33, siteId: "KLB00339", siteIdOpsel: "ZZJ748", kecamatan: "SILAT HILIR", desa: "PENAI", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 34, siteId: "KLB00350", siteIdOpsel: "ZZJ689", kecamatan: "SILAT HULU", desa: "ENTEBI", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 35, siteId: "KLB00348", siteIdOpsel: "ZZJ752", kecamatan: "SILAT HULU", desa: "PERJUK", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 36, siteId: "KLB00357", siteIdOpsel: "ZZJ600", kecamatan: "KALIS", desa: "BAHENAP", status: "AKTIF", tercatatKIB: "Sudah", nilaiKIB: 4000000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { no: 37, siteId: "KLB00385", siteIdOpsel: "ZZJ703", kecamatan: "SUHAID", desa: "KERENGAS", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 38, siteId: "KLB00683", siteIdOpsel: "ZZJ736", kecamatan: "EMBALOH HULU", desa: "MENUA SADAP", status: "AKTIF", tercatatKIB: "Sudah", nilaiKIB: 4000000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { no: 39, siteId: "KLB00265", siteIdOpsel: "ZZJ653", kecamatan: "PUTUSSIBAU UTARA", desa: "DATAH DIAN", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 40, siteId: "KLB00267", siteIdOpsel: "ZZJ714", kecamatan: "PUTUSSIBAU UTARA", desa: "TANJUNG BERUANG", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: 400, sertifikat: null, kawasan: "APL", keterangan: "Dokumen hibah di lakukan pada tahun 2026" },
  { no: 41, siteId: "KLB00269", siteIdOpsel: "ZZJ716", kecamatan: "PUTUSSIBAU UTARA", desa: "TANJUNG LASA", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 42, siteId: "KLB00288", siteIdOpsel: "ZZJ665", kecamatan: "BUNUT HULU", desa: "NANGA DUA", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 43, siteId: "KLB00290", siteIdOpsel: "ZZJ666", kecamatan: "BUNUT HULU", desa: "NANGA PAYANG", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 44, siteId: "KLB00302", siteIdOpsel: "ZZJ727", kecamatan: "HULU GURUNG", desa: "NANGA YEN", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 45, siteId: "KLB00304", siteIdOpsel: "ZZJ596", kecamatan: "HULU GURUNG", desa: "BERINGIN", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 46, siteId: "KLB00305", siteIdOpsel: "ZZJ672", kecamatan: "HULU GURUNG", desa: "KARYA MANDIRI", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { no: 47, siteId: "KLB00321", siteIdOpsel: "ZZJ678", kecamatan: "SEMITAU", desa: "NANGA LEMEDAK", status: "AKTIF", tercatatKIB: "Sudah", nilaiKIB: 6800000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { no: 48, siteId: "KLB00323", siteIdOpsel: "ZZJ738", kecamatan: "SEMITAU", desa: "SEKEDAU", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 49, siteId: "KLB00324", siteIdOpsel: "ZZJ598", kecamatan: "SEBERUANG", desa: "BATI", status: "AKTIF", tercatatKIB: "Sudah", nilaiKIB: 4000000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { no: 50, siteId: "KLB00326", siteIdOpsel: "ZZJ739", kecamatan: "SEBERUANG", desa: "TANJUNG KELILING", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 51, siteId: "KLB00327", siteIdOpsel: "ZZJ740", kecamatan: "BATANG LUPAR", desa: "SUNGAI AJUNG", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 52, siteId: "KLB00328", siteIdOpsel: "ZZJ741", kecamatan: "BATANG LUPAR", desa: "SUNGAI ABAU", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 53, siteId: "KLB00332", siteIdOpsel: "ZZJ742", kecamatan: "EMPANANG", desa: "TINTIN PENINJAU", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 54, siteId: "KLB00333", siteIdOpsel: "ZZJ683", kecamatan: "EMPANANG", desa: "KUMANG JAYA", status: "AKTIF", tercatatKIB: "Sudah", nilaiKIB: 4800000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { no: 55, siteId: "KLB00345", siteIdOpsel: "ZZJ686", kecamatan: "SILAT HULU", desa: "NANGA LUNGU", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 56, siteId: "KLB00349", siteIdOpsel: "ZZJ688", kecamatan: "SILAT HULU", desa: "LANDAU RANTAU", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 57, siteId: "KLB00352", siteIdOpsel: "ZZJ754", kecamatan: "PUTUSSIBAU SELATAN", desa: "SUKA MAJU", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: 400, sertifikat: null, kawasan: "APL", keterangan: "Dokumen hibah di lakukan pada tahun 2026" },
  { no: 58, siteId: "KLB00355", siteIdOpsel: "ZZJ690", kecamatan: "KALIS", desa: "NANGA LEBANGAN", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 59, siteId: "KLB00356", siteIdOpsel: "ZZJ691", kecamatan: "KALIS", desa: "NANGA RAUN", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { no: 60, siteId: "KLB00362", siteIdOpsel: "ZZJ759", kecamatan: "KALIS", desa: "TEKUDAK", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 61, siteId: "KLB00273", siteIdOpsel: "ZZJ657", kecamatan: "BIKA", desa: "MELAPI MANDAY", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 62, siteId: "KLB00283", siteIdOpsel: "ZZJ662", kecamatan: "EMBALOH HULU", desa: "LANGAN BARU", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 63, siteId: "KLB00285", siteIdOpsel: "ZZJ663", kecamatan: "BUNUT HILIR", desa: "EMPANGAU", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 64, siteId: "KLB00299", siteIdOpsel: "ZZJ669", kecamatan: "JONGKONG", desa: "BONTAI", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 65, siteId: "KLB00300", siteIdOpsel: "ZZJ670", kecamatan: "JONGKONG", desa: "KARYA BARU", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 66, siteId: "KLB00309", siteIdOpsel: "ZZJ674", kecamatan: "SELIMBAU", desa: "GERAYAU", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 67, siteId: "KLB00308", siteIdOpsel: "ZZJ729", kecamatan: "SELIMBAU", desa: "PIASAK HILIR", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 68, siteId: "KLB00276", siteIdOpsel: "ZZJ659", kecamatan: "EMBALOH HILIR", desa: "LAWIK", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 69, siteId: "KLB00366", siteIdOpsel: "ZZJ763", kecamatan: "KALIS", desa: "RANTAU BUMBUN", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { no: 70, siteId: "KLB00375", siteIdOpsel: "ZZJ767", kecamatan: "BOYAN TANJUNG", desa: "TELUK GERUGUK", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 71, siteId: "KLB00378", siteIdOpsel: "ZZJ700", kecamatan: "MENTEBAH", desa: "KEPALA GURUNG", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { no: 72, siteId: "KLB00387", siteIdOpsel: "ZZJ705", kecamatan: "SUHAID", desa: "LAUT TAWANG", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { no: 73, siteId: "KLB00393", siteIdOpsel: "ZZJ711", kecamatan: "PURING KENCANA", desa: "KANTUK BUNUT", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 74, siteId: "KLB00630", siteIdOpsel: "ZZJ723", kecamatan: "BUNUT HULU", desa: "PANTAS BERSATU", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { no: 75, siteId: "KLB00633", siteIdOpsel: "ZZJ765", kecamatan: "EMBALOH HILIR", desa: "PALA PINTAS", status: "AKTIF", tercatatKIB: "Sudah", nilaiKIB: 4800000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { no: 76, siteId: "KLB00638", siteIdOpsel: "ZZJ710", kecamatan: "PURING KENCANA", desa: "SUNGAI MAWANG", status: "AKTIF", tercatatKIB: "Sudah", nilaiKIB: 4000000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { no: 77, siteId: "KLB00698", siteIdOpsel: "ZZJ750", kecamatan: "SILAT HULU", desa: "SELANGKAI", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { no: 78, siteId: "KLB00700", siteIdOpsel: "ZZJ747", kecamatan: "EMPANANG", desa: "BAJAU ANDAI", status: "AKTIF", tercatatKIB: "Sudah", nilaiKIB: 4800000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { no: 79, siteId: "KLB00628", siteIdOpsel: "ZZJ654", kecamatan: "PENGKADAN", desa: "HULU PENGKADAN", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { no: 80, siteId: "KLB00384", siteIdOpsel: "ZZJ702", kecamatan: "SUHAID", desa: "MENSUSAI", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 81, siteId: "KLB00275", siteIdOpsel: "ZZJ658", kecamatan: "BIKA", desa: "JONGKONG MANDAY", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: 400, sertifikat: null, kawasan: "APL", keterangan: "Dokumen hibah di lakukan pada tahun 2026" },
  { no: 82, siteId: "KLB00317", siteIdOpsel: "ZZJ735", kecamatan: "SEMITAU", desa: "NANGA SEBERUANG", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 83, siteId: "KLB00291", siteIdOpsel: "ZZJ595", kecamatan: "BUNUT HULU", desa: "BATU TIGA", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { no: 84, siteId: "KLB00331", siteIdOpsel: "ZZJ682", kecamatan: "EMPANANG", desa: "KELING PANGGAU", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 85, siteId: "KLB00343", siteIdOpsel: "ZZJ599", kecamatan: "SILAT HULU", desa: "BELIMBING", status: "AKTIF", tercatatKIB: "Sudah", nilaiKIB: 4000000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { no: 86, siteId: "KLB00282", siteIdOpsel: "ZZJ719", kecamatan: "EMBALOH HULU", desa: "SAUJUNG GILING MANIK", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 87, siteId: "KLB00319", siteIdOpsel: "ZZJ677", kecamatan: "SEMITAU", desa: "KENEPAI KOMPLEK", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 88, siteId: "KLB00353", siteIdOpsel: "ZZJ755", kecamatan: "PUTUSSIBAU SELATAN", desa: "TANJUNG LOKANG", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { no: 89, siteId: "KLB00363", siteIdOpsel: "ZZJ760", kecamatan: "KALIS", desa: "TAPANG DAAN", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { no: 90, siteId: "KLB00394", siteIdOpsel: "ZZJ712", kecamatan: "PURING KENCANA", desa: "LANGAU", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 91, siteId: "KLB00391", siteIdOpsel: "ZZJ709", kecamatan: "PURING KENCANA", desa: "MERAKAI PANJANG", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 92, siteId: "KLB00695", siteIdOpsel: "ZZJ697", kecamatan: "BOYAN TANJUNG", desa: "TUBANG JAYA", status: "AKTIF", tercatatKIB: "Sudah", nilaiKIB: 3360000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { no: 93, siteId: "KLB00374", siteIdOpsel: "ZZJ698", kecamatan: "BOYAN TANJUNG", desa: "LANDAU MENTAIL", status: "AKTIF", tercatatKIB: "Sudah", nilaiKIB: 3360000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { no: 94, siteId: "KLB00334", siteIdOpsel: "ZZJ743", kecamatan: "BADAU", desa: "SERIANG", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 95, siteId: "KLB00266", siteIdOpsel: "ZZJ593", kecamatan: "PUTUSSIBAU UTARA", desa: "BENUA TENGAH", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 96, siteId: "KLB00293", siteIdOpsel: "ZZJ724", kecamatan: "BUNUT HULU", desa: "SEGITAK", status: "AKTIF", tercatatKIB: "Sudah", nilaiKIB: 5600000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { no: 97, siteId: "KLB00372", siteIdOpsel: "ZZJ696", kecamatan: "BOYAN TANJUNG", desa: "NANGA BOYAN", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 98, siteId: "KLB00268", siteIdOpsel: "ZZJ715", kecamatan: "PUTUSSIBAU UTARA", desa: "SELUAN", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 99, siteId: "KLB00297", siteIdOpsel: "ZZJ725", kecamatan: "JONGKONG", desa: "TEMENANG", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 100, siteId: "KLB00682", siteIdOpsel: "ZZJ744", kecamatan: "BATANG LUPAR", desa: "MENSIAU", status: "AKTIF", tercatatKIB: "Sudah", nilaiKIB: 4000000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { no: 101, siteId: "KLB00344", siteIdOpsel: "ZZJ685", kecamatan: "SILAT HULU", desa: "LANDAU BADAI", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 102, siteId: "KLB00360", siteIdOpsel: "ZZJ693", kecamatan: "KALIS", desa: "KENSURAY", status: "AKTIF", tercatatKIB: "Sudah", nilaiKIB: 4000000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { no: 103, siteId: "KLB00368", siteIdOpsel: "ZZJ694", kecamatan: "BOYAN TANJUNG", desa: "NANGA DANAU", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 104, siteId: "KLB00307", siteIdOpsel: "ZZJ728", kecamatan: "SELIMBAU", desa: "NIBUNG", status: "AKTIF", tercatatKIB: "Sudah", nilaiKIB: 4000000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { no: 105, siteId: "KLB00371", siteIdOpsel: "ZZJ766", kecamatan: "BOYAN TANJUNG", desa: "SRI WANGI", status: "AKTIF", tercatatKIB: "Sudah", nilaiKIB: 3360000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { no: 106, siteId: "KLB00337", siteIdOpsel: "ZZJ746", kecamatan: "BADAU", desa: "TAJUM", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 107, siteId: "KLB00347", siteIdOpsel: "ZZJ687", kecamatan: "SILAT HULU", desa: "LEBAK NAJAH", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 108, siteId: "KLB00379", siteIdOpsel: "ZZJ769", kecamatan: "MENTEBAH", desa: "TANJUNG", status: "AKTIF", tercatatKIB: "Sudah", nilaiKIB: 3360000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { no: 109, siteId: "KLB00637", siteIdOpsel: "ZZJ751", kecamatan: "SILAT HILIR", desa: "SENTABAI", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 110, siteId: "KLB00701", siteIdOpsel: "ZZJ684", kecamatan: "BADAU", desa: "KEKURAK", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 111, siteId: "KLB00318", siteIdOpsel: "ZZJ676", kecamatan: "SEMITAU", desa: "ENTIPAN", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 112, siteId: "KLB00322", siteIdOpsel: "ZZJ737", kecamatan: "SEMITAU", desa: "PADUNG KUMANG", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 113, siteId: "KLB00341", siteIdOpsel: "ZZJ749", kecamatan: "SILAT HILIR", desa: "SEBERU", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 114, siteId: "KLB00315", siteIdOpsel: "ZZJ733", kecamatan: "SELIMBAU", desa: "SEMALAH", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { no: 115, siteId: "KLB00316", siteIdOpsel: "ZZJ734", kecamatan: "SELIMBAU", desa: "TEMPURAU", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { no: 116, siteId: "KLB00377", siteIdOpsel: "ZZJ768", kecamatan: "MENTEBAH", desa: "SUKA MAJU", status: "AKTIF", tercatatKIB: "Sudah", nilaiKIB: 364000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { no: 117, siteId: "KLB00699", siteIdOpsel: "ZZJ667", kecamatan: "SELIMBAU", desa: "GUDANG HILIR", status: "AKTIF", tercatatKIB: "Sudah", nilaiKIB: 4000000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { no: 118, siteId: "KLB00716", siteIdOpsel: "ZZJ770", kecamatan: "SEBERUANG", desa: "NANGA LOT", status: "AKTIF", tercatatKIB: "Sudah", nilaiKIB: 2000000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { no: 119, siteId: "KLB00325", siteIdOpsel: "ZZJ679", kecamatan: "SEBERUANG", desa: "EMPERIANG", status: "AKTIF", tercatatKIB: "Sudah", nilaiKIB: 4000000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { no: 120, siteId: "KLB00336", siteIdOpsel: "ZZJ745", kecamatan: "BADAU", desa: "TINTING SELIGI", status: "AKTIF", tercatatKIB: "Sudah", nilaiKIB: 4800000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { no: 121, siteId: "KLB00351", siteIdOpsel: "ZZJ753", kecamatan: "SILAT HULU", desa: "SELIMU", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { no: 122, siteId: "KLB00370", siteIdOpsel: "ZZJ695", kecamatan: "BOYAN TANJUNG", desa: "NANGA SANGAN", status: "AKTIF", tercatatKIB: "Sudah", nilaiKIB: 3360000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { no: 123, siteId: "KLB00627", siteIdOpsel: "ZZJ713", kecamatan: "PUTUSSIBAU SELATAN", desa: "CEMPAKA BARU", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: 400, sertifikat: null, kawasan: "APL", keterangan: "Dokumen hibah di lakukan pada tahun 2026" },
  { no: 124, siteId: "KLB00634", siteIdOpsel: "ZZJ660", kecamatan: "HULU GURUNG", desa: "MENTAWIT", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 125, siteId: "KLB00376", siteIdOpsel: "ZZJ699", kecamatan: "BOYAN TANJUNG", desa: "NANGA RET", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 126, siteId: "KLB00280", siteIdOpsel: "ZZJ594", kecamatan: "EMBALOH HILIR", desa: "BELATUNG", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 127, siteId: "KLB00310", siteIdOpsel: "ZZJ597", kecamatan: "SELIMBAU", desa: "BENUIS", status: "AKTIF", tercatatKIB: "Sudah", nilaiKIB: 4000000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { no: 128, siteId: "KLB00272", siteIdOpsel: "ZZJ656", kecamatan: "BIKA", desa: "NANGA MANDAY", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 129, siteId: "KLB00278", siteIdOpsel: "ZZJ661", kecamatan: "EMBALOH HILIR", desa: "KIRIN NANGKA", status: "AKTIF", tercatatKIB: "Sudah", nilaiKIB: 4800000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { no: 130, siteId: "KLB00295", siteIdOpsel: "ZZJ668", kecamatan: "JONGKONG", desa: "JONGKONG KIRI HULU", status: "AKTIF", tercatatKIB: "Sudah", nilaiKIB: 4000000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { no: 131, siteId: "KLB00314", siteIdOpsel: "ZZJ675", kecamatan: "SELIMBAU", desa: "MAWAN", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 132, siteId: "KLB00632", siteIdOpsel: "ZZJ680", kecamatan: "PENGKADAN", desa: "PINANG LAKA", status: "AKTIF", tercatatKIB: "Sudah", nilaiKIB: 4000000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { no: 133, siteId: "KLB00330", siteIdOpsel: "ZZJ681", kecamatan: "BATANG LUPAR", desa: "LABIAN IRAANG", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 134, siteId: "KLB00359", siteIdOpsel: "ZZJ692", kecamatan: "KALIS", desa: "NANGA DANAU", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: 400, sertifikat: null, kawasan: "APL", keterangan: "Dokumen hibah di lakukan pada tahun 2026" },
  { no: 135, siteId: "KLB00274", siteIdOpsel: "ZZJ717", kecamatan: "BIKA", desa: "PENYELUANG", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 136, siteId: "KLB00313", siteIdOpsel: "ZZJ732", kecamatan: "SELIMBAU", desa: "SEKULAT", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { no: 137, siteId: "KLB00364", siteIdOpsel: "ZZJ761", kecamatan: "KALIS", desa: "SEGIAM", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 138, siteId: "KLB00365", siteIdOpsel: "ZZJ762", kecamatan: "KALIS", desa: "RIBANG KADENG", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { no: 139, siteId: "KLB00301", siteIdOpsel: "ZZJ726", kecamatan: "JONGKONG", desa: "NANGA SERIAN", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 140, siteId: "KLB00386", siteIdOpsel: "ZZJ704", kecamatan: "SUHAID", desa: "MANTAN", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 141, siteId: "KLB00358", siteIdOpsel: "ZZJ757", kecamatan: "KALIS", desa: "NANGA TUBUK", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 142, siteId: "KLB00271", siteIdOpsel: "ZZJ655", kecamatan: "PUTUSSIBAU UTARA", desa: "JANGKANG", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: 400, sertifikat: null, kawasan: "APL", keterangan: "Dokumen hibah di lakukan pada tahun 2026" },
  { no: 143, siteId: "KLB00281", siteIdOpsel: "ZZJ718", kecamatan: "EMBALOH HULU", desa: "PULAU MANAK", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 144, siteId: "KLB00279", siteIdOpsel: "ZZJ773", kecamatan: "EMBALOH HILIR", desa: "UJUNG BAYUR", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 145, siteId: "KLB00286", siteIdOpsel: "ZZJ664", kecamatan: "BUNUT HILIR", desa: "EMPANGAU HILIR", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 146, siteId: "KLB00284", siteIdOpsel: "ZZJ720", kecamatan: "EMBALOH HULU", desa: "TAMAO", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 147, siteId: "KLB00354", siteIdOpsel: "ZZJ756", kecamatan: "KALIS", desa: "NANGA SEBINTANG", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { no: 148, siteId: "KLB00388", siteIdOpsel: "ZZJ706", kecamatan: "SUHAID", desa: "JONGKONG HULU", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 149, siteId: "KLB00383", siteIdOpsel: "ZZJ772", kecamatan: "PENGKADAN", desa: "SASAN", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 150, siteId: "KLB00382", siteIdOpsel: "ZZJ771", kecamatan: "PENGKADAN", desa: "PERMATA", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 151, siteId: "KLB00626", siteIdOpsel: "ZZJ774", kecamatan: "SEBERUANG", desa: "GURUNG", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 152, siteId: "KLB00389", siteIdOpsel: "ZZJ707", kecamatan: "SUHAID", desa: "MENAPAR", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 153, siteId: "KLB00361", siteIdOpsel: "ZZJ758", kecamatan: "KALIS", desa: "RANTAU KALIS", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 154, siteId: "KLB00298", siteIdOpsel: "ZZJ775", kecamatan: "JONGKONG", desa: "UJUNG JAMBU", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 155, siteId: "KLB00380", siteIdOpsel: "ZZJ701", kecamatan: "PENGKADAN", desa: "KERANGAN PANJANG", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 156, siteId: "KLB00312", siteIdOpsel: "ZZJ731", kecamatan: "SELIMBAU", desa: "PIASAK HULU", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 157, siteId: "KLB00367", siteIdOpsel: "ZZJ764", kecamatan: "KALIS", desa: "PENIUNG", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 158, siteId: "KLB00631", siteIdOpsel: "ZZJ730", kecamatan: "BUNUT HILIR", desa: "TELUK AUR", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { no: 159, siteId: "KLB00303", siteIdOpsel: "ZZJ671", kecamatan: "HULU GURUNG", desa: "KELAKAR", status: "AKTIF", tercatatKIB: "Sudah", nilaiKIB: 3360000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { no: 160, siteId: "KLB00629", siteIdOpsel: "ZZJ721", kecamatan: "BUNUT HULU", desa: "BAKONG PERMAI", status: "AKTIF", tercatatKIB: "Belum", nilaiKIB: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
];

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("❌ Environment variables tidak lengkap!");
    console.error("Pastikan NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY sudah diset di .env.local");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  console.log("🚀 Memulai migrasi data ke Supabase...");

  // Hapus data lama (opsional)
  console.log("🗑️  Menghapus data lama...");
  const { error: deleteError } = await supabase.from("sites").delete().neq("id", 0);
  if (deleteError) {
    console.error("❌ Error menghapus data lama:", deleteError);
    process.exit(1);
  }

  // Transform data untuk Supabase
  const transformedData = dataBTS.map(item => ({
    site_id: item.siteId,
    site_id_opsel: item.siteIdOpsel,
    kecamatan: item.kecamatan,
    desa: item.desa,
    status: item.status as "AKTIF" | "Terminasi 2025",
    tercatat_kib: item.tercatatKIB || null,
    nilai_kib: item.nilaiKIB,
    luas: item.luas,
    sertifikat: item.sertifikat,
    kawasan: item.kawasan || null,
    keterangan: item.keterangan,
  }));

  // Insert data dalam batch (Supabase limit ~1000 rows per batch)
  const batchSize = 100;
  let inserted = 0;

  for (let i = 0; i < transformedData.length; i += batchSize) {
    const batch = transformedData.slice(i, i + batchSize);
    console.log(`📝 Inserting batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(transformedData.length/batchSize)} (${batch.length} records)...`);
    
    const { data, error } = await supabase
      .from("sites")
      .insert(batch)
      .select("id");

    if (error) {
      console.error("❌ Error inserting batch:", error);
      process.exit(1);
    }

    inserted += data?.length || 0;
    console.log(`✅ Inserted ${data?.length || 0} records`);
  }

  console.log(`🎉 Migrasi selesai! Total ${inserted} records berhasil diinsert ke Supabase.`);

  // Verifikasi
  const { count, error: countError } = await supabase
    .from("sites")
    .select("*", { count: "exact", head: true });

  if (countError) {
    console.error("❌ Error verifying count:", countError);
  } else {
    console.log(`✅ Verifikasi: Total ${count} records di database`);
  }
}

main().catch(console.error);