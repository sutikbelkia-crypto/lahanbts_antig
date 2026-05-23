const https = require('https');
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50cm11bHdtd3d0eGt1amR2bWFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTQxNDk0NSwiZXhwIjoyMDk0OTkwOTQ1fQ.UOzZFcTk6P1ZLeOWR0GbqZkd-Sp3Q3jW_z0r4chaxoE';

function post(data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const options = {
      hostname: 'ntrmulwmwwtxkujdvmap.supabase.co',
      path: '/rest/v1/sites',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Prefer': 'return=minimal',
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

function getCount() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'ntrmulwmwwtxkujdvmap.supabase.co',
      path: '/rest/v1/sites?select=id',
      method: 'GET',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Prefer': 'count=exact'
      }
    };
    const req = https.request(options, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ count: res.headers['content-range'], data: d }));
    });
    req.on('error', reject);
    req.end();
  });
}

const data = [
  { site_id: "KLB00344", site_id_opsel: "ZZJ685", kecamatan: "SILAT HULU", desa: "LANDAU BADAI", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00360", site_id_opsel: "ZZJ693", kecamatan: "KALIS", desa: "KENSURAY", status: "AKTIF", tercatat_kib: "Sudah", nilai_kib: 4000000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { site_id: "KLB00368", site_id_opsel: "ZZJ694", kecamatan: "BOYAN TANJUNG", desa: "NANGA DANAU", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00307", site_id_opsel: "ZZJ728", kecamatan: "SELIMBAU", desa: "NIBUNG", status: "AKTIF", tercatat_kib: "Sudah", nilai_kib: 4000000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { site_id: "KLB00371", site_id_opsel: "ZZJ766", kecamatan: "BOYAN TANJUNG", desa: "SRI WANGI", status: "AKTIF", tercatat_kib: "Sudah", nilai_kib: 3360000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { site_id: "KLB00337", site_id_opsel: "ZZJ746", kecamatan: "BADAU", desa: "TAJUM", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00347", site_id_opsel: "ZZJ687", kecamatan: "SILAT HULU", desa: "LEBAK NAJAH", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00379", site_id_opsel: "ZZJ769", kecamatan: "MENTEBAH", desa: "TANJUNG", status: "AKTIF", tercatat_kib: "Sudah", nilai_kib: 3360000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { site_id: "KLB00637", site_id_opsel: "ZZJ751", kecamatan: "SILAT HILIR", desa: "SENTABAI", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00701", site_id_opsel: "ZZJ684", kecamatan: "BADAU", desa: "KEKURAK", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00318", site_id_opsel: "ZZJ676", kecamatan: "SEMITAU", desa: "ENTIPAN", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00322", site_id_opsel: "ZZJ737", kecamatan: "SEMITAU", desa: "PADUNG KUMANG", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00341", site_id_opsel: "ZZJ749", kecamatan: "SILAT HILIR", desa: "SEBERU", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00315", site_id_opsel: "ZZJ733", kecamatan: "SELIMBAU", desa: "SEMALAH", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { site_id: "KLB00316", site_id_opsel: "ZZJ734", kecamatan: "SELIMBAU", desa: "TEMPURAU", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { site_id: "KLB00377", site_id_opsel: "ZZJ768", kecamatan: "MENTEBAH", desa: "SUKA MAJU", status: "AKTIF", tercatat_kib: "Sudah", nilai_kib: 364000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { site_id: "KLB00699", site_id_opsel: "ZZJ667", kecamatan: "SELIMBAU", desa: "GUDANG HILIR", status: "AKTIF", tercatat_kib: "Sudah", nilai_kib: 4000000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { site_id: "KLB00716", site_id_opsel: "ZZJ770", kecamatan: "SEBERUANG", desa: "NANGA LOT", status: "AKTIF", tercatat_kib: "Sudah", nilai_kib: 2000000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { site_id: "KLB00325", site_id_opsel: "ZZJ679", kecamatan: "SEBERUANG", desa: "EMPERIANG", status: "AKTIF", tercatat_kib: "Sudah", nilai_kib: 4000000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { site_id: "KLB00336", site_id_opsel: "ZZJ745", kecamatan: "BADAU", desa: "TINTING SELIGI", status: "AKTIF", tercatat_kib: "Sudah", nilai_kib: 4800000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { site_id: "KLB00351", site_id_opsel: "ZZJ753", kecamatan: "SILAT HULU", desa: "SELIMU", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { site_id: "KLB00370", site_id_opsel: "ZZJ695", kecamatan: "BOYAN TANJUNG", desa: "NANGA SANGAN", status: "AKTIF", tercatat_kib: "Sudah", nilai_kib: 3360000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { site_id: "KLB00627", site_id_opsel: "ZZJ713", kecamatan: "PUTUSSIBAU SELATAN", desa: "CEMPAKA BARU", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: 400, sertifikat: null, kawasan: "APL", keterangan: "Dokumen hibah di lakukan pada tahun 2026" },
  { site_id: "KLB00634", site_id_opsel: "ZZJ660", kecamatan: "HULU GURUNG", desa: "MENTAWIT", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00376", site_id_opsel: "ZZJ699", kecamatan: "BOYAN TANJUNG", desa: "NANGA RET", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00280", site_id_opsel: "ZZJ594", kecamatan: "EMBALOH HILIR", desa: "BELATUNG", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00310", site_id_opsel: "ZZJ597", kecamatan: "SELIMBAU", desa: "BENUIS", status: "AKTIF", tercatat_kib: "Sudah", nilai_kib: 4000000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { site_id: "KLB00272", site_id_opsel: "ZZJ656", kecamatan: "BIKA", desa: "NANGA MANDAY", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00278", site_id_opsel: "ZZJ661", kecamatan: "EMBALOH HILIR", desa: "KIRIN NANGKA", status: "AKTIF", tercatat_kib: "Sudah", nilai_kib: 4800000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { site_id: "KLB00295", site_id_opsel: "ZZJ668", kecamatan: "JONGKONG", desa: "JONGKONG KIRI HULU", status: "AKTIF", tercatat_kib: "Sudah", nilai_kib: 4000000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { site_id: "KLB00314", site_id_opsel: "ZZJ675", kecamatan: "SELIMBAU", desa: "MAWAN", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00632", site_id_opsel: "ZZJ680", kecamatan: "PENGKADAN", desa: "PINANG LAKA", status: "AKTIF", tercatat_kib: "Sudah", nilai_kib: 4000000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { site_id: "KLB00330", site_id_opsel: "ZZJ681", kecamatan: "BATANG LUPAR", desa: "LABIAN IRAANG", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00359", site_id_opsel: "ZZJ692", kecamatan: "KALIS", desa: "NANGA DANAU", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: 400, sertifikat: null, kawasan: "APL", keterangan: "Dokumen hibah di lakukan pada tahun 2026" },
  { site_id: "KLB00274", site_id_opsel: "ZZJ717", kecamatan: "BIKA", desa: "PENYELUANG", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00313", site_id_opsel: "ZZJ732", kecamatan: "SELIMBAU", desa: "SEKULAT", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { site_id: "KLB00364", site_id_opsel: "ZZJ761", kecamatan: "KALIS", desa: "SEGIAM", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00365", site_id_opsel: "ZZJ762", kecamatan: "KALIS", desa: "RIBANG KADENG", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { site_id: "KLB00301", site_id_opsel: "ZZJ726", kecamatan: "JONGKONG", desa: "NANGA SERIAN", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00386", site_id_opsel: "ZZJ704", kecamatan: "SUHAID", desa: "MANTAN", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00358", site_id_opsel: "ZZJ757", kecamatan: "KALIS", desa: "NANGA TUBUK", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00271", site_id_opsel: "ZZJ655", kecamatan: "PUTUSSIBAU UTARA", desa: "JANGKANG", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: 400, sertifikat: null, kawasan: "APL", keterangan: "Dokumen hibah di lakukan pada tahun 2026" },
  { site_id: "KLB00281", site_id_opsel: "ZZJ718", kecamatan: "EMBALOH HULU", desa: "PULAU MANAK", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00279", site_id_opsel: "ZZJ773", kecamatan: "EMBALOH HILIR", desa: "UJUNG BAYUR", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00286", site_id_opsel: "ZZJ664", kecamatan: "BUNUT HILIR", desa: "EMPANGAU HILIR", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00284", site_id_opsel: "ZZJ720", kecamatan: "EMBALOH HULU", desa: "TAMAO", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00354", site_id_opsel: "ZZJ756", kecamatan: "KALIS", desa: "NANGA SEBINTANG", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { site_id: "KLB00388", site_id_opsel: "ZZJ706", kecamatan: "SUHAID", desa: "JONGKONG HULU", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00383", site_id_opsel: "ZZJ772", kecamatan: "PENGKADAN", desa: "SASAN", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00382", site_id_opsel: "ZZJ771", kecamatan: "PENGKADAN", desa: "PERMATA", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00626", site_id_opsel: "ZZJ774", kecamatan: "SEBERUANG", desa: "GURUNG", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00389", site_id_opsel: "ZZJ707", kecamatan: "SUHAID", desa: "MENAPAR", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00361", site_id_opsel: "ZZJ758", kecamatan: "KALIS", desa: "RANTAU KALIS", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00298", site_id_opsel: "ZZJ775", kecamatan: "JONGKONG", desa: "UJUNG JAMBU", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00380", site_id_opsel: "ZZJ701", kecamatan: "PENGKADAN", desa: "KERANGAN PANJANG", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00312", site_id_opsel: "ZZJ731", kecamatan: "SELIMBAU", desa: "PIASAK HULU", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00367", site_id_opsel: "ZZJ764", kecamatan: "KALIS", desa: "PENIUNG", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00631", site_id_opsel: "ZZJ730", kecamatan: "BUNUT HILIR", desa: "TELUK AUR", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00303", site_id_opsel: "ZZJ671", kecamatan: "HULU GURUNG", desa: "KELAKAR", status: "AKTIF", tercatat_kib: "Sudah", nilai_kib: 3360000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { site_id: "KLB00629", site_id_opsel: "ZZJ721", kecamatan: "BUNUT HULU", desa: "BAKONG PERMAI", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
];

async function main() {
  const r2 = await post(data);
  if (r2.status === 201 || r2.status === 200) console.log(`✅ Batch 3: ${data.length} records seeded`);
  else console.log(`Batch 3 status ${r2.status}:`, r2.data.substring(0, 300));

  // Get final count
  const count = await getCount();
  console.log(`📊 Total records in DB: ${count.count}`);
  console.log('\n🎉 All 160 records seeded! Database ready.');
}

main().catch(console.error);
