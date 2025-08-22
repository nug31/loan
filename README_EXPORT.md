# 🚀 Export Data User MySQL ke CSV - Quick Guide

## ✅ Yang Sudah Disiapkan
- ✅ Script export MySQL ke CSV
- ✅ Script import CSV ke PostgreSQL  
- ✅ Tools interaktif untuk kredensial dinamis
- ✅ Package dependencies sudah terinstall

## 🎯 Langkah Cepat Export

### 1. Buka Terminal di Folder Backend
```bash
cd C:\Users\nugro\Downloads\LOAN\backend
```

### 2. Jalankan Script Export Interaktif
```bash
node export-mysql-manual.js
```

### 3. Masukkan Kredensial Railway MySQL
Script akan meminta:
- **MySQL Host**: `nozomi.proxy.rlwy.net` (dari screenshot Anda)
- **MySQL Port**: `21817` (dari screenshot Anda)  
- **MySQL User**: `root`
- **MySQL Password**: `[password terbaru dari Railway]`
- **Database Name**: `railway`
- **Output filename**: tekan Enter untuk auto-generate

### 4. Dapatkan Kredensial Terbaru
1. Buka Railway Dashboard
2. Pilih MySQL service Anda
3. Klik tab "Connect"
4. Salin password terbaru (yang berbeda dari screenshot karena Railway sering rotate credentials)

## 📊 Hasil Export
- File CSV akan dibuat dengan format: `mysql_users_export_2025-08-22.csv`
- Berisi semua data user: id, name, email, password (hashed), dll
- Siap untuk import ke aplikasi LOAN PostgreSQL

## 🔄 Import ke PostgreSQL (Langkah Selanjutnya)
Setelah export berhasil:
```bash
node import-users-csv.js import mysql_users_export_2025-08-22.csv
```

## 🔧 Troubleshooting

### Jika Error "Access Denied"
- Kredensial Railway sudah berubah (normal)
- Dapatkan kredensial terbaru dari Railway Dashboard

### Jika Error "Connection Refused"
- Periksa koneksi internet
- Pastikan Railway MySQL service aktif

### Jika Error "Table Not Found"
- Verifikasi nama database benar
- Periksa apakah tabel `users` ada di database

## 📁 File yang Tersedia
- `export-mysql-manual.js` - Script interaktif (RECOMMENDED)
- `export-mysql-users.js` - Script dengan .env file
- `export-mysql-railway.js` - Script dengan hardcoded URL
- `import-users-csv.js` - Script import ke PostgreSQL

## 💡 Tips
- Gunakan `export-mysql-manual.js` karena kredensial Railway sering berubah
- Backup data sebelum import
- File CSV aman untuk dibuka di Excel/Google Sheets untuk preview
