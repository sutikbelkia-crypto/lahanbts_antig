# 🚀 Deployment Guide - BTS Asset Management

Panduan lengkap untuk deploy aplikasi BTS Asset Management ke production.

## 📋 Pre-Deployment Checklist

- [ ] Supabase project sudah dibuat dan configured
- [ ] Database schema sudah dijalankan
- [ ] Data sudah di-seed (160 records)
- [ ] Environment variables sudah diset
- [ ] Aplikasi berjalan dengan baik di local

## 🌐 Deploy ke Vercel (Recommended)

### 1. Persiapan Repository

```bash
# Push ke GitHub (jika belum)
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com) dan login
2. Click "New Project"
3. Import repository dari GitHub
4. Set Framework Preset: **Next.js**
5. Set Root Directory: `bts-aset` (jika dalam subfolder)

### 3. Environment Variables

Di Vercel dashboard, tambahkan environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Deploy

Click "Deploy" dan tunggu proses selesai (~2-3 menit).

## 🐳 Deploy ke Docker (Alternative)

### 1. Buat Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### 2. Build & Run

```bash
docker build -t bts-aset .
docker run -p 3000:3000 --env-file .env.local bts-aset
```

## ☁️ Deploy ke Netlify

### 1. Build Settings

- Build command: `npm run build`
- Publish directory: `.next`
- Node version: `18`

### 2. Environment Variables

Sama seperti Vercel, set di Netlify dashboard.

## 🔧 Post-Deployment

### 1. Verifikasi Deployment

- [ ] Website dapat diakses
- [ ] Data loading dengan benar
- [ ] CRUD operations berfungsi
- [ ] Charts dan analytics tampil
- [ ] Responsive design OK

### 2. Performance Check

```bash
# Lighthouse audit
npx lighthouse https://your-app.vercel.app --view

# Core Web Vitals
# Check di Google PageSpeed Insights
```

### 3. Monitoring

- Setup error tracking (Sentry, LogRocket)
- Monitor database usage di Supabase
- Check Vercel analytics

## 🔒 Security Checklist

- [ ] Environment variables tidak ter-expose
- [ ] Supabase RLS policies configured
- [ ] HTTPS enabled (automatic di Vercel)
- [ ] API rate limiting (jika diperlukan)

## 🚨 Troubleshooting

### Build Errors

```bash
# Check TypeScript errors
npx tsc --noEmit

# Check linting
npm run lint

# Clear cache
rm -rf .next node_modules
npm install
```

### Runtime Errors

1. Check Vercel function logs
2. Verify environment variables
3. Test Supabase connection
4. Check browser console

### Database Issues

1. Verify Supabase project status
2. Check API keys validity
3. Test database connection
4. Review RLS policies

## 📊 Performance Optimization

### 1. Next.js Optimizations

```javascript
// next.config.ts
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    domains: ['your-supabase-project.supabase.co'],
  },
  compress: true,
}
```

### 2. Database Optimizations

- Add database indexes untuk query yang sering
- Implement pagination untuk large datasets
- Use Supabase Edge Functions untuk complex operations

### 3. Caching Strategy

```javascript
// API routes caching
export const revalidate = 60; // ISR every 60 seconds
```

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📈 Scaling Considerations

### Database Scaling

- Monitor Supabase usage
- Consider upgrading plan jika diperlukan
- Implement connection pooling

### Application Scaling

- Use Vercel Edge Functions untuk global performance
- Implement CDN untuk static assets
- Consider database read replicas

## 🎯 Production Best Practices

1. **Environment Management**
   - Separate staging dan production environments
   - Use different Supabase projects

2. **Monitoring**
   - Setup uptime monitoring
   - Track error rates
   - Monitor performance metrics

3. **Backup Strategy**
   - Regular database backups
   - Code repository backups
   - Environment variables backup

4. **Security**
   - Regular security audits
   - Keep dependencies updated
   - Monitor for vulnerabilities

---

**Deployment Success! 🎉**

Aplikasi BTS Asset Management siap digunakan di production!