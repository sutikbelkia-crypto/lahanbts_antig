import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Debug endpoint untuk check status database
 * GET /api/debug
 */
export async function GET() {
  try {
    console.log("🔍 DEBUG: Starting database check...");
    
    const supabase = await createClient();
    console.log("✅ DEBUG: Supabase client created");

    // Check if table exists and has data
    const { data, error, count } = await supabase
      .from("sites")
      .select("*", { count: "exact" });
    
    if (error) {
      console.error("❌ DEBUG: Database error:", error);
      return NextResponse.json({
        status: "error",
        message: "Database query failed",
        error: error.message,
        details: error,
      }, { status: 500 });
    }

    console.log(`✅ DEBUG: Database query successful. Found ${count} records`);

    // Get sample records
    const sampleRecords = data?.slice(0, 3) ?? [];

    // Calculate stats
    const stats = {
      total: count ?? 0,
      aktif: data?.filter(r => r.status === "AKTIF").length ?? 0,
      terminasi: data?.filter(r => r.status?.includes("Terminasi")).length ?? 0,
      kib_sudah: data?.filter(r => r.tercatat_kib?.toLowerCase() === "sudah").length ?? 0,
      kib_belum: data?.filter(r => r.tercatat_kib === "Belum").length ?? 0,
    };

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      database: {
        connected: true,
        totalRecords: count,
        sampleRecords: sampleRecords,
      },
      stats: stats,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("❌ DEBUG: Unexpected error:", error);
    return NextResponse.json({
      status: "error",
      message: "Unexpected error",
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
