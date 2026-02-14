# SILOKER - Setup Instructions

Panduan lengkap untuk setup dan menjalankan project Siloker.

## Prerequisites

- Node.js 18 atau lebih tinggi
- npm atau yarn
- Akun Supabase (gratis di https://supabase.com)
- Git (optional, untuk version control)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd /home/alchemista/projects/siloker

# Install npm packages
npm install
```

Harapkan 2-3 menit untuk selesai. Jika ada error, coba:
```bash
npm install --legacy-peer-deps
```

### 2. Create Supabase Project

1. Buka https://supabase.com
2. Sign Up / Log In dengan email atau GitHub
3. Klik "New Project"
4. Isi nama project: `siloker`
5. Pilih region terdekat (Indonesia = Singapore)
6. Setup password database
7. Tunggu hingga proyek selesai di-create (~5 menit)

### 3. Setup Database Tables

1. **Di Supabase dashboard**, klik project Anda
2. Buka menu **SQL Editor** (di sidebar kiri)
3. Klik **New Query**
4. Copy seluruh isi file `sql/schema.sql`
5. Paste ke SQL editor
6. Klik tombol **Execute** (atau Ctrl+Enter)
7. Tunggu hingga table berhasil dibuat

**Verifikasi:**
- Buka menu **Database** → **Tables**
- Anda seharusnya melihat: `jobs` dan `applications`

### 4. Seed Dummy Data

1. Di SQL Editor, buat **New Query**
2. Copy seluruh isi file `sql/seed.sql`
3. Paste ke SQL editor
4. Klik **Execute**
5. Verifikasi: Buka `jobs` table, seharusnya ada 3 data

**Dummy Data yang ditambah:**
- Senior Frontend Engineer (Jakarta)
- Full Stack Developer (Bandung)
- UI/UX Designer (Surabaya)

### 5. Get Supabase Credentials

1. Di Supabase dashboard, klik project Anda
2. Buka **Settings** → **API** (di sidebar)
3. Copy dua nilai ini:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Simpan nilai ini, akan digunakan di step berikutnya.

### 6. Create Environment File

1. Di root project, buat file `.env.local`:

```bash
# Dari terminal
touch .env.local
```

2. Buka file `.env.local` dengan text editor
3. Paste dan isi dengan nilai dari Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxxXXX
```

**Contoh lengkap (.env.local):**
```
# Supabase Config
NEXT_PUBLIC_SUPABASE_URL=https://qwertyuiopasdf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3ZXJ0eXVpb3Bhc2RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg5MDEyMzQsImV4cCI6MTY5NDQ1OTIzNH0.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

⚠️ **PENTING:**
- Jangan share `.env.local` ke public
- Sudah ada di `.gitignore` (aman untuk git)
- Keep credentials private

### 7. Run Development Server

```bash
npm run dev
```

Output seharusnya:
```
> siloker@0.1.0 dev
> next dev

▲ Next.js 16.1.6
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 2.3s
```

### 8. Open in Browser

Buka di browser Anda:
- **Landing Page:** http://localhost:3000
- **Jobs List:** http://localhost:3000/jobs
- **Admin Panel:** http://localhost:3000/admin

Seharusnya bisa lihat 3 dummy jobs yang sudah di-seed.

---

## Testing the Features

### Test Landing Page
1. Buka http://localhost:3000
2. Scroll down, lihat "Featured Jobs" dengan 6 job cards
3. Klik "Lihat Semua Lowongan" untuk pergi ke jobs list

### Test Search Bar
1. Di landing page, ketik "Frontend" di search bar
2. Klik "Cari"
3. Redirect ke `/jobs?search=Frontend`
4. Harusnya hanya tampil "Senior Frontend Engineer"

### Test Jobs List Page
1. Buka http://localhost:3000/jobs
2. Lihat jobs dalam format grid/cards
3. Test search dan location filter
4. Test pagination dengan tombol "Berikutnya"

### Test Job Detail & Apply
1. Click pada salah satu job card
2. Lihat detail lengkap job (title, company, salary, description)
3. Scroll ke "Kirim Aplikasi" form
4. Isi form: name, email, phone
5. Klik "Kirim Aplikasi"
6. Harusnya muncul success message
7. Verify di Supabase: SQL Editor → `SELECT * FROM applications;`

### Test Admin Panel
1. Buka http://localhost:3000/admin
2. Klik "+ Tambah Lowongan"
3. Isi form dengan data job baru
4. Klik "Tambah Lowongan"
5. Harusnya job baru muncul di tabel di bawah
6. Test delete dengan klik "Hapus" pada salah satu job
7. Confirm deletion

---

## Common Issues & Solutions

### ❌ npm install gagal
**Solusi:**
```bash
# Clear npm cache
npm cache clean --force

# Try again dengan legacy flag
npm install --legacy-peer-deps
```

### ❌ Error: "Missing Supabase environment variables"
**Penyebab:** `.env.local` belum dibuat atau nilai kosong

**Solusi:**
1. Buat `.env.local` jika belum ada
2. Copy isi dari `sql/schema.sql`
3. Verify values tidak empty
4. Restart dev server: Ctrl+C, lalu `npm run dev`

### ❌ "Connection error" saat load jobs
**Penyebab:** Supabase credentials salah atau database tidak ready

**Solusi:**
1. Double-check SUPABASE_URL dan ANON_KEY di .env.local
2. Verify di Supabase dashboard Settings → API
3. Pastikan table `jobs` sudah dibuat (check di Database → Tables)
4. Check browser console untuk error detail

### ❌ Jobs tidak muncul di landing page
**Penyebab:** Dummy data belum di-seed

**Solusi:**
1. Buka Supabase SQL Editor
2. Paste isi `sql/seed.sql`
3. Execute
4. Refresh browser

### ❌ Port 3000 sudah terpakai
**Solusi:**
```bash
# Run di port berbeda
npm run dev -- -p 3001
# Buka http://localhost:3001
```

### ❌ Tombol delete tidak bekerja
**Penyebab:** RLS policies belum aktif

**Solusi:**
1. Di Supabase, buka SQL Editor
2. Verifikasi bahwa `sql/schema.sql` sudah dijalankan sepenuhnya
3. Check Table Settings → RLS enabled

---

## Project Commands

```bash
# Development
npm run dev                 # Start dev server (port 3000)

# Production
npm run build              # Build for production
npm start                  # Run production build

# Code Quality
npm run lint               # Run ESLint
npm run lint -- --fix      # Fix linting issues
```

---

## Folder Structure

```
siloker/
├── app/
│   ├── api/               # API routes
│   ├── components/        # Reusable components
│   ├── jobs/              # Jobs pages
│   ├── admin/             # Admin page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── lib/
│   └── supabaseClient.ts  # Supabase setup
├── sql/
│   ├── schema.sql         # Database schema
│   └── seed.sql           # Dummy data
├── public/                # Static files
├── .env.local            # Environment variables (create yourself)
├── .env.local.example    # Template for .env.local
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md             # Project info
```

---

## Next Steps

### Development
1. Customize colors/styling di `app/globals.css`
2. Add more jobs di admin panel atau SQL
3. Modify job descriptions
4. Change company information

### Deployment
1. Push ke GitHub repository
2. Connect ke Vercel (https://vercel.com)
3. Add environment variables di Vercel settings
4. Deploy dengan satu klik

### Features untuk Masa Depan
- User authentication
- Email notifications
- CV upload storage
- Job seeker profiles
- Advanced filtering
- Saved jobs / bookmarks

---

## Support & Help

### Documentation Files
- `README-SETUP.md` - Setup guide (this file)
- `PROJECT-SUMMARY.md` - Project overview & architecture
- `sql/schema.sql` - Database documentation
- `sql/seed.sql` - Example data

### Resources
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs

---

## Tips untuk Success

✅ **DO:**
- Backup database values sebelum delete
- Test semua features di local sebelum deploy
- Keep `.env.local` aman (jangan push ke repo)
- Refresh page jika ada perubahan CSS
- Check browser console untuk error messages

❌ **DON'T:**
- Publish `.env.local` ke GitHub
- Share Supabase credentials
- Delete database tables tanpa backup
- Modify RLS policies tanpa understanding
- Keep dev server running saat tidur

---

**Setup Time:** 15-20 menit  
**Status:** Ready to Deploy  
**Last Updated:** February 14, 2026
