import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.from("sites").select("*");
    
    if (error) {
      console.error("❌ Database error in /api/stats:", error);
      return NextResponse.json(
        { error: "Failed to fetch statistics", details: error.message }, 
        { status: 500 }
      );
    }

    const d = data ?? [];
    console.log(`✅ /api/stats: Fetched ${d.length} records from database`);
    
    // Normalize data for consistent filtering (case-insensitive)
    const normalizeString = (str: string | null | undefined): string => {
      return (str ?? "").toLowerCase().trim();
    };
    
    // Calculate main statistics with case-insensitive filtering
    const stats = {
      total:          d.length,
      aktif:          d.filter(r => normalizeString(r.status) === "aktif").length,
      terminasi:      d.filter(r => normalizeString(r.status).includes("terminasi")).length,
      kib_sudah:      d.filter(r => normalizeString(r.tercatat_kib) === "sudah").length,
      kib_belum:      d.filter(r => normalizeString(r.tercatat_kib) === "belum").length,
      kawasan_hutan:  d.filter(r => normalizeString(r.kawasan) === "hutan").length,
      kawasan_apl:    d.filter(r => normalizeString(r.kawasan) === "apl").length,
      hibah_2026:     d.filter(r => normalizeString(r.keterangan).includes("2026")).length,
      total_nilai_kib: d.reduce((sum: number, r) => sum + (r.nilai_kib ?? 0), 0),
      avg_nilai_kib:  d.filter(r => r.nilai_kib && r.nilai_kib > 0).length > 0 
        ? Math.round(d.reduce((sum: number, r) => sum + (r.nilai_kib ?? 0), 0) / d.filter(r => r.nilai_kib && r.nilai_kib > 0).length)
        : 0,
    };
    
    // Log detailed breakdown for debugging
    console.log(`📊 Stats breakdown:`, {
      total: stats.total,
      aktif: stats.aktif,
      terminasi: stats.terminasi,
      kib_sudah: stats.kib_sudah,
      kib_belum: stats.kib_belum,
      kawasan_hutan: stats.kawasan_hutan,
      kawasan_apl: stats.kawasan_apl,
    });

    // Per-kecamatan summary
    const kecMap: Record<string, typeof d> = {};
    d.forEach(r => {
      const kecamatan = r.kecamatan || "Unknown";
      if (!kecMap[kecamatan]) kecMap[kecamatan] = [];
      kecMap[kecamatan].push(r);
    });

    const kecamatan_summary = Object.entries(kecMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([kec, rows]) => ({
        kecamatan:     kec,
        total:         rows.length,
        aktif:         rows.filter(r => normalizeString(r.status) === "aktif").length,
        terminasi:     rows.filter(r => normalizeString(r.status).includes("terminasi")).length,
        kib_sudah:     rows.filter(r => normalizeString(r.tercatat_kib) === "sudah").length,
        kib_belum:     rows.filter(r => normalizeString(r.tercatat_kib) === "belum").length,
        kawasan_hutan: rows.filter(r => normalizeString(r.kawasan) === "hutan").length,
        kawasan_apl:   rows.filter(r => normalizeString(r.kawasan) === "apl").length,
        total_nilai:   rows.reduce((sum: number, r) => sum + (r.nilai_kib ?? 0), 0),
        avg_nilai:     rows.filter(r => r.nilai_kib && r.nilai_kib > 0).length > 0 
          ? Math.round(rows.reduce((sum: number, r) => sum + (r.nilai_kib ?? 0), 0) / rows.filter(r => r.nilai_kib && r.nilai_kib > 0).length)
          : 0,
      }));

    // Status distribution for charts
    const status_distribution = [
      { label: "AKTIF", value: stats.aktif },
      { label: "Terminasi 2025", value: stats.terminasi },
    ];

    const kib_distribution = [
      { label: "Sudah", value: stats.kib_sudah },
      { label: "Belum", value: stats.kib_belum },
      { label: "Tidak Diketahui", value: stats.total - stats.kib_sudah - stats.kib_belum },
    ];

    const kawasan_distribution = [
      { label: "APL", value: stats.kawasan_apl },
      { label: "Hutan", value: stats.kawasan_hutan },
      { label: "Lainnya", value: stats.total - stats.kawasan_apl - stats.kawasan_hutan },
    ];

    return NextResponse.json({ 
      stats, 
      kecamatan_summary,
      charts: {
        status_distribution,
        kib_distribution,
        kawasan_distribution,
      }
    });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
