# Siloker - Portal Lowongan Kerja Demo

Siloker adalah demo web portal kerja berbasis Next.js yang digunakan untuk pitching. Platform ini memungkinkan Anda untuk melihat lowongan kerja, melamar posisi, dan mengelola lowongan melalui panel admin.


## Deploy ke Vercel

1. Klik "New Project" di dashboard Vercel dan pilih repo ini.
2. Pada step konfigurasi, tambahkan environment variable berikut:
   - `NEXT_PUBLIC_SUPABASE_URL` (dari project Supabase Anda)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (dari project Supabase Anda)
3. Deploy!

Contoh .env bisa dilihat di `.env.example`.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## Fitur Utama

### 1. Landing Page (/)
- Hero section dengan CTA
- Search bar untuk mencari lowongan
- Featured Jobs (6 lowongan terbaru)
- Call-to-action untuk admin panel

### 2. Halaman List Lowongan (/jobs)
- Fetch data dari Supabase
- Search berdasarkan title (case-insensitive)
- Filter berdasarkan lokasi
- Pagination (6 per page)
- Server-side rendering untuk performa optimal

### 3. Detail Lowongan (/jobs/[slug])
- Dynamic routing berdasarkan slug
- Tampilkan detail lengkap lowongan
- Form untuk melamar pekerjaan
- SEO metadata yang optimal

### 4. Form Apply
- Form dengan field: Nama, Email, Phone
- Insert aplikasi ke database Supabase
- Success message setelah submit
- Validasi input di client dan server

### 5. Admin Panel (/admin)
- Tanpa sistem login (demo only)
- Form untuk tambah lowongan baru
- List semua lowongan
- Tombol delete per lowongan
- Manage menggunakan Supabase client

## Database Schema

### Table: jobs
```sql
- id (uuid, primary key)
- title (text) - Judul posisi
- slug (text, unique) - URL-friendly identifier
- company (text) - Nama perusahaan
- location (text) - Lokasi kerja
- salary_min (integer) - Gaji minimum
- salary_max (integer) - Gaji maksimum
- description (text) - Deskripsi detail
- created_at (timestamp) - Waktu pembuatan
```

### Table: applications
```sql
- id (uuid, primary key)
- job_id (uuid, foreign key) - Reference ke jobs
- name (text) - Nama pelamar
- email (text) - Email pelamar
- phone (text) - No telepon pelamar
- created_at (timestamp) - Waktu aplikasi
```

## Setup Project

### 1. Prerequisites
- Node.js 18+
- npm atau yarn
- Akun Supabase (gratis di https://supabase.com)

### 2. Clone & Install Dependencies

```bash
# Install dependencies
npm install
```

### 3. Setup Supabase Database

1. **Buat project di Supabase:**
   - Buka https://supabase.com
   - Signup dan buat project baru
   - Tunggu project selesai di-create

2. **Jalankan SQL schema:**
   - Buka SQL Editor di Supabase dashboard
   - Copy isi dari `sql/schema.sql`
   - Paste di SQL editor dan execute
   - Copy isi dari `sql/seed.sql`
   - Paste dan execute untuk seed data dummy

3. **Enable RLS (Row Level Security):**
   - Schema sudah mencakup RLS policies
   - Tidak perlu konfigurasi tambahan

### 4. Setup Environment Variables

1. **Copy template env:**
```bash
cp .env.local.example .env.local
```

2. **Isi environment variables:**
   - Buka Supabase dashboard
   - Pergi ke Settings → API
   - Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Paste ke `.env.local`

**Contoh `.env.local`:**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...xxxxx
```

### 5. Run Development Server

```bash
npm run dev
```

Akses di http://localhost:3000

## Structure Folder

```
siloker/
├── app/
│   ├── api/
│   │   ├── jobs/
│   │   │   ├── route.ts          // GET jobs, POST create job
│   │   │   └── [id]/route.ts     // DELETE job
│   │   └── applications/
│   │       └── route.ts          // POST submit application
│   ├── components/
│   │   ├── JobCard.tsx           // Job card component
│   │   └── ApplyForm.tsx         // Application form component
│   ├── jobs/
│   │   ├── page.tsx              // Jobs list page
│   │   └── [slug]/page.tsx       // Job detail page
│   ├── admin/
│   │   └── page.tsx              // Admin dashboard
│   ├── layout.tsx                // Root layout dengan navigation
│   ├── page.tsx                  // Landing page
│   └── globals.css               // Global styles
├── lib/
│   └── supabaseClient.ts         // Supabase client setup
├── sql/
│   ├── schema.sql                // Database schema
│   └── seed.sql                  // Dummy data
├── .env.local.example            // Environment variables template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## Dummy Data

Sudah ada 3 lowongan dummy di `sql/seed.sql`:
1. Senior Frontend Engineer - Jakarta - Rp 15-25jt
2. Full Stack Developer (Node.js) - Bandung - Rp 12-20jt
3. UI/UX Designer - Surabaya - Rp 8-15jt

Untuk menambah data lebih banyak, gunakan Admin Panel atau SQL INSERT langsung.

## API Routes

### GET /api/jobs
Fetch lowongan dengan search, filter, dan pagination

**Query Parameters:**
- `search` - Cari berdasarkan title (case-insensitive)
- `location` - Filter berdasarkan lokasi
- `page` - Nomor halaman (default: 1)
- `limit` - Jumlah item per halaman (default: 6)

**Example:**
```
GET /api/jobs?search=frontend&location=jakarta&page=1&limit=6
```

### POST /api/jobs
Buat lowongan baru

**Body:**
```json
{
  "title": "Frontend Engineer",
  "slug": "frontend-engineer",
  "company": "Tech Company",
  "location": "Jakarta",
  "salary_min": 10000000,
  "salary_max": 15000000,
  "description": "Job description..."
}
```

### DELETE /api/jobs/[id]
Hapus lowongan berdasarkan ID

**Example:**
```
DELETE /api/jobs/550e8400-e29b-41d4-a716-446655440000
```

### POST /api/applications
Submit aplikasi untuk lowongan

**Body:**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+62812345678"
}
```

## Deploy ke Vercel

### 1. Push ke GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/siloker.git
git push -u origin main
```

