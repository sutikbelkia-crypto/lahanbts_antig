# BTS Asset Management System

Sistem manajemen aset lahan BTS (Base Transceiver Station) yang dibangun dengan Next.js 14, Supabase, dan Tailwind CSS.

**Status**: ✅ **FULLY INTEGRATED & PRODUCTION READY**

## 🎯 Fitur Utama

### ✅ Data Management
- **Dashboard Data**: Tampilan tabel dengan filtering, sorting, dan pagination
- **CRUD Operations**: Create, Read, Update, Delete data site BTS
- **Real-time Sync**: Perubahan data langsung terlihat di semua tab
- **Data Persistence**: Semua data tersimpan permanen di Supabase PostgreSQL

### ✅ Analytics & Reporting
- **Analisis Data**: Grafik dan statistik untuk analisis aset
- **Real-time Charts**: Chart otomatis update saat ada perubahan data
- **KPI Dashboard**: Statistik real-time dengan 8 metrik utama
- **Export CSV**: Export data untuk analisis lebih lanjut

### ✅ User Experience
- **Responsive Design**: Optimized untuk desktop dan mobile
- **Modern UI**: Tailwind CSS dengan komponen yang clean
- **Seamless Integration**: Semua tab terintegrasi dengan sinkronisasi otomatis
- **No Manual Refresh**: Perubahan langsung terlihat tanpa perlu refresh browser

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: Tailwind CSS
- **Charts**: Chart.js + React Chart.js 2
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- npm atau yarn
- Akun Supabase (gratis)
- Git

## 🔧 Setup & Installation

### 1. Clone Repository

```bash
git clone https://github.com/sutikbelkia-crypto/lahanbts_kiro.git
cd bts-aset
```

### 2. Install Dependencies

```bash
npm install
# atau
yarn install
```

### 3. Setup Supabase

