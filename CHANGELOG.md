# Changelog - BTS Asset Management

## [Update] 23 Mei 2026 - Sinkronisasi Data Antar Tab

### 🔧 Perbaikan
- **Fix: Data tidak sinkron antar tab**
  - Sebelumnya: Data yang diinput/edit di tab "Kelola Data" tidak langsung muncul di tab "Data Aset"
  - Sekarang: Semua perubahan data (tambah/edit/hapus) langsung tersinkronisasi ke semua tab

### 📝 Perubahan Teknis
1. **AppShell.tsx**
   - Menambahkan `refreshKey` state untuk trigger refresh global
   - Menambahkan `triggerRefresh()` function yang di-share ke semua komponen
   - Menggunakan `key` prop untuk force re-render komponen saat data berubah

2. **DataPage.tsx**
   - Menambahkan `onDataChange` prop untuk callback ke parent
   - Memanggil `onDataChange()` setelah berhasil edit data
   - Data langsung refresh di semua tab

3. **EditPage.tsx**
   - Menambahkan `onDataChange` prop untuk callback ke parent
   - Memanggil `onDataChange()` setelah berhasil tambah/edit/hapus data
   - Perubahan langsung terlihat di tab "Data Aset"

### ✅ Hasil
- ✅ Tambah data di "Kelola Data" → Langsung muncul di "Data Aset"
- ✅ Edit data di "Kelola Data" → Langsung update di "Data Aset"
- ✅ Edit data di "Data Aset" → Langsung update di "Kelola Data"
- ✅ Hapus data di "Kelola Data" → Langsung hilang di "Data Aset"
- ✅ Statistik dashboard otomatis update

### 🚀 Deployment
- Commit: `d8cd2cf`
- GitHub: Pushed to main branch
- Vercel: Auto-deployment triggered
- Production URL: https://lahanbts-kiro.vercel.app

---

## [Initial Release] - Setup Awal

### ✅ Fitur Utama
- CRUD operations untuk data BTS
- Dashboard analytics dengan statistik real-time
- Filter & pencarian data
- Export ke CSV
- Responsive design
- Integrasi Supabase PostgreSQL
- Auto-deployment via Vercel

### 🔗 Koneksi
- Database: Supabase PostgreSQL
- Repository: GitHub
- Hosting: Vercel
- Data persistence: Fixed dengan service role key