### 2. Deploy ke Vercel
1. Buka https://vercel.com
2. Klik "Import Project"
3. Pilih repository GitHub
4. Tambah environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Klik Deploy

## Tips & Tricks

### Menambah Lowongan via Admin Panel
1. Buka http://localhost:3000/admin
2. Klik "Tambah Lowongan"
3. Isi form dan klik "Tambah Lowongan"
4. Data otomatis tersimpan di Supabase

### Menambah Lowongan via SQL
```sql
INSERT INTO jobs (title, slug, company, location, salary_min, salary_max, description) VALUES
('Backend Engineer', 'backend-engineer', 'Startup ABC', 'Jakarta', 15000000, 22000000, 'Deskripsi...'),
('Product Manager', 'product-manager', 'Startup ABC', 'Jakarta', 18000000, 28000000, 'Deskripsi...');
```

### Testing Aplikasi
1. Buka job detail page
2. Isi form aplikasi
3. Submit
4. Cek aplikasi di SQL editor: `SELECT * FROM applications;`

### Customize
- **Colors**: Ubah Tailwind class di components
- **Content**: Edit text di pages dan components
- **Fonts**: Modify font di `app/layout.tsx`
- **Locations**: Update array di `app/jobs/page.tsx`

## Troubleshooting

### Error: Missing Supabase environment variables
**Solution:** Pastikan `.env.local` sudah dibuat dengan isi yang benar

### Error: Connection failed to Supabase
**Solution:** Cek apakah SUPABASE_URL dan SUPABASE_ANON_KEY benar

### Jobs tidak muncul di landing page
**Solution:** Jalankan seed.sql di Supabase SQL editor untuk tambah dummy data

### Form tidak submit
**Solution:** Buka browser console dan cek error message

## Production Checklist

- [ ] Setup database backups di Supabase
- [ ] Enable RLS policies (sudah otomatis)
- [ ] Setup rate limiting untuk API
- [ ] Add logging untuk monitoring
- [ ] Setup email notifications (optional)
- [ ] Add analytics (optional)
- [ ] Test di berbagai browser
- [ ] Setup CI/CD pipeline
- [ ] Add monitoring & error tracking

## Future Improvements

- [ ] Sistem authentication
- [ ] Email notifications
- [ ] CV upload storage
- [ ] Job seeker profile
- [ ] Company profile
- [ ] Interview scheduling
- [ ] Rating & review
- [ ] Advanced search filters

## Support

Untuk masalah atau pertanyaan, silakan buat issue di repository atau hubungi team development.

---

**Last Updated:** February 14, 2026
**Version:** 1.0 Demo