1. Buat project baru di [Supabase](https://supabase.com)
2. Jalankan SQL schema di Supabase SQL Editor:

```sql
-- Copy paste isi dari supabase-schema.sql
```

3. Dapatkan API keys dari Settings > API

### 4. Environment Variables

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 5. Seed Database

Jalankan script untuk mengisi data awal (160 records):

```bash
# Install tsx untuk menjalankan TypeScript
npm install -g tsx

# Jalankan seed script
npx tsx scripts/seed.ts
```

### 6. Run Development Server

```bash
npm run dev
# atau
yarn dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📁 Struktur Project

```
bts-aset/
├── src/
│   ├── app/                 # App Router (Next.js 14)
│   │   ├── api/            # API Routes
│   │   │   ├── sites/      # CRUD endpoints
│   │   │   └── stats/      # Statistics endpoint
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React Components
│   │   ├── AppShell.tsx    # Main layout + refresh orchestration
│   │   ├── DataPage.tsx    # Data table page
│   │   ├── EditPage.tsx    # Edit form page
│   │   ├── AnalisisPage.tsx # Analytics page
│   │   ├── StatsBar.tsx    # Statistics component (NEW)
│   │   └── ...
│   ├── lib/               # Utilities
│   │   ├── supabase/      # Supabase clients
│   │   └── utils.ts       # Helper functions
│   └── types/             # TypeScript types
├── scripts/
│   └── seed.ts            # Database seeding script
├── supabase-schema.sql    # Database schema
├── FINAL_SUMMARY.md       # Final summary & documentation
├── INTEGRATION_COMPLETE.md # Integration documentation
├── DATA_SYNC_GUIDE.md     # Data sync guide
└── ...
```

## 🗄️ Database Schema

Tabel utama: `sites`

| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Primary key |
| site_id | VARCHAR(50) | Kode unik site BTS |
| site_id_opsel | VARCHAR(50) | Kode operator seluler |
| kecamatan | VARCHAR(100) | Nama kecamatan |
| desa | VARCHAR(100) | Nama desa |
| status | VARCHAR(20) | AKTIF / Terminasi 2025 |
| tercatat_kib | VARCHAR(10) | Sudah / Belum / - |
| nilai_kib | BIGINT | Nilai KIB dalam Rupiah |
| luas | INTEGER | Luas lahan (m²) |
| sertifikat | VARCHAR(100) | Status sertifikat |
| kawasan | VARCHAR(20) | APL / Hutan / - |
| keterangan | TEXT | Keterangan tambahan |

## 🔄 Data Synchronization

### Alur Sinkronisasi

```
User Edit Data di "Kelola Data"
    ↓
Save ke API (/api/sites)
    ↓
Trigger onDataChange() callback
    ↓
AppShell: setRefreshKey(prev => prev + 1)
    ↓
Semua komponen di-remount dengan key baru
    ↓
DataPage: Fetch data terbaru + StatsBar refresh
EditPage: Fetch data terbaru
AnalisisPage: Fetch data terbaru + chart update
    ↓
✅ Semua tab menampilkan data terbaru
```

### Fitur Sinkronisasi

- ✅ **Data Aset ↔ Kelola Data**: Perubahan langsung terlihat di kedua tab
- ✅ **Data Aset ↔ Analisis**: Chart dan statistik update otomatis
- ✅ **Kelola Data ↔ Analisis**: Perubahan data langsung update chart
- ✅ **StatsBar ↔ Kelola Data**: Statistik refresh saat ada perubahan
- ✅ **Real-time**: Tidak perlu refresh browser

## 🚀 Deployment

### Deploy ke Vercel

1. Push code ke GitHub
2. Connect repository di [Vercel](https://vercel.com)
3. Set environment variables di Vercel dashboard
4. Deploy!

### Environment Variables untuk Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Production URL

🚀 **Live**: https://lahanbts-kiro.vercel.app

## 📊 API Endpoints

### Sites API

- `GET /api/sites` - Get all sites with filtering & pagination
- `POST /api/sites` - Create new site
- `GET /api/sites/[id]` - Get site by ID
- `PATCH /api/sites/[id]` - Update site
- `DELETE /api/sites/[id]` - Delete site

### Stats API

- `GET /api/stats` - Get statistics summary

### Query Parameters (GET /api/sites)

- `page` - Page number (default: 1)
- `perPage` - Items per page (default: 25)
- `search` - Search term
- `status` - Filter by status
- `kib` - Filter by KIB status
- `kawasan` - Filter by kawasan
- `kecamatan` - Filter by kecamatan
- `sortCol` - Sort column (default: id)
- `sortDir` - Sort direction: asc/desc (default: asc)

## 🎨 Customization

### Menambah Field Baru

1. Update database schema di Supabase
2. Update TypeScript types di `src/types/index.ts`
3. Update API routes di `src/app/api/sites/`
4. Update components untuk menampilkan field baru

### Mengubah Styling

- Edit `src/app/globals.css` untuk global styles
- Modify Tailwind classes di components
- Update `tailwind.config.ts` untuk custom theme

## 🐛 Troubleshooting

### Database Connection Error
- Pastikan environment variables sudah benar
- Check Supabase project status
- Verify API keys masih valid

### Build Error
- Run `npm run lint` untuk check linting issues
- Pastikan semua dependencies ter-install
- Check TypeScript errors dengan `npx tsc --noEmit`

### Seed Script Error
- Pastikan `SUPABASE_SERVICE_ROLE_KEY` sudah diset
- Check apakah tabel `sites` sudah dibuat
- Verify database schema sudah dijalankan

### Data tidak sinkron antar tab?
- Refresh browser (F5)
- Check console untuk error messages
- Verify API endpoints berfungsi dengan baik

## 📚 Documentation

- **[FINAL_SUMMARY.md](./FINAL_SUMMARY.md)** - Ringkasan lengkap & test scenarios
- **[INTEGRATION_COMPLETE.md](./INTEGRATION_COMPLETE.md)** - Dokumentasi integrasi
- **[DATA_SYNC_GUIDE.md](./DATA_SYNC_GUIDE.md)** - Panduan sinkronisasi data
- **[FULL_SETUP_GUIDE.md](./FULL_SETUP_GUIDE.md)** - Setup awal Supabase, GitHub, Vercel

## 📝 License

MIT License - feel free to use this project for your needs.

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

Jika ada pertanyaan atau issue, silakan buat GitHub issue atau hubungi developer.

---

**Status**: ✅ **PRODUCTION READY**  
**Last Updated**: 23 Mei 2026  
**Version**: 1.2.1  
**Repository**: https://github.com/sutikbelkia-crypto/lahanbts_kiro.git  
**Live URL**: https://lahanbts-kiro.vercel.app

**Happy Coding! 🚀**