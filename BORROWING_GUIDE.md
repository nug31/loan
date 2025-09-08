# 📋 Panduan Lengkap Peminjaman Barang

**Untuk User yang Ingin Meminjam Barang**

## 🎯 Daftar Isi
1. [Sebelum Meminjam](#sebelum-meminjam)
2. [Langkah-Langkah Peminjaman](#langkah-langkah-peminjaman)
3. [Tips Agar Request Disetujui](#tips-agar-request-disetujui)
4. [Status Pinjaman](#status-pinjaman)
5. [Mengelola Pinjaman Aktif](#mengelola-pinjaman-aktif)
6. [Proses Pengembalian](#proses-pengembalian)
7. [FAQ Peminjaman](#faq-peminjaman)

---

## 📝 Sebelum Meminjam

### ✅ Checklist Sebelum Request
- [ ] Akun Anda sudah aktif (disetujui admin)
- [ ] Sudah login ke aplikasi
- [ ] Tahu barang apa yang ingin dipinjam
- [ ] Tahu tanggal pengembalian yang realistis
- [ ] Sudah siap menjelaskan tujuan peminjaman

### 🔍 Cek Ketersediaan Barang
1. **Masuk ke halaman Catalog**
   - Klik **"Catalog"** di menu samping
   - Atau klik **"Browse Items"** di dashboard

2. **Cari barang yang diinginkan**
   - Gunakan **Search Box** di atas
   - Filter berdasarkan **Category**
   - Lihat status **"Available"** (tersedia)

3. **Cek detail barang**
   - **Quantity Available**: Harus lebih dari 0
   - **Condition**: Good/Fair/Excellent
   - **Description**: Baca spesifikasi lengkap

---

## 📋 Langkah-Langkah Peminjaman

### Step 1: Masuk ke Aplikasi
```
1. Buka browser → http://localhost:3000
2. Klik "Login"
3. Masukkan email dan password Anda
4. Klik "Sign In"
```

### Step 2: Cari Barang di Catalog
```
1. Klik "Catalog" di sidebar
2. Browse atau search barang yang diinginkan
3. Lihat barang dengan status "Available"
```

### Step 3: Request Peminjaman
```
1. Klik tombol "Request Loan" pada barang pilihan
2. Form peminjaman akan muncul
```

### Step 4: Isi Form Peminjaman
**Form yang harus diisi:**

#### 📅 **Return Date (Tanggal Pengembalian)**
- **Pilih tanggal yang realistis**
- **Jangan terlalu lama** (max 30 hari biasanya)
- **Pertimbangkan weekend dan hari libur**
- **Contoh**: Jika pinjam Senin untuk presentasi Jumat, bisa return Senin minggu depan

#### 🎯 **Purpose (Tujuan Peminjaman)**
**Tulis dengan jelas dan spesifik:**
- ✅ **BAIK**: "Presentasi proyek akhir mata kuliah Database tanggal 15 Januari"
- ✅ **BAIK**: "Workshop fotografi untuk mahasiswa semester 3"
- ✅ **BAIK**: "Rapat koordinasi tim pengembangan aplikasi mobile"
- ❌ **BURUK**: "Buat kerja"
- ❌ **BURUK**: "Butuh aja"
- ❌ **BURUK**: "Pinjam sebentar"

#### 📝 **Notes (Catatan - Opsional)**
**Tambahan informasi yang membantu:**
- Lokasi penggunaan
- Jumlah orang yang akan menggunakan
- Detail acara/kegiatan
- Contact person jika diperlukan

**Contoh Notes yang baik:**
```
"Akan digunakan di ruang seminar lantai 3 gedung A. 
Acara dimulai jam 09:00-12:00. 
Contact: 0812-3456-7890 (John)"
```

### Step 5: Submit Request
```
1. Review semua informasi yang diisi
2. Pastikan tanggal dan tujuan sudah benar
3. Klik "Submit Request"
4. Akan muncul konfirmasi "Request submitted successfully"
```

### Step 6: Tunggu Persetujuan
- Status awal akan menjadi **"Pending"**
- Admin akan review request Anda
- Anda akan mendapat **notifikasi** saat ada update

---

## ✨ Tips Agar Request Disetujui

### 🎯 **Tujuan Peminjaman yang Jelas**
```
✅ DO:
- Jelaskan untuk apa barang akan digunakan
- Sebutkan tanggal/waktu spesifik jika ada acara
- Tulis konteks yang jelas (presentasi, workshop, rapat, dll)

❌ DON'T:
- Menulis tujuan yang terlalu umum
- Tidak menjelaskan konteks penggunaan
- Menulis alasan yang tidak jelas
```

### 📅 **Tanggal Pengembalian Realistis**
```
✅ DO:
- Hitung kebutuhan waktu dengan benar
- Tambah buffer 1-2 hari untuk antisipasi
- Pertimbangkan jadwal Anda sendiri
- Cek calendar untuk menghindari bentrok

❌ DON'T:
- Meminjam terlalu lama tanpa alasan jelas
- Pilih tanggal yang terlalu dekat
- Lupa pertimbangkan weekend
```

### 📋 **Track Record yang Baik**
```
✅ DO:
- Selalu return tepat waktu
- Kembalikan barang dalam kondisi baik
- Komunikasi jika ada kendala

❌ DON'T:
- Sering terlambat return
- Merusak barang yang dipinjam
- Tidak komunikasi jika ada masalah
```

### 📱 **Follow Up yang Baik**
```
✅ DO:
- Cek notifikasi secara berkala
- Respond dengan cepat jika diminta info tambahan
- Konfirmasi penerimaan barang

❌ DON'T:
- Ignore notifikasi dari admin
- Tidak respond komunikasi
- Asumsi request pasti disetujui
```

---

## 📊 Status Pinjaman

### 🔄 **Status yang Mungkin Muncul:**

#### 🟡 **PENDING** 
- **Artinya**: Menunggu persetujuan admin
- **Yang harus dilakukan**: Tunggu, cek notifikasi berkala
- **Estimasi waktu**: 1-3 hari kerja

#### ✅ **APPROVED**
- **Artinya**: Request disetujui, barang bisa diambil
- **Yang harus dilakukan**: Koordinasi dengan admin untuk pengambilan
- **Status berubah ke**: ACTIVE setelah barang diambil

#### ❌ **REJECTED**
- **Artinya**: Request ditolak
- **Alasan umum**: 
  - Barang tidak tersedia
  - Tujuan tidak jelas
  - Tanggal pengembalian tidak realistis
  - Track record buruk
- **Yang harus dilakukan**: Baca alasan penolakan, bisa request ulang

#### 🟢 **ACTIVE**
- **Artinya**: Sedang meminjam barang
- **Yang harus dilakukan**: Gunakan dengan baik, siapkan untuk return

#### 🔵 **RETURNED**
- **Artinya**: Sudah dikembalikan
- **Status final**: Pinjaman selesai

#### 🔴 **OVERDUE**
- **Artinya**: Terlambat mengembalikan
- **Dampak**: Bisa mempengaruhi approval request selanjutnya
- **Yang harus dilakukan**: Segera return dan komunikasi dengan admin

---

## 💼 Mengelola Pinjaman Aktif

### 📱 Cek Status Pinjaman
```
1. Login ke aplikasi
2. Klik "My Loans" di sidebar
3. Lihat semua pinjaman Anda:
   - Pending (menunggu approval)
   - Active (sedang dipinjam)
   - History (yang sudah selesai)
```

### 🔔 Monitor Notifikasi
**Jenis notifikasi yang akan Anda terima:**
- ✅ Request approved/rejected
- ⚠️ Pinjaman akan jatuh tempo (2 hari sebelum)
- 🔴 Pinjaman sudah overdue
- 📝 Request informasi tambahan dari admin

### 📞 Komunikasi dengan Admin
**Jika perlu perpanjangan:**
```
1. Hubungi admin SEBELUM tanggal jatuh tempo
2. Jelaskan alasan perpanjangan
3. Usulkan tanggal pengembalian baru
4. Tunggu persetujuan admin
```

---

## 🔄 Proses Pengembalian

### Step 1: Persiapan Return
```
✅ Checklist sebelum return:
- [ ] Barang dalam kondisi baik
- [ ] Semua aksesoris lengkap
- [ ] Bersihkan barang jika perlu
- [ ] Cek tidak ada kerusakan
```

### Step 2: Return di Aplikasi
```
1. Buka "My Loans"
2. Cari pinjaman dengan status "Active"
3. Klik tombol "Return" 
4. Konfirmasi pengembalian
5. Status akan berubah menjadi "Returned"
```

### Step 3: Return Fisik Barang
- **Koordinasi dengan admin** untuk penyerahan barang
- **Serahkan barang** sesuai kondisi awal
- **Minta konfirmasi** dari admin bahwa barang sudah diterima

---

## ❓ FAQ Peminjaman

### Q: Berapa lama bisa meminjam barang?
**A:** Tergantung kebijakan, biasanya maksimal 30 hari. Admin akan pertimbangkan berdasarkan jenis barang dan kebutuhan.

### Q: Bisa minjam beberapa barang sekaligus?
**A:** Ya, bisa. Tapi harus request satu per satu untuk setiap barang.

### Q: Bagaimana jika barang rusak saat dipinjam?
**A:** 
1. Segera hubungi admin
2. Laporkan jenis kerusakan
3. Jangan coba perbaiki sendiri
4. Mungkin ada biaya penggantian

### Q: Request ditolak, bisa request lagi?
**A:** Ya, bisa. Baca alasan penolakan, perbaiki request, dan submit ulang.

### Q: Lupa password, bagaimana?
**A:** Hubungi admin untuk reset password (fitur reset password belum tersedia di aplikasi).

### Q: Barang yang dicari tidak ada di catalog?
**A:** Hubungi admin untuk request penambahan barang baru ke inventory.

### Q: Bisa perpanjang masa pinjam?
**A:** Hubungi admin sebelum tanggal jatuh tempo. Perpanjangan subject to approval.

### Q: Notifikasi tidak muncul?
**A:** 
1. Refresh halaman
2. Cek apakah masih login
3. Cek ikon bell di header

### Q: Tidak bisa submit request?
**A:**
1. Pastikan semua field required sudah diisi
2. Cek koneksi internet
3. Pastikan barang masih available
4. Coba refresh dan ulangi

---

## 📱 Mobile Usage Tips

### Menggunakan di HP
- Aplikasi sudah **responsive** untuk mobile
- **Bottom navigation** untuk navigasi mudah
- **Touch-friendly** buttons dan forms
- **Notification** mudah dibaca di layar kecil

### Best Practices Mobile
- Gunakan **landscape mode** untuk form yang panjang
- **Zoom** jika perlu untuk detail barang
- **Screenshot** konfirmasi request untuk backup
- **Save** nomor kontak admin di HP

---

## 🎯 Checklist Peminjaman Sukses

### ✅ Pre-Request
- [ ] Akun sudah aktif
- [ ] Sudah login ke aplikasi  
- [ ] Barang yang diinginkan tersedia
- [ ] Tanggal pengembalian sudah direncanakan
- [ ] Tujuan peminjaman sudah jelas

### ✅ Saat Request
- [ ] Form diisi lengkap dan jelas
- [ ] Purpose dijelaskan spesifik
- [ ] Return date realistis
- [ ] Notes tambahan jika perlu
- [ ] Double check sebelum submit

### ✅ Post-Request  
- [ ] Cek notifikasi berkala
- [ ] Respond admin jika diminta info
- [ ] Koordinasi pengambilan jika approved
- [ ] Monitor deadline return
- [ ] Return tepat waktu

---

## 🚀 Pro Tips untuk Peminjam

### 💡 **Timing Request**
- Request **3-5 hari** sebelum butuh
- Hindari request **weekend** atau **hari libur**
- Request **pagi hari** untuk response lebih cepat

### 💡 **Building Trust**
- Selalu **return tepat waktu**
- **Rawat barang** dengan baik
- **Komunikasi proaktif** jika ada kendala
- **Thank you note** setelah selesai (optional tapi appreciated)

### 💡 **Backup Plan**
- Punya **alternatif barang** jika request ditolak
- **Plan B** jika barang rusak/hilang
- **Contact admin** tersimpan di HP

---

## ⚠️ Hal yang Harus Dihindari

### ❌ **DON'T DO:**
- Meminjam untuk **orang lain** tanpa izin
- **Sublet** barang ke pihak lain
- **Modifikasi** atau **bongkar** barang
- **Lupa** inform jika ada kerusakan
- **Ignore** notifikasi atau komunikasi admin
- **Late return** tanpa komunikasi
- **Request mendadak** untuk acara penting

---

**🎉 Happy Borrowing!**

*Ikuti panduan ini untuk pengalaman peminjaman yang lancar dan menyenangkan. Remember: komunikasi adalah kunci sukses!*

---

**📞 Need Help?**
Jika masih ada pertanyaan, jangan ragu hubungi admin atau buat issue di GitHub repository.

*Last updated: September 2024*
