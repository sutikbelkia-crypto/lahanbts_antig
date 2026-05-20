/**
 * TEST CONNECTION SCRIPT
 * Script untuk test koneksi ke Supabase database
 * 
 * Cara menjalankan:
 * npx tsx scripts/test-connection.ts
 */

import { createClient } from "@supabase/supabase-js";

async function testConnection() {
  console.log("🔍 Testing Supabase connection...\n");

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log("📋 Environment Variables Check:");
  console.log(`✅ NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✓ Set' : '❌ Missing'}`);
  console.log(`✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseKey ? '✓ Set' : '❌ Missing'}`);
  console.log(`✅ SUPABASE_SERVICE_ROLE_KEY: ${serviceRoleKey ? '✓ Set' : '❌ Missing'}\n`);

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Environment variables tidak lengkap!");
    console.error("Pastikan file .env.local sudah diisi dengan benar.");
    process.exit(1);
  }

  // Test basic connection
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log("🔌 Testing basic connection...");
    const { data, error } = await supabase.from("sites").select("count", { count: "exact", head: true });
    
    if (error) {
      console.error("❌ Connection failed:", error.message);
      
      if (error.message.includes("relation \"sites\" does not exist")) {
        console.error("\n💡 Solusi: Jalankan SQL schema di Supabase SQL Editor");
        console.error("   1. Buka Supabase Dashboard > SQL Editor");
        console.error("   2. Copy-paste isi file supabase-schema.sql");
        console.error("   3. Click 'Run' untuk membuat tabel");
      }
      
      process.exit(1);
    }

    console.log(`✅ Connection successful! Found ${data} records in sites table\n`);

    // Test table structure
    console.log("🏗️  Testing table structure...");
    const { data: sampleData, error: structureError } = await supabase
      .from("sites")
      .select("*")
      .limit(1);

    if (structureError) {
      console.error("❌ Table structure error:", structureError.message);
      process.exit(1);
    }

    if (sampleData && sampleData.length > 0) {
      console.log("✅ Table structure OK. Sample columns:");
      Object.keys(sampleData[0]).forEach(col => {
        console.log(`   - ${col}`);
      });
    } else {
      console.log("⚠️  Table exists but empty. Run seed script to add data:");
      console.log("   npm run seed");
    }

    // Test service role key (if provided)
    if (serviceRoleKey) {
      console.log("\n🔑 Testing service role key...");
      const adminSupabase = createClient(supabaseUrl, serviceRoleKey);
      
      const { data: adminData, error: adminError } = await adminSupabase
        .from("sites")
        .select("count", { count: "exact", head: true });

      if (adminError) {
        console.error("❌ Service role key error:", adminError.message);
      } else {
        console.log("✅ Service role key working");
      }
    }

    console.log("\n🎉 All tests passed! Database connection is ready.");
    console.log("\n📝 Next steps:");
    console.log("   1. Run: npm run dev");
    console.log("   2. Open: http://localhost:3000");
    console.log("   3. If table is empty, run: npm run seed");

  } catch (error) {
    console.error("❌ Unexpected error:", error);
    process.exit(1);
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

testConnection().catch(console.error);