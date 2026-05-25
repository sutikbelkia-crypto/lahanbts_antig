import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAuth } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();
    const { id } = await params;

    // Validate ID parameter
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Invalid ID parameter" }, 
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("sites")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") { // No rows returned
        return NextResponse.json(
          { error: "Site not found" }, 
          { status: 404 }
        );
      }
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch site" }, 
        { status: 500 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();
    const { id } = await params;
    const body = await req.json();

    // Validate ID parameter
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Invalid ID parameter" }, 
        { status: 400 }
      );
    }

    // Remove id from body to prevent updating it
    const { id: _, ...updateData } = body;

    const { data, error } = await supabase
      .from("sites")
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      
      if (error.code === "PGRST116") { // No rows returned
        return NextResponse.json(
          { error: "Site not found" }, 
          { status: 404 }
        );
      }
      
      if (error.code === "23505") { // Unique constraint violation
        return NextResponse.json(
          { error: "Site ID already exists" }, 
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: "Failed to update site" }, 
        { status: 400 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();
    const { id } = await params;

    // Validate ID parameter
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Invalid ID parameter" }, 
        { status: 400 }
      );
    }

    // Check if site exists first
    const { data: existingSite, error: checkError } = await supabase
      .from("sites")
      .select("id")
      .eq("id", id)
      .single();

    if (checkError || !existingSite) {
      return NextResponse.json(
        { error: "Site not found" }, 
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from("sites")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to delete site" }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Site deleted successfully" 
    });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
