import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);

    const page     = parseInt(searchParams.get("page")     ?? "1");
    const perPage  = parseInt(searchParams.get("perPage")  ?? "25");
    const search   = searchParams.get("search")   ?? "";
    const status   = searchParams.get("status")   ?? "";
    const kib      = searchParams.get("kib")      ?? "";
    const kawasan  = searchParams.get("kawasan")  ?? "";
    const kecamatan = searchParams.get("kecamatan") ?? "";
    const sortCol  = searchParams.get("sortCol")  ?? "id";
    const sortDir  = searchParams.get("sortDir")  ?? "asc";

    // Validate pagination parameters
    if (page < 1 || perPage < 1 || perPage > 1000) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" }, 
        { status: 400 }
      );
    }

    const from = (page - 1) * perPage;
    const to   = from + perPage - 1;

    let query = supabase
      .from("sites")
      .select("*", { count: "exact" })
      .order(sortCol, { ascending: sortDir === "asc" })
      .range(from, to);

    // Apply filters
    if (search) {
      query = query.or(
        `site_id.ilike.%${search}%,site_id_opsel.ilike.%${search}%,kecamatan.ilike.%${search}%,desa.ilike.%${search}%,keterangan.ilike.%${search}%`
      );
    }
    if (status)    query = query.eq("status", status);
    if (kib)       query = query.eq("tercatat_kib", kib);
    if (kawasan)   query = query.eq("kawasan", kawasan);
    if (kecamatan) query = query.eq("kecamatan", kecamatan);

    const { data, error, count } = await query;
    
    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch data from database" }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      data: data || [], 
      total: count ?? 0,
      page,
      perPage,
      totalPages: Math.ceil((count ?? 0) / perPage)
    });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();

    // Basic validation
    if (!body.site_id || !body.kecamatan || !body.desa) {
      return NextResponse.json(
        { error: "Missing required fields: site_id, kecamatan, desa" }, 
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("sites")
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      
      if (error.code === "23505") { // Unique constraint violation
        return NextResponse.json(
          { error: "Site ID already exists" }, 
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: "Failed to create record" }, 
        { status: 400 }
      );
    }

    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
