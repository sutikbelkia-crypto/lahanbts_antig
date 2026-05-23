/**
 * Setup script - jalankan dengan: node scripts/run-setup.js
 * Tidak perlu npm install selesai dulu
 */
const https = require('https');

const SUPABASE_URL = 'https://ntrmulwmwwtxkujdvmap.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50cm11bHdtd3d0eGt1amR2bWFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTQxNDk0NSwiZXhwIjoyMDk0OTkwOTQ1fQ.UOzZFcTk6P1ZLeOWR0GbqZkd-Sp3Q3jW_z0r4chaxoE';

function supabaseRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(SUPABASE_URL + path);
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Prefer': 'return=minimal',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    };
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(responseData) }); }
        catch { resolve({ status: res.statusCode, data: responseData }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function sqlRequest(sql) {
  return new Promise((resolve, reject) => {
    const url = new URL(SUPABASE_URL + '/rest/v1/rpc/exec_sql');
    const data = JSON.stringify({ sql });
    const options = {
      hostname: url.hostname,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Length': Buffer.byteLength(data)
      }
    };
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: responseData }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

const dataBTS = [
  { site_id: "UXB072", site_id_opsel: "1901B610601004", kecamatan: "PURING KENCANA", desa: "PAMTAS KANTUK ASAM", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "UXB043", site_id_opsel: "1901B610601045", kecamatan: "PUSTUSSIBAU UTARA", desa: "SUNGAI ULUK PALING", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "UXB071", site_id_opsel: "1901B610601018", kecamatan: "PURING KENCANA", desa: "KANTUK ASAM", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "UXB045", site_id_opsel: "1901B610601041", kecamatan: "EMBALOH HULU", desa: "LAUK", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "UXB067", site_id_opsel: "1901B610601044", kecamatan: "EMBALOH HULU", desa: "ULAK PAUK", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "UXB076", site_id_opsel: "1901B610600945", kecamatan: "BATANG LUPAR", desa: "SUNGAI SENUNUK", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "UXA818", site_id_opsel: "1901B610600952", kecamatan: "BATANG LUPAR", desa: "LABIAN", status: "Terminasi 2025", tercatat_kib: "-", nilai_kib: null, luas: null, sertifikat: null, kawasan: "-", keterangan: "-" },
  { site_id: "UXB069", site_id_opsel: "1901B610601036", kecamatan: "PUTUSSIBAU SELATAN", desa: "KAREHO", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "UXB068", site_id_opsel: "1901B610601049", kecamatan: "PUTUSSIBAU SELATAN", desa: "BUNGAN JAYA", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "UXB080", site_id_opsel: "1901B610600950", kecamatan: "BATANG LUPAR", desa: "MELEMBAH", status: "Terminasi 2025", tercatat_kib: "-", nilai_kib: null, luas: null, sertifikat: null, kawasan: "-", keterangan: "-" },
  { site_id: "UXB048", site_id_opsel: "1901B610601040", kecamatan: "BATANG LUPAR", desa: "RANTAU PRAPAT", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "16PTS048", site_id_opsel: "1919B610600702", kecamatan: "EMBALOH HULU", desa: "BATU LINTANG", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "16PTS049", site_id_opsel: "1919B610600704", kecamatan: "PUTUSSIBAU UTARA", desa: "NANGA AWIN", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "16PTS050", site_id_opsel: "1919B610600700", kecamatan: "EMBALOH HULU", desa: "MENUA SADAP", status: "Terminasi 2025", tercatat_kib: "-", nilai_kib: null, luas: null, sertifikat: null, kawasan: "-", keterangan: "-" },
  { site_id: "16PTS051", site_id_opsel: "1919B610600703", kecamatan: "BATANG LUPAR", desa: "PAMTAS KELAWIK", status: "Terminasi 2025", tercatat_kib: "-", nilai_kib: null, luas: null, sertifikat: null, kawasan: "-", keterangan: "-" },
  { site_id: "16PTS054", site_id_opsel: "1919B610600708", kecamatan: "BUNUT HILIR", desa: "KAMPUNG BARU", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "16PTS052", site_id_opsel: "1919B610600706", kecamatan: "PUTUSSIBAU SELATAN", desa: "NANGA BALANG", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "16PTS053", site_id_opsel: "1919B610600705", kecamatan: "PUTUSSIBAU SELATAN", desa: "MATA LUNAI", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "16PTS022", site_id_opsel: "1901B610600739", kecamatan: "HULU GURUNG", desa: "TANI MAKMUR", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "16PTS024", site_id_opsel: "1904B610600732", kecamatan: "EMBALOH HILIR", desa: "NANGA LAUK", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "16PTS027", site_id_opsel: "1904B610600747", kecamatan: "BATANG LUPAR", desa: "SETULANG", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "16PTS028", site_id_opsel: "1904B610600745", kecamatan: "BOYAN TANJUNG", desa: "NANGA JEMAH", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "16PTS023", site_id_opsel: "1901B610600736", kecamatan: "BADAU", desa: "PULAU MAJANG", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "16PTS046", site_id_opsel: "1904B610600748", kecamatan: "BOYAN TANJUNG", desa: "NANGA BOYAN", status: "Terminasi 2025", tercatat_kib: "-", nilai_kib: null, luas: null, sertifikat: null, kawasan: "-", keterangan: "-" },
  { site_id: "16PTS047", site_id_opsel: "1904B610600744", kecamatan: "SILAT HULU", desa: "RIAM TAPANG", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "16PTS026", site_id_opsel: "1904B610600743", kecamatan: "SELIMBAU", desa: "SEKUBAH", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "16PTS025", site_id_opsel: "1904B610600746", kecamatan: "JONGKONG", desa: "UJUNG SAID", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "UXB104", site_id_opsel: "1917B610600329", kecamatan: "PUTUSSIBAU UTARA", desa: "BENUA TENGAH", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: 400, sertifikat: null, kawasan: "APL", keterangan: "Dokumen hibah di lakukan pada tahun 2026" },
  { site_id: "KLB5396", site_id_opsel: "1917B610601104", kecamatan: "BUNUT HULU", desa: "NANGA KELIBANG", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB5434", site_id_opsel: "1917B610601308", kecamatan: "SILAT HULU", desa: "NANGA LUAN", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB5432", site_id_opsel: "1917B610601306", kecamatan: "PUTUSSIBAU UTARA", desa: "NANGA NYABAU", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00289", site_id_opsel: "ZZJ722", kecamatan: "BUNUT HULU", desa: "SELAUP", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00339", site_id_opsel: "ZZJ748", kecamatan: "SILAT HILIR", desa: "PENAI", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00350", site_id_opsel: "ZZJ689", kecamatan: "SILAT HULU", desa: "ENTEBI", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00348", site_id_opsel: "ZZJ752", kecamatan: "SILAT HULU", desa: "PERJUK", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00357", site_id_opsel: "ZZJ600", kecamatan: "KALIS", desa: "BAHENAP", status: "AKTIF", tercatat_kib: "Sudah", nilai_kib: 4000000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { site_id: "KLB00385", site_id_opsel: "ZZJ703", kecamatan: "SUHAID", desa: "KERENGAS", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00683", site_id_opsel: "ZZJ736", kecamatan: "EMBALOH HULU", desa: "MENUA SADAP", status: "AKTIF", tercatat_kib: "Sudah", nilai_kib: 4000000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { site_id: "KLB00265", site_id_opsel: "ZZJ653", kecamatan: "PUTUSSIBAU UTARA", desa: "DATAH DIAN", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00267", site_id_opsel: "ZZJ714", kecamatan: "PUTUSSIBAU UTARA", desa: "TANJUNG BERUANG", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: 400, sertifikat: null, kawasan: "APL", keterangan: "Dokumen hibah di lakukan pada tahun 2026" },
  { site_id: "KLB00269", site_id_opsel: "ZZJ716", kecamatan: "PUTUSSIBAU UTARA", desa: "TANJUNG LASA", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00288", site_id_opsel: "ZZJ665", kecamatan: "BUNUT HULU", desa: "NANGA DUA", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00290", site_id_opsel: "ZZJ666", kecamatan: "BUNUT HULU", desa: "NANGA PAYANG", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00302", site_id_opsel: "ZZJ727", kecamatan: "HULU GURUNG", desa: "NANGA YEN", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00304", site_id_opsel: "ZZJ596", kecamatan: "HULU GURUNG", desa: "BERINGIN", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00305", site_id_opsel: "ZZJ672", kecamatan: "HULU GURUNG", desa: "KARYA MANDIRI", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { site_id: "KLB00321", site_id_opsel: "ZZJ678", kecamatan: "SEMITAU", desa: "NANGA LEMEDAK", status: "AKTIF", tercatat_kib: "Sudah", nilai_kib: 6800000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { site_id: "KLB00323", site_id_opsel: "ZZJ738", kecamatan: "SEMITAU", desa: "SEKEDAU", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00324", site_id_opsel: "ZZJ598", kecamatan: "SEBERUANG", desa: "BATI", status: "AKTIF", tercatat_kib: "Sudah", nilai_kib: 4000000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { site_id: "KLB00326", site_id_opsel: "ZZJ739", kecamatan: "SEBERUANG", desa: "TANJUNG KELILING", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
];

async function createTable() {
  console.log('🗄️  Creating database table...');
  const sql = `
    CREATE TABLE IF NOT EXISTS sites (
      id BIGSERIAL PRIMARY KEY,
      site_id VARCHAR(50) NOT NULL UNIQUE,
      site_id_opsel VARCHAR(50) NOT NULL,
      kecamatan VARCHAR(100) NOT NULL,
      desa VARCHAR(100) NOT NULL,
      status VARCHAR(20) NOT NULL CHECK (status IN ('AKTIF', 'Terminasi 2025')),
      tercatat_kib VARCHAR(10) CHECK (tercatat_kib IN ('Sudah', 'Belum', '-')),
      nilai_kib BIGINT,
      luas INTEGER,
      sertifikat VARCHAR(100),
      kawasan VARCHAR(20) CHECK (kawasan IN ('APL', 'Hutan', '-')),
      keterangan TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_sites_site_id ON sites(site_id);
    CREATE INDEX IF NOT EXISTS idx_sites_kecamatan ON sites(kecamatan);
    CREATE INDEX IF NOT EXISTS idx_sites_status ON sites(status);
    CREATE INDEX IF NOT EXISTS idx_sites_tercatat_kib ON sites(tercatat_kib);
    CREATE INDEX IF NOT EXISTS idx_sites_kawasan ON sites(kawasan);
  `;
  const result = await sqlRequest(sql);
  if (result.status >= 400) {
    console.log('⚠️  Table may already exist, continuing...');
  } else {
    console.log('✅ Table created successfully');
  }
}

async function seedData() {
  console.log(`📊 Seeding ${dataBTS.length} records...`);
  const result = await supabaseRequest('POST', '/rest/v1/sites', dataBTS);
  if (result.status === 201 || result.status === 200) {
    console.log(`✅ Seeded ${dataBTS.length} records successfully`);
  } else if (result.status === 409) {
    console.log('⚠️  Some records already exist (duplicate site_id), skipping...');
  } else {
    console.log(`⚠️  Seed response: ${result.status}`, result.data);
  }
}

async function checkCount() {
  const result = await supabaseRequest('GET', '/rest/v1/sites?select=count', null);
  console.log(`📈 Database check: status ${result.status}`);
}

async function main() {
  console.log('🚀 BTS Asset Management - Database Setup\n');
  try {
    await createTable();
    await seedData();
    await checkCount();
    console.log('\n🎉 Setup complete! Database is ready.');
    console.log('   Run: npm run dev');
    console.log('   Open: http://localhost:3000');
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

main();
