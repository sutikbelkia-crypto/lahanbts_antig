const https = require('https');
const SUPABASE_URL = 'https://ntrmulwmwwtxkujdvmap.supabase.co';
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

const data = [
  { site_id: "KLB00327", site_id_opsel: "ZZJ740", kecamatan: "BATANG LUPAR", desa: "SUNGAI AJUNG", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00328", site_id_opsel: "ZZJ741", kecamatan: "BATANG LUPAR", desa: "SUNGAI ABAU", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00332", site_id_opsel: "ZZJ742", kecamatan: "EMPANANG", desa: "TINTIN PENINJAU", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00333", site_id_opsel: "ZZJ683", kecamatan: "EMPANANG", desa: "KUMANG JAYA", status: "AKTIF", tercatat_kib: "Sudah", nilai_kib: 4800000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { site_id: "KLB00345", site_id_opsel: "ZZJ686", kecamatan: "SILAT HULU", desa: "NANGA LUNGU", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00349", site_id_opsel: "ZZJ688", kecamatan: "SILAT HULU", desa: "LANDAU RANTAU", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00352", site_id_opsel: "ZZJ754", kecamatan: "PUTUSSIBAU SELATAN", desa: "SUKA MAJU", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: 400, sertifikat: null, kawasan: "APL", keterangan: "Dokumen hibah di lakukan pada tahun 2026" },
  { site_id: "KLB00355", site_id_opsel: "ZZJ690", kecamatan: "KALIS", desa: "NANGA LEBANGAN", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00356", site_id_opsel: "ZZJ691", kecamatan: "KALIS", desa: "NANGA RAUN", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { site_id: "KLB00362", site_id_opsel: "ZZJ759", kecamatan: "KALIS", desa: "TEKUDAK", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00273", site_id_opsel: "ZZJ657", kecamatan: "BIKA", desa: "MELAPI MANDAY", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00283", site_id_opsel: "ZZJ662", kecamatan: "EMBALOH HULU", desa: "LANGAN BARU", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00285", site_id_opsel: "ZZJ663", kecamatan: "BUNUT HILIR", desa: "EMPANGAU", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00299", site_id_opsel: "ZZJ669", kecamatan: "JONGKONG", desa: "BONTAI", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00300", site_id_opsel: "ZZJ670", kecamatan: "JONGKONG", desa: "KARYA BARU", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00309", site_id_opsel: "ZZJ674", kecamatan: "SELIMBAU", desa: "GERAYAU", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00308", site_id_opsel: "ZZJ729", kecamatan: "SELIMBAU", desa: "PIASAK HILIR", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00276", site_id_opsel: "ZZJ659", kecamatan: "EMBALOH HILIR", desa: "LAWIK", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00366", site_id_opsel: "ZZJ763", kecamatan: "KALIS", desa: "RANTAU BUMBUN", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { site_id: "KLB00375", site_id_opsel: "ZZJ767", kecamatan: "BOYAN TANJUNG", desa: "TELUK GERUGUK", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00378", site_id_opsel: "ZZJ700", kecamatan: "MENTEBAH", desa: "KEPALA GURUNG", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { site_id: "KLB00387", site_id_opsel: "ZZJ705", kecamatan: "SUHAID", desa: "LAUT TAWANG", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { site_id: "KLB00393", site_id_opsel: "ZZJ711", kecamatan: "PURING KENCANA", desa: "KANTUK BUNUT", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00630", site_id_opsel: "ZZJ723", kecamatan: "BUNUT HULU", desa: "PANTAS BERSATU", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { site_id: "KLB00633", site_id_opsel: "ZZJ765", kecamatan: "EMBALOH HILIR", desa: "PALA PINTAS", status: "AKTIF", tercatat_kib: "Sudah", nilai_kib: 4800000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { site_id: "KLB00638", site_id_opsel: "ZZJ710", kecamatan: "PURING KENCANA", desa: "SUNGAI MAWANG", status: "AKTIF", tercatat_kib: "Sudah", nilai_kib: 4000000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { site_id: "KLB00698", site_id_opsel: "ZZJ750", kecamatan: "SILAT HULU", desa: "SELANGKAI", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { site_id: "KLB00700", site_id_opsel: "ZZJ747", kecamatan: "EMPANANG", desa: "BAJAU ANDAI", status: "AKTIF", tercatat_kib: "Sudah", nilai_kib: 4800000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { site_id: "KLB00628", site_id_opsel: "ZZJ654", kecamatan: "PENGKADAN", desa: "HULU PENGKADAN", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { site_id: "KLB00384", site_id_opsel: "ZZJ702", kecamatan: "SUHAID", desa: "MENSUSAI", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00275", site_id_opsel: "ZZJ658", kecamatan: "BIKA", desa: "JONGKONG MANDAY", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: 400, sertifikat: null, kawasan: "APL", keterangan: "Dokumen hibah di lakukan pada tahun 2026" },
  { site_id: "KLB00317", site_id_opsel: "ZZJ735", kecamatan: "SEMITAU", desa: "NANGA SEBERUANG", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00291", site_id_opsel: "ZZJ595", kecamatan: "BUNUT HULU", desa: "BATU TIGA", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { site_id: "KLB00331", site_id_opsel: "ZZJ682", kecamatan: "EMPANANG", desa: "KELING PANGGAU", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00343", site_id_opsel: "ZZJ599", kecamatan: "SILAT HULU", desa: "BELIMBING", status: "AKTIF", tercatat_kib: "Sudah", nilai_kib: 4000000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { site_id: "KLB00282", site_id_opsel: "ZZJ719", kecamatan: "EMBALOH HULU", desa: "SAUJUNG GILING MANIK", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00319", site_id_opsel: "ZZJ677", kecamatan: "SEMITAU", desa: "KENEPAI KOMPLEK", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00353", site_id_opsel: "ZZJ755", kecamatan: "PUTUSSIBAU SELATAN", desa: "TANJUNG LOKANG", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { site_id: "KLB00363", site_id_opsel: "ZZJ760", kecamatan: "KALIS", desa: "TAPANG DAAN", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "Hutan", keterangan: "Dokumen Hibah belum di sampaikan / Kawasan Hutan" },
  { site_id: "KLB00394", site_id_opsel: "ZZJ712", kecamatan: "PURING KENCANA", desa: "LANGAU", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00391", site_id_opsel: "ZZJ709", kecamatan: "PURING KENCANA", desa: "MERAKAI PANJANG", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00695", site_id_opsel: "ZZJ697", kecamatan: "BOYAN TANJUNG", desa: "TUBANG JAYA", status: "AKTIF", tercatat_kib: "Sudah", nilai_kib: 3360000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { site_id: "KLB00374", site_id_opsel: "ZZJ698", kecamatan: "BOYAN TANJUNG", desa: "LANDAU MENTAIL", status: "AKTIF", tercatat_kib: "Sudah", nilai_kib: 3360000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { site_id: "KLB00334", site_id_opsel: "ZZJ743", kecamatan: "BADAU", desa: "SERIANG", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00266", site_id_opsel: "ZZJ593", kecamatan: "PUTUSSIBAU UTARA", desa: "BENUA TENGAH", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00293", site_id_opsel: "ZZJ724", kecamatan: "BUNUT HULU", desa: "SEGITAK", status: "AKTIF", tercatat_kib: "Sudah", nilai_kib: 5600000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
  { site_id: "KLB00372", site_id_opsel: "ZZJ696", kecamatan: "BOYAN TANJUNG", desa: "NANGA BOYAN", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00268", site_id_opsel: "ZZJ715", kecamatan: "PUTUSSIBAU UTARA", desa: "SELUAN", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00297", site_id_opsel: "ZZJ725", kecamatan: "JONGKONG", desa: "TEMENANG", status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null, luas: null, sertifikat: null, kawasan: "APL", keterangan: "Dokumen Hibah belum di sampaikan" },
  { site_id: "KLB00682", site_id_opsel: "ZZJ744", kecamatan: "BATANG LUPAR", desa: "MENSIAU", status: "AKTIF", tercatat_kib: "Sudah", nilai_kib: 4000000, luas: 400, sertifikat: "Belum bersertifikat", kawasan: "APL", keterangan: "" },
];

post(data).then(r => {
  if (r.status === 201 || r.status === 200) console.log(`✅ Batch 2: ${data.length} records seeded`);
  else console.log(`Status ${r.status}:`, r.data.substring(0, 200));
}).catch(console.error);
