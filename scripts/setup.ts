/**
 * SETUP SCRIPT
 * Script untuk setup otomatis aplikasi BTS Asset Management
 * 
 * Cara menjalankan:
 * npx tsx scripts/setup.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

async function setup() {
  console.log("🚀 BTS Asset Management - Setup Script\n");

  // Check if .env.local exists
  const envPath = path.join(process.cwd(), ".env.local");
  
  if (!fs.existsSync(envPath)) {
    console.log("📝 Creating .env.local from template...");
    const examplePath = path.join(process.cwd(), ".env.example");
    
    if (fs.existsSync(examplePath)) {
      fs.copyFileSync(examplePath, envPath);
      console.log("✅ .env.local created from .env.example");
      console.log("\n⚠️  IMPORTANT: Edit .env.local with your Supabase credentials!");
      console.log("   1. Go to https://supabase.com");
      console.log("   2. Create a new project");
      console.log("   3. Get your Project URL and API keys from Settings > API");
      console.log("   4. Update .env.local with your actual values");
      console.log("\n   Then run this script again: npm run setup\n");
      return;
    }
  }

  // Load environment variables
  require('dotenv').config({ path: '.env.local' });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Check environment variables
  console.log("🔍 Checking environment variables...");
  
  if (!supabaseUrl || supabaseUrl.includes("your-project-id")) {
    console.error("❌ NEXT_PUBLIC_SUPABASE_URL not set or still using placeholder");
    console.error("   Update .env.local with your actual Supabase Project URL");
    return;
  }

  if (!supabaseKey || supabaseKey.includes("your_supabase_anon_key")) {
    console.error("❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not set or still using placeholder");
    console.error("   Update .env.local with your actual Supabase Anon Key");
    return;
  }

  if (!serviceRoleKey || serviceRoleKey.includes("your_supabase_service_role_key")) {
    console.error("❌ SUPABASE_SERVICE_ROLE_KEY not set or still using placeholder");
    console.error("   Update .env.local with your actual Supabase Service Role Key");
    return;
  }

  console.log("✅ Environment variables OK\n");

  // Test connection
  console.log("🔌 Testing Supabase connection...");
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data, error } = await supabase.from("sites").select("count", { count: "exact", head: true });
    
    if (error) {
      if (error.message.includes("relation \"sites\" does not exist")) {
        console.log("⚠️  Table 'sites' does not exist. Creating database schema...");
        console.log("\n📋 Please run the following SQL in your Supabase SQL Editor:");
        console.log("   1. Go to your Supabase Dashboard");
        console.log("   2. Open SQL Editor");
        console.log("   3. Copy and paste the content from 'supabase-schema.sql'");
        console.log("   4. Click 'Run' to create the tables");
        console.log("\n   Then run this script again: npm run setup\n");
        return;
      }
      
      throw error;
    }

    console.log(`✅ Connection successful! Found ${data} records in sites table`);

    // Check if data exists
    if (data === 0) {
      console.log("\n📊 Database is empty. Running seed script...");
      
      // Import and run seed script
      const seedModule = await import("./seed");
      if (typeof seedModule.default === "function") {
        await seedModule.default();
      } else {
        console.log("⚠️  Please run seed script manually: npm run seed");
      }
    } else {
      console.log(`✅ Database has ${data} records`);
    }

    console.log("\n🎉 Setup completed successfully!");
    console.log("\n📝 Next steps:");
    console.log("   1. Run: npm run dev");
    console.log("   2. Open: http://localhost:3000");
    console.log("   3. Start managing your BTS assets!");

  } catch (error) {
    console.error("❌ Setup failed:", error);
    console.log("\n🔧 Troubleshooting:");
    console.log("   1. Verify your Supabase credentials in .env.local");
    console.log("   2. Make sure your Supabase project is active");
    console.log("   3. Run database schema in Supabase SQL Editor");
    console.log("   4. Try running: npm run test-connection");
  }
}

setup().catch(console.error);