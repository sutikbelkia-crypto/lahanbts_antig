# 🚀 Panduan Setup Lengkap: Supabase + GitHub + Vercel

Panduan step-by-step untuk menghubungkan aplikasi BTS Asset Management ke Supabase, GitHub, dan deploy ke Vercel.

## 📋 Prerequisites

- Akun GitHub (gratis)
- Akun Supabase (gratis)
- Akun Vercel (gratis)
- Git sudah terinstall
- Node.js 18+ sudah terinstall

---

## 🗄️ STEP 1: Setup Supabase Database

### 1.1 Buat Project Supabase

1. **Buka [supabase.com](https://supabase.com)** dan login/daftar
2. **Click "New Project"**
3. **Isi form:**
   - Name: `bts-aset-lahan`
   - Database Password: Buat password kuat (simpan!)
   - Region: `Southeast Asia (Singapore)`
4. **Click "Create new project"**
5. **Tunggu ~2 menit** sampai project ready

### 1.2 Setup Database Schema

1. **Buka SQL Editor** di dashboard Supabase
2. **Click "New query"**
3. **Copy seluruh isi file `supabase-schema.sql`** dan paste
4. **Click "Run"** - pastikan tidak ada error

### 1.3 Dapatkan API Keys

1. **Buka Settings > API**
2. **Copy 3 nilai ini:**
   ```
   Project URL: https://xxxxx.supabase.co
   anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 1.4 Update Environment Variables

**Edit file `.env.local`:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
```

### 1.5 Test & Seed Database

```bash
# Test koneksi
npm run test-connection

# Isi database dengan 160 records
npm run seed

# Test aplikasi
npm run dev
```

**✅ Supabase Setup Complete!**

---

## 📁 STEP 2: Setup GitHub Repository

### 2.1 Buat Repository di GitHub

1. **Buka [github.com](https://github.com)** dan login
2. **Click "New repository"**
3. **Isi form:**
   - Repository name: `bts-aset-lahan`
   - Description: `BTS Asset Management System with Next.js and Supabase`
   - Visibility: Public (atau Private sesuai kebutuhan)
   - **JANGAN** centang "Add a README file" (sudah ada)
4. **Click "Create repository"**

### 2.2 Connect Local Repository

**Copy commands dari GitHub dan jalankan:**

```bash
# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/bts-aset-lahan.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Ganti `YOUR_USERNAME` dengan username GitHub Anda.**

### 2.3 Verify Upload

1. **Refresh halaman GitHub repository**
2. **Pastikan semua files sudah terupload**
3. **Check README.md tampil dengan baik**

**✅ GitHub Setup Complete!**

---

## 🚀 STEP 3: Deploy ke Vercel

### 3.1 Connect GitHub ke Vercel

1. **Buka [vercel.com](https://vercel.com)** dan login dengan GitHub
2. **Click "New Project"**
3. **Import repository `bts-aset-lahan`**
4. **Configure Project:**
   - Framework Preset: `Next.js`
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

### 3.2 Set Environment Variables

**Di Vercel dashboard, tambahkan environment variables:**

1. **Click "Environment Variables"**
2. **Add 3 variables:**
   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://your-project-id.supabase.co
   
   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: your_anon_key_here
   
   Name: SUPABASE_SERVICE_ROLE_KEY
   Value: your_service_role_key_here
   ```

### 3.3 Deploy

1. **Click "Deploy"**
2. **Tunggu ~2-3 menit** untuk build process
3. **Jika berhasil**, Anda akan dapat URL production

### 3.4 Test Production

1. **Buka URL production** (contoh: `https://bts-aset-lahan.vercel.app`)
2. **Test semua fitur:**
   - Data loading
   - CRUD operations
   - Analytics dashboard
   - Responsive design

**✅ Vercel Deployment Complete!**

---

## 🔄 STEP 4: Setup Continuous Deployment

### 4.1 Auto-Deploy dari GitHub

**Vercel sudah otomatis setup CI/CD:**
- ✅ Push ke `main` branch = auto deploy production
- ✅ Push ke branch lain = preview deployment
- ✅ Pull request = preview deployment

### 4.2 Test Auto-Deploy

```bash
# Buat perubahan kecil
echo "# BTS Asset Management" > test.md
git add test.md
git commit -m "Test auto-deployment"
git push origin main
```

**Check Vercel dashboard** - deployment baru akan muncul otomatis.

---

## 📊 STEP 5: Verifikasi Setup Lengkap

### ✅ Checklist Final

- [ ] **Supabase**: Database terhubung, 160 records tersimpan
- [ ] **GitHub**: Repository public/private, semua files terupload
- [ ] **Vercel**: Production URL aktif, environment variables set
- [ ] **Local Development**: `npm run dev` berjalan tanpa error
- [ ] **Production**: Semua fitur berfungsi di URL production

### 🧪 Test Scenarios

1. **Local Development:**
   ```bash
   npm run dev
   # Buka http://localhost:3000
   # Test CRUD operations
   ```

2. **Production:**
   ```
   # Buka URL Vercel Anda
   # Test semua fitur sama seperti local
   ```

3. **Database:**
   ```sql
   -- Di Supabase SQL Editor
   SELECT COUNT(*) FROM sites; -- Harus return 160
   SELECT status, COUNT(*) FROM sites GROUP BY status;
   ```

---

## 🎯 URLs Penting

Setelah setup selesai, simpan URLs ini:

```
🗄️  Supabase Dashboard: https://supabase.com/dashboard/project/YOUR_PROJECT_ID
📁 GitHub Repository: https://github.com/YOUR_USERNAME/bts-aset-lahan
🚀 Production URL: https://bts-aset-lahan.vercel.app (atau custom domain)
📊 Vercel Dashboard: https://vercel.com/YOUR_USERNAME/bts-aset-lahan
```

---

## 🔧 Maintenance & Updates

### Update Code

```bash
# Local development
git add .
git commit -m "Update: description of changes"
git push origin main
# Auto-deploy ke production via Vercel
```

### Database Changes

1. **Update schema** di Supabase SQL Editor
2. **Update types** di `src/types/index.ts`
3. **Update API routes** jika perlu
4. **Test locally** lalu push ke GitHub

### Environment Variables

- **Local**: Update `.env.local`
- **Production**: Update di Vercel dashboard > Settings > Environment Variables

---

## 🎉 Setup Complete!

**Selamat! Aplikasi BTS Asset Management Anda sudah:**

✅ **Connected to Supabase** - Database PostgreSQL dengan 160 records BTS
✅ **Hosted on GitHub** - Version control dan collaboration ready  
✅ **Deployed on Vercel** - Production-ready dengan auto-deployment
✅ **Fully Functional** - CRUD operations, analytics, responsive design

**Next Steps:**
1. Share production URL dengan tim
2. Customize branding dan styling
3. Add more features sesuai kebutuhan
4. Setup custom domain (optional)

---

**Need Help?** 
- Check troubleshooting di `README.md`
- Run `npm run test-connection` untuk debug database
- Check Vercel deployment logs untuk production issues