/**
 * Fix RLS - Enable public read access for sites table
 * Run: node scripts/fix-rls.js
 */
const https = require('https');

const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50cm11bHdtd3d0eGt1amR2bWFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTQxNDk0NSwiZXhwIjoyMDk0OTkwOTQ1fQ.UOzZFcTk6P1ZLeOWR0GbqZkd-Sp3Q3jW_z0r4chaxoE';

// SQL to disable RLS (simplest fix - public app, no auth needed)
const sql = `
  ALTER TABLE sites DISABLE ROW LEVEL SECURITY;
`;

function runSQL(sql) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql });
    const options = {
      hostname: 'ntrmulwmwwtxkujdvmap.supabase.co',
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const req = https.request(options, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, data: d }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// Alternative: use pg directly via REST
function disableRLS() {
  return new Promise((resolve, reject) => {
    // Try via Supabase management API approach
    const body = JSON.stringify([
      { query: 'ALTER TABLE sites DISABLE ROW LEVEL SECURITY' }
    ]);
    const options = {
      hostname: 'ntrmulwmwwtxkujdvmap.supabase.co',
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const req = https.request(options, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, data: d }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('🔧 Fixing RLS policy for Supabase...\n');
  
  const result = await disableRLS();
  console.log('Result:', result.status, result.data.substring(0, 200));
  
  console.log('\n📋 MANUAL FIX REQUIRED:');
  console.log('Go to: https://supabase.com/dashboard/project/ntrmulwmwwtxkujdvmap/editor');
  console.log('\nRun this SQL:');
  console.log('─'.repeat(50));
  console.log('ALTER TABLE sites DISABLE ROW LEVEL SECURITY;');
  console.log('─'.repeat(50));
  console.log('\nOR enable public read policy:');
  console.log('─'.repeat(50));
  console.log(`ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON sites FOR SELECT USING (true);
CREATE POLICY "Allow all operations" ON sites FOR ALL USING (true) WITH CHECK (true);`);
  console.log('─'.repeat(50));
}

main().catch(console.error);
