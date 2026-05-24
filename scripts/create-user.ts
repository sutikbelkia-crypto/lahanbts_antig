import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createUser() {
  const username = "admin";
  const password = "password123";
  const email = `${username}@btsaset.local`; // Dummy email for username login

  console.log(`Creating user: ${username}...`);

  const { data, error } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true, // Auto confirm
  });

  if (error) {
    if (error.message.includes('already been registered')) {
        console.log(`User ${username} already exists.`);
    } else {
        console.error("Error creating user:", error.message);
    }
  } else {
    console.log("User created successfully!");
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log(`ID: ${data.user.id}`);
  }
}

createUser();
