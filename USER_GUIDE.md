# Panduan Penggunaan Aplikasi Loan Management System

## Daftar Isi
1. [Pengenalan Aplikasi](#pengenalan-aplikasi)
2. [Memulai Aplikasi](#memulai-aplikasi)
3. [Login dan Registrasi](#login-dan-registrasi)
4. [Dashboard Utama](#dashboard-utama)
5. [Panduan untuk User Biasa](#panduan-untuk-user-biasa)
6. [Panduan untuk Admin](#panduan-untuk-admin)
7. [Sistem Notifikasi](#sistem-notifikasi)
8. [Tips dan Troubleshooting](#tips-dan-troubleshooting)

---

## Pengenalan Aplikasi

Loan Management System adalah aplikasi berbasis web untuk mengelola sistem peminjaman barang. Aplikasi ini memiliki dua jenis pengguna:
- **User Biasa**: Dapat meminjam barang dan mengelola pinjaman mereka
- **Admin**: Dapat mengelola semua aspek sistem termasuk barang, pengguna, dan persetujuan pinjaman

---

## Memulai Aplikasi

### 1. Menjalankan Backend
Buka terminal/command prompt dan jalankan:
```bash
cd backend
node server-pg.js
```
Server akan berjalan di `http://localhost:3002`

### 2. Menjalankan Frontend
Buka terminal baru dan jalankan:
```bash
npm run dev
```
Aplikasi akan berjalan di `http://localhost:3000`

### 3. Akses Aplikasi
Buka browser dan kunjungi `http://localhost:3000`

---

## Login dan Registrasi

### Login
1. Klik tombol **"Login"** di halaman utama
2. Masukkan email dan password
3. Klik **"Sign In"**

**Akun Default:**
- **Admin**: 
  - Email: `admin@example.com`
  - Password: `admin123`
- **User**: 
  - Email: `john.doe@example.com`
  - Password: `user123`

### Registrasi User Baru
1. Klik **"Don't have an account? Sign Up"**
2. Isi form registrasi:
   - Full Name
   - Email
   - Password
   - Confirm Password
3. Klik **"Sign Up"**
4. Tunggu persetujuan admin untuk mengaktifkan akun

---

## Dashboard Utama

Setelah login, Anda akan melihat dashboard dengan:
- **Statistik Overview**: Total items, active loans, pending requests, users
- **Quick Actions**: Tombol akses cepat ke fitur utama
- **Recent Activity**: Aktivitas terbaru
- **Charts**: Grafik statistik penggunaan

---

## Panduan untuk User Biasa

### 1. Melihat Katalog Barang
1. Klik **"Catalog"** di sidebar
2. Browse barang yang tersedia
3. Gunakan **Search** untuk mencari barang tertentu
4. Filter berdasarkan kategori atau status

### 2. Membuat Permintaan Pinjaman
1. Dari halaman Catalog, klik **"Request Loan"** pada barang yang diinginkan
2. Isi form peminjaman:
   - **Return Date**: Tanggal pengembalian yang diinginkan
   - **Purpose**: Tujuan peminjaman
   - **Notes** (opsional): Catatan tambahan
3. Klik **"Submit Request"**
4. Tunggu persetujuan admin

### 3. Mengelola Pinjaman Anda
1. Klik **"My Loans"** di sidebar
2. Lihat status pinjaman:
   - **Pending**: Menunggu persetujuan
   - **Active**: Sedang dipinjam
   - **Returned**: Sudah dikembalikan
   - **Overdue**: Terlambat dikembalikan

### 4. Mengembalikan Barang
1. Di halaman **"My Loans"**, cari pinjaman yang ingin dikembalikan
2. Klik **"Return"** pada pinjaman yang berstatus Active
3. Konfirmasi pengembalian
4. Status akan berubah menjadi "Returned"

### 5. Melihat Notifikasi
1. Klik ikon **Bell (🔔)** di header
2. Lihat notifikasi seperti:
   - Pinjaman yang akan jatuh tempo
   - Pinjaman yang sudah terlambat
   - Update status permintaan

---

## Panduan untuk Admin

### 1. Mengelola Barang

#### Menambah Barang Baru
1. Klik **"Manage Items"** di sidebar
2. Klik **"Add New Item"**
3. Isi form:
   - **Name**: Nama barang
   - **Description**: Deskripsi barang
   - **Category**: Kategori barang
   - **Quantity**: Jumlah tersedia
   - **Condition**: Kondisi barang
   - **Tags**: Tag untuk pencarian
4. Klik **"Add Item"**

#### Edit/Hapus Barang
1. Di halaman **"Manage Items"**
2. Klik **"Edit"** untuk mengubah data barang
3. Klik **"Delete"** untuk menghapus barang (hati-hati!)

#### Import Barang dari CSV/Excel
1. Klik **"Import Items"**
2. Download template import
3. Isi template dengan data barang
4. Upload file dan klik **"Import"**

### 2. Mengelola Kategori
1. Klik **"Manage Categories"**
2. Klik **"Add Category"** untuk menambah kategori baru
3. Edit/hapus kategori yang sudah ada

### 3. Mengelola Pinjaman

#### Menyetujui Permintaan Pinjaman
1. Klik **"Manage Loans"** di sidebar
2. Lihat daftar pinjaman dengan status **"Pending"**
3. Review detail permintaan:
   - Peminjam
   - Barang yang diminta
   - Tanggal pengembalian
   - Tujuan peminjaman
4. Klik **"Approve"** untuk menyetujui atau **"Reject"** untuk menolak

#### Mengelola Pinjaman Aktif
1. Monitor pinjaman yang sedang berjalan
2. Lihat pinjaman yang mendekati jatuh tempo
3. Follow up pinjaman yang terlambat

### 4. Mengelola Pengguna
1. Klik **"Manage Users"** di sidebar
2. Lihat daftar semua pengguna
3. **Approve/Reject** registrasi pengguna baru
4. **Edit Role** pengguna (User/Admin)
5. **Delete** pengguna jika diperlukan

### 5. Melihat Laporan dan Analytics
1. Dashboard menampilkan overview statistik
2. **Export** data pinjaman ke Excel/PDF
3. Analisis tren penggunaan barang
4. Monitor aktivitas pengguna

---

## Sistem Notifikasi

### Jenis Notifikasi

#### Untuk User Biasa:
- **Pinjaman Approved**: Permintaan pinjaman disetujui
- **Pinjaman Rejected**: Permintaan pinjaman ditolak
- **Due Soon**: Pinjaman akan jatuh tempo dalam 2 hari
- **Overdue**: Pinjaman sudah terlambat

#### Untuk Admin:
- **New Request**: Ada permintaan pinjaman baru
- **Due Soon (All Users)**: Ada pinjaman yang akan jatuh tempo
- **Overdue (All Users)**: Ada pinjaman yang terlambat
- **New User Registration**: Ada pengguna baru yang mendaftar

### Mengelola Notifikasi
1. Klik ikon Bell (🔔) untuk melihat notifikasi
2. **Dismiss** notifikasi individual dengan klik tombol X
3. **Mark as Read** dengan klik pada notifikasi
4. **Clear All** untuk menghapus semua notifikasi

---

## Tips dan Troubleshooting

### Tips Penggunaan
1. **Periksa Notifikasi Secara Berkala**: Pastikan tidak ada pinjaman yang terlambat
2. **Gunakan Search dan Filter**: Memudahkan mencari barang di katalog
3. **Isi Purpose dengan Jelas**: Membantu admin dalam proses persetujuan
4. **Return Tepat Waktu**: Hindari status overdue yang dapat mempengaruhi reputasi

### Troubleshooting Umum

#### Tidak Bisa Login
- Pastikan email dan password benar
- Untuk user baru, pastikan akun sudah diapprove admin
- Coba refresh browser atau hapus cache

#### Tidak Bisa Submit Request
- Pastikan semua field wajib sudah diisi
- Cek koneksi internet
- Pastikan barang masih tersedia (quantity > 0)

#### Notifikasi Tidak Muncul
- Refresh halaman
- Pastikan Anda sudah login
- Cek apakah ada notifikasi baru di database

#### Error saat Upload File
- Pastikan format file sesuai (CSV/Excel untuk import)
- Cek ukuran file tidak terlalu besar
- Pastikan struktur file sesuai template

#### Pinjaman Tidak Bisa di-Return
- Pastikan pinjaman berstatus "Active"
- Refresh halaman dan coba lagi
- Hubungi admin jika masalah berlanjut

### Kontak Support
Jika mengalami masalah yang tidak dapat diselesaikan:
1. Buat issue di GitHub repository
2. Sertakan screenshot error jika ada
3. Jelaskan langkah yang sudah dilakukan

---

## Fitur Mobile
Aplikasi ini responsive dan dapat digunakan di perangkat mobile:
- **Bottom Navigation**: Navigasi mudah di mobile
- **Touch-friendly UI**: Interface yang optimal untuk sentuhan
- **Mobile Notifications**: Notifikasi yang mudah dibaca di layar kecil

---

## Keamanan
- **Session Management**: Otomatis logout setelah periode tidak aktif
- **Role-based Access**: Fitur terbatas sesuai dengan peran pengguna
- **Data Validation**: Input data divalidasi untuk keamanan
- **Secure Authentication**: Password di-hash untuk keamanan

---

*Terakhir diperbarui: September 2024*
