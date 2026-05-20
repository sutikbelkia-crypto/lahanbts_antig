# 🔧 Setup Supabase Database

Panduan langkah demi langkah untuk menghubungkan aplikasi ke Supabase.

## 1. Buat Project Supabase

1. Buka [supabase.com](https://supabase.com) dan login/daftar
2. Click "New Project"
3. Pilih Organization atau buat baru
4. Isi detail project:
   - **Name**: `bts-aset-lahan` (atau nama lain)
   - **Database Password**: Buat password yang kuat
   - **Region**: Pilih yang terdekat (Singapore/Tokyo untuk Indonesia)
5. Click "Create new project"
6. Tunggu ~2 menit sampai project ready

## 2. Dapatkan API Credentials

1. Di dashboard Supabase, buka **Settings** > **API**
2. Copy nilai berikut:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 3. Setup Database Schema

1. Buka **SQL Editor** di dashboard Supabase
2. Click "New query"
3. Copy-paste isi dari file `supabase-schema.sql`
4. Click "Run" untuk membuat tabel dan struktur database

## 4. Update Environment Variables

Edit file `.env.local` dengan credentials Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
```

## 5. Test Connection

Jalankan test koneksi:

```bash
cd bts-aset
npm install
npm run dev
```

Buka http://localhost:3000 - jika berhasil, aplikasi akan loading tanpa error.

## 6. Seed Database

Isi database dengan data awal (160 records):

```bash
npm run seed
```

## ⚠️ Troubleshooting

### Error: "Invalid API key"
- Pastikan API key di .env.local benar
- Restart development server setelah update .env.local

### Error: "relation sites does not exist"
- Jalankan SQL schema di Supabase SQL Editor
- Pastikan tabel `sites` sudah terbuat

### Error: "Failed to fetch"
- Check internet connection
- Verify Supabase project status
- Pastikan Project URL benar

---

**Setelah setup selesai, lanjut ke langkah berikutnya!**