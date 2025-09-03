# Panduan Instalasi Loan Management System

## 📋 Daftar Isi
1. [Persyaratan Sistem](#persyaratan-sistem)
2. [Instalasi Step-by-Step](#instalasi-step-by-step)
3. [Konfigurasi Database](#konfigurasi-database)
4. [Menjalankan Aplikasi](#menjalankan-aplikasi)
5. [Verifikasi Instalasi](#verifikasi-instalasi)
6. [Troubleshooting Instalasi](#troubleshooting-instalasi)

---

## 📋 Persyaratan Sistem

### Perangkat Lunak yang Dibutuhkan:
- **Node.js** (versi 16.0 atau lebih tinggi)
- **npm** (biasanya sudah termasuk dengan Node.js)
- **PostgreSQL** (versi 12 atau lebih tinggi)
- **Git** (untuk clone repository)
- **Browser** modern (Chrome, Firefox, Edge, Safari)

### Sistem Operasi yang Didukung:
- Windows 10/11
- macOS (10.15 atau lebih baru)
- Linux (Ubuntu 18.04+, CentOS 7+)

---

## 🚀 Instalasi Step-by-Step

### Langkah 1: Install Node.js
1. **Download Node.js:**
   - Kunjungi [nodejs.org](https://nodejs.org/)
   - Download versi LTS (Long Term Support)
   - Jalankan installer dan ikuti instruksi

2. **Verifikasi Instalasi:**
   ```bash
   node --version
   npm --version
   ```
   Harus menampilkan nomor versi Node.js dan npm

### Langkah 2: Install PostgreSQL
1. **Download PostgreSQL:**
   - Kunjungi [postgresql.org/download](https://www.postgresql.org/download/)
   - Pilih sesuai sistem operasi Anda
   - Jalankan installer

2. **Setup Database:**
   - Catat username dan password yang Anda buat
   - Default port adalah 5432
   - Buat database baru bernama `loan_db`

### Langkah 3: Clone Repository
```bash
git clone https://github.com/nug31/loan.git
cd loan
```

### Langkah 4: Install Dependencies

#### Install Dependencies Frontend:
```bash
npm install
```

#### Install Dependencies Backend:
```bash
cd backend
npm install
cd ..
```

### Langkah 5: Konfigurasi Environment
1. **Buat file `.env` di folder `backend`:**
   ```bash
   cd backend
   copy .env.example .env  # Windows
   # atau
   cp .env.example .env    # macOS/Linux
   ```

2. **Edit file `.env`:**
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/loan_db
   PORT=3002
   NODE_ENV=development
   ```
   
   Ganti `username`, `password`, dan `loan_db` sesuai dengan konfigurasi PostgreSQL Anda.

---

## 🗄️ Konfigurasi Database

### Opsi 1: Menggunakan PostgreSQL Lokal

1. **Buka PostgreSQL Command Line atau pgAdmin**

2. **Buat Database:**
   ```sql
   CREATE DATABASE loan_db;
   ```

3. **Buat User Baru (Opsional):**
   ```sql
   CREATE USER loan_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE loan_db TO loan_user;
   ```

### Opsi 2: Menggunakan Database Online
Jika Anda tidak ingin install PostgreSQL lokal, Anda bisa menggunakan:
- **ElephantSQL** (gratis untuk development)
- **Supabase** (gratis dengan limit)
- **Railway** (gratis dengan limit)

Ganti `DATABASE_URL` di file `.env` dengan connection string dari provider yang dipilih.

---

## ▶️ Menjalankan Aplikasi

### Langkah 1: Start Backend
```bash
cd backend
node server-pg.js
```

**Output yang diharapkan:**
```
🚀 Server running on port 3002
✅ Database connected successfully
📊 Database synced and seeded with sample data
```

### Langkah 2: Start Frontend (Terminal Baru)
```bash
npm run dev
```

**Output yang diharapkan:**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

### Langkah 3: Akses Aplikasi
Buka browser dan kunjungi `http://localhost:3000`

---

## ✅ Verifikasi Instalasi

### 1. Cek Backend API
Buka `http://localhost:3002/api/dashboard/stats` di browser.
Harus menampilkan data JSON dengan statistik.

### 2. Cek Frontend
- Halaman login harus tampil
- Tidak ada error di browser console (F12)
- Logo dan styling tampil dengan benar

### 3. Test Login
Gunakan akun default:
- **Admin**: `admin@example.com` / `admin123`
- **User**: `john.doe@example.com` / `user123`

### 4. Cek Database
Data sample harus ter-load:
- Items (barang-barang)
- Users (pengguna)
- Categories (kategori)

---

## 🛠️ Troubleshooting Instalasi

### Error: "Node.js not found"
**Solusi:**
- Install Node.js dari nodejs.org
- Restart terminal setelah instalasi
- Pastikan Node.js ada di PATH

### Error: "Cannot connect to database"
**Possible causes:**
1. **PostgreSQL tidak berjalan**
   ```bash
   # Windows (Administrator)
   net start postgresql-x64-13
   
   # macOS
   brew services start postgresql
   
   # Linux
   sudo systemctl start postgresql
   ```

2. **Database tidak ada**
   - Buat database `loan_db` secara manual
   - Atau ganti nama database di `.env`

3. **Credentials salah**
   - Cek username/password di `.env`
   - Test koneksi dengan psql atau pgAdmin

### Error: "Port 3000 already in use"
**Solusi:**
1. **Tutup aplikasi yang menggunakan port 3000**
2. **Atau ganti port:**
   ```bash
   npm run dev -- --port 3001
   ```

### Error: "Port 3002 already in use"
**Solusi:**
1. **Kill proses yang menggunakan port:**
   ```bash
   # Windows
   netstat -ano | findstr :3002
   taskkill /PID <PID_NUMBER> /F
   
   # macOS/Linux
   lsof -ti:3002 | xargs kill -9
   ```

2. **Atau ganti port di `.env`:**
   ```env
   PORT=3003
   ```

### Error: "Module not found"
**Solusi:**
1. **Hapus node_modules dan install ulang:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Install dependencies yang hilang:**
   ```bash
   npm install
   cd backend
   npm install
   ```

### Database Seeding Failed
**Solusi:**
1. **Drop dan buat ulang database:**
   ```sql
   DROP DATABASE loan_db;
   CREATE DATABASE loan_db;
   ```

2. **Restart backend server**

### Frontend Tidak Loading
**Checklist:**
- ✅ Backend server berjalan di port 3002
- ✅ Database terkoneksi
- ✅ Tidak ada error di terminal backend
- ✅ Browser console tidak ada error CORS

---

## 📱 Setup untuk Development

### Recommended VS Code Extensions:
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- Auto Rename Tag
- GitLens
- Thunder Client (untuk test API)

### Browser Developer Tools:
- React Developer Tools
- Redux DevTools (jika menggunakan Redux)

---

## 🔒 Setup Production (Opsional)

### Environment Variables untuk Production:
```env
NODE_ENV=production
DATABASE_URL=your_production_database_url
FRONTEND_URL=https://yourdomain.com
```

### Build Frontend:
```bash
npm run build
```

Files akan dibuat di folder `dist/` dan siap untuk deployment.

---

## 📞 Bantuan Lebih Lanjut

Jika masih mengalami masalah:

1. **Cek Issues di GitHub:** [github.com/nug31/loan/issues](https://github.com/nug31/loan/issues)
2. **Buat Issue Baru** dengan detail:
   - Sistem operasi
   - Versi Node.js dan npm
   - Error message lengkap
   - Screenshot jika diperlukan

---

**✨ Selamat! Aplikasi Loan Management System siap digunakan!**

*Panduan ini terakhir diperbarui: September 2024*
