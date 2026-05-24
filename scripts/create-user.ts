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
  const password = "admin123";
  const email = `${username}@btsaset.local`; // Dummy email for username login

  console.log(`Setting up user: ${username}...`);

  const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error("Error checking existing users:", listError.message);
    return;
  }

  const existingUser = existingUsers.users.find(u => u.email === email);

  if (existingUser) {
    console.log(`User ${username} already exists. Updating password...`);
    const { data, error } = await supabase.auth.admin.updateUserById(existingUser.id, {
      password: password
    });

    if (error) {
      console.error("Error updating user password:", error.message);
    } else {
      console.log("Password updated successfully!");
      console.log(`Username: ${username}`);
      console.log(`New Password: ${password}`);
    }
  } else {
    console.log(`Creating new user: ${username}...`);
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto confirm
    });

    if (error) {
      console.error("Error creating user:", error.message);
    } else {
      console.log("User created successfully!");
      console.log(`Username: ${username}`);
      console.log(`Password: ${password}`);
      console.log(`ID: ${data.user.id}`);
    }
  }
}

createUser();
