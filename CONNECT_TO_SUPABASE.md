# 🔗 Menghubungkan ke Supabase Database

Panduan lengkap untuk menghubungkan aplikasi BTS Asset Management ke database Supabase Anda.

## 🎯 Langkah-Langkah Setup

### 1. Persiapan Supabase Project

1. **Buka [supabase.com](https://supabase.com)**
   - Login atau daftar akun baru (gratis)

2. **Buat Project Baru**
   - Click "New Project"
   - Pilih Organization (atau buat baru)
   - Isi form:
     - **Name**: `bts-aset-lahan` (atau nama pilihan Anda)
     - **Database Password**: Buat password yang kuat (simpan baik-baik!)
     - **Region**: Pilih `Southeast Asia (Singapore)` untuk performa terbaik di Indonesia
   - Click "Create new project"
   - Tunggu ~2-3 menit sampai project ready

### 2. Dapatkan API Credentials

1. **Di dashboard Supabase, buka Settings > API**
2. **Copy 3 nilai penting:**
   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
   service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
   ```

### 3. Setup Database Schema

1. **Buka SQL Editor di dashboard Supabase**
2. **Click "New query"**
3. **Copy seluruh isi file `supabase-schema.sql`** dan paste ke editor
4. **Click "Run"** untuk membuat tabel dan struktur database
5. **Pastikan tidak ada error** - Anda akan melihat pesan sukses

### 4. Update Environment Variables

1. **Edit file `.env.local`** di root project:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
   ```

2. **Ganti dengan nilai sebenarnya** dari dashboard Supabase Anda

### 5. Install Dependencies & Test

```bash
# Install dependencies
npm install

# Test koneksi database
npm run test-connection

# Jika berhasil, isi database dengan data awal
npm run seed

# Jalankan aplikasi
npm run dev
```

## 🚀 Script Otomatis

Untuk kemudahan, gunakan script setup otomatis:

```bash
npm run setup
```

Script ini akan:
- ✅ Check environment variables
- ✅ Test koneksi ke Supabase
- ✅ Verify database schema
- ✅ Seed data jika database kosong
- ✅ Memberikan panduan next steps

## 🔍 Verifikasi Setup

### 1. Test Koneksi
```bash
npm run test-connection
```

**Output yang diharapkan:**
```
🔍 Testing Supabase connection...

📋 Environment Variables Check:
✅ NEXT_PUBLIC_SUPABASE_URL: ✓ Set
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ✓ Set
✅ SUPABASE_SERVICE_ROLE_KEY: ✓ Set

🔌 Testing basic connection...
✅ Connection successful! Found 0 records in sites table

🎉 All tests passed! Database connection is ready.
```

### 2. Seed Database
```bash
npm run seed
```

**Output yang diharapkan:**
```
🚀 Memulai migrasi data ke Supabase...
🗑️  Menghapus data lama...
📝 Inserting batch 1/2 (100 records)...
✅ Inserted 100 records
📝 Inserting batch 2/2 (60 records)...
✅ Inserted 60 records
🎉 Migrasi selesai! Total 160 records berhasil diinsert ke Supabase.
✅ Verifikasi: Total 160 records di database
```

### 3. Run Application
```bash
npm run dev
```

Buka http://localhost:3000 - Anda akan melihat aplikasi dengan data BTS yang sudah terisi.

## ❌ Troubleshooting

### Error: "Invalid API key"
**Penyebab:** API key salah atau tidak diset
**Solusi:**
1. Cek kembali API key di Supabase Dashboard > Settings > API
2. Pastikan tidak ada spasi atau karakter tambahan
3. Restart development server: `Ctrl+C` lalu `npm run dev`

### Error: "relation sites does not exist"
**Penyebab:** Database schema belum dijalankan
**Solusi:**
1. Buka Supabase Dashboard > SQL Editor
2. Copy-paste isi file `supabase-schema.sql`
3. Click "Run"
4. Coba lagi: `npm run test-connection`

### Error: "Failed to fetch"
**Penyebab:** Masalah koneksi atau project Supabase tidak aktif
**Solusi:**
1. Check koneksi internet
2. Verify project status di dashboard Supabase
3. Pastikan Project URL benar (harus https://)

### Error: "CORS policy"
**Penyebab:** Domain tidak diizinkan (jarang terjadi di development)
**Solusi:**
1. Buka Supabase Dashboard > Authentication > Settings
2. Tambahkan `http://localhost:3000` ke Site URL

### Database Connection Timeout
**Penyebab:** Region terlalu jauh atau koneksi lambat
**Solusi:**
1. Pilih region yang lebih dekat (Singapore untuk Indonesia)
2. Atau tunggu beberapa saat dan coba lagi

## 🔒 Security Notes

1. **Jangan commit .env.local** ke Git (sudah ada di .gitignore)
2. **Service Role Key** hanya untuk server-side operations
3. **Anon Key** aman untuk client-side, tapi tetap jangan expose di public
4. **Database Password** simpan dengan aman

## 📊 Verifikasi Data

Setelah setup berhasil, cek di Supabase Dashboard:

1. **Table Editor > sites**
   - Harus ada 160 records
   - Kolom: id, site_id, site_id_opsel, kecamatan, desa, status, dll.

2. **SQL Editor** - Test query:
   ```sql
   SELECT COUNT(*) FROM sites;
   SELECT status, COUNT(*) FROM sites GROUP BY status;
   ```

## 🎉 Setup Selesai!

Jika semua langkah berhasil:
- ✅ Database terhubung
- ✅ 160 records BTS tersimpan
- ✅ Aplikasi berjalan di http://localhost:3000
- ✅ Siap untuk production deployment

**Next Steps:**
1. Explore aplikasi di browser
2. Test CRUD operations (tambah, edit, hapus data)
3. Lihat analytics dashboard
4. Deploy ke Vercel untuk production

---

**Need Help?** Jika masih ada masalah, jalankan `npm run test-connection` dan lihat error message untuk troubleshooting lebih lanjut.