# Panduan Export Data User MySQL ke CSV

## 📋 Langkah-langkah Export

### 1. Persiapan Kredensial MySQL

Berdasarkan screenshot yang Anda tunjukkan, Anda memiliki database MySQL dengan tabel `users`. Untuk mengekspor data, perlu mengatur kredensial di file `.env`:

**Edit file: `C:\Users\nugro\Downloads\LOAN\.env`**

Tambahkan atau ubah bagian MySQL configuration:

```env
# MySQL Database Configuration
MYSQL_HOST=your_mysql_host_here
MYSQL_PORT=3306
MYSQL_USER=your_mysql_username
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=your_database_name
```

### 2. Contoh Konfigurasi untuk Platform Cloud

**Untuk Railway MySQL:**
```env
MYSQL_HOST=containers-us-west-123.railway.app
MYSQL_PORT=6789
MYSQL_USER=root
MYSQL_PASSWORD=your_railway_password
MYSQL_DATABASE=railway
```

**Untuk PlanetScale:**
```env
MYSQL_HOST=aws.connect.psdb.cloud
MYSQL_PORT=3306
MYSQL_USER=your_username
MYSQL_PASSWORD=your_planetscale_password
MYSQL_DATABASE=your_database_name
```

### 3. Menjalankan Export

Buka terminal di folder `backend`:

```bash
cd C:\Users\nugro\Downloads\LOAN\backend
```

**Test koneksi MySQL:**
```bash
node export-mysql-users.js test
```

**Export data ke CSV:**
```bash
node export-mysql-users.js export users_from_mysql.csv
```

### 4. Format Output CSV

File CSV yang dihasilkan akan memiliki format:

```csv
id,name,email,password,phone,department,role,isActive,createdAt
d86f6549-7d55-430b-a3a0-35500ac3fe40,Fitri Yani,fitriyani240909@gmail.com,$2b$10$...,,,user,true,2024-01-15T10:30:00.000Z
d9991491-2be7-40c4-9759-4a67ea6305b3,Eka Yuliana Sari,ekayuliana@smkind-mm2100.sch.id,$2b$10$...,,,user,true,2024-01-15T11:45:00.000Z
```

### 5. Mengimport ke PostgreSQL

Setelah file CSV dibuat, Anda dapat mengimportnya ke aplikasi LOAN (PostgreSQL):

```bash
node import-users-csv.js import users_from_mysql.csv
```

## 🔧 Troubleshooting

### Error: ECONNREFUSED
- Periksa apakah MySQL server berjalan
- Verifikasi host dan port
- Periksa firewall settings

### Error: ER_ACCESS_DENIED_ERROR  
- Periksa username dan password
- Verifikasi permission user

### Error: ER_BAD_DB_ERROR
- Periksa nama database
- Pastikan database sudah dibuat

## 📝 Catatan Penting

1. **Password Hash**: Script akan mempertahankan hash password yang sudah ada (bcrypt)
2. **Default Values**: Field yang kosong akan diisi dengan nilai default
3. **Backup**: Selalu backup database sebelum melakukan import/export
4. **Security**: Jangan commit file `.env` yang berisi password asli

## 🚀 Quick Start (Recommended)

**Metode Manual (Terbaru):**

1. Buka Railway Dashboard dan dapatkan kredensial MySQL terbaru
2. Jalankan script interaktif:
   ```bash
   cd C:\Users\nugro\Downloads\LOAN\backend
   node export-mysql-manual.js
   ```
3. Masukkan kredensial saat diminta
4. File CSV akan dibuat secara otomatis

**Metode Environment Variable:**

1. Edit file `.env` dengan kredensial yang benar
2. Jalankan: `node export-mysql-users.js test`
3. Jika sukses, jalankan: `node export-mysql-users.js export`
4. File CSV akan tersimpan di folder backend

## 📞 Bantuan

Jika mengalami kendala, pastikan:
- [ ] Kredensial MySQL sudah benar di file `.env`
- [ ] Koneksi internet stabil (jika MySQL di cloud)
- [ ] Package `mysql2` sudah terinstall
- [ ] Tabel `users` ada di database MySQL
