# 📸 Tutorial Visual: Cara Meminjam Barang Step-by-Step

**Panduan Bergambar untuk Pemula**

## 🎯 Overview
Tutorial ini akan menunjukkan langkah demi langkah dengan deskripsi visual interface untuk meminjam barang. Sangat cocok untuk user pemula yang baru pertama kali menggunakan aplikasi.

---

## 📱 Step 1: Login ke Aplikasi

### Tampilan Halaman Login
```
┌─────────────────────────────────────────┐
│             LOAN MANAGER                │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  📧 Email Address                   ││
│  │  [john.doe@example.com________]     ││
│  │                                     ││
│  │  🔒 Password                        ││
│  │  [••••••••••••________]             ││
│  │                                     ││
│  │  [ Sign In ]    [ Sign Up ]         ││
│  └─────────────────────────────────────┘│
│                                         │
│     Don't have an account? Sign Up      │
└─────────────────────────────────────────┘
```

**Yang harus dilakukan:**
1. ✍️ Ketik email Anda di field "Email Address"
2. ✍️ Ketik password di field "Password"
3. 🖱️ Klik tombol biru **"Sign In"**

**Akun untuk testing:**
- Email: `john.doe@example.com`
- Password: `user123`

---

## 🏠 Step 2: Dashboard Utama

### Tampilan Dashboard Setelah Login
```
┌─────────────────────────────────────────┐
│ 📊 Dashboard    🔔(3)    👤 John Doe   │
├─────────────────────────────────────────┤
│ SIDEBAR:        │  MAIN CONTENT:        │
│ 🏠 Dashboard    │  📊 Statistics        │
│ 📋 Catalog      │  ┌─────┬─────┬─────┐ │
│ 📦 My Loans     │  │ 15  │ 3   │ 2   │ │
│ 📊 Analytics    │  │Items│Loans│Pend │ │
│ ⚙️ Settings     │  └─────┴─────┴─────┘ │
│                 │                       │
│                 │  Quick Actions:        │
│                 │  [Browse Items]       │
│                 │  [My Active Loans]    │
└─────────────────┴───────────────────────┘
```

**Yang terlihat:**
- 🔔 **Bell icon (3)**: Ada 3 notifikasi baru
- 📊 **Statistics cards**: Overview singkat
- 📋 **Sidebar menu**: Navigasi utama
- 🚀 **Quick actions**: Tombol akses cepat

**Yang harus dilakukan:**
1. 🖱️ Klik **"📋 Catalog"** di sidebar, ATAU
2. 🖱️ Klik tombol **"Browse Items"** di quick actions

---

## 🛍️ Step 3: Halaman Catalog

### Tampilan Catalog Items
```
┌─────────────────────────────────────────┐
│                CATALOG                  │
├─────────────────────────────────────────┤
│ 🔍 [Search items...___] 🔽 [Category▼] │
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────────┬─────────────┬─────────┐ │
│ │📱 iPhone 13 │💻 MacBook   │📷 Camera│ │
│ │Available ✅ │Available ✅ │Borrowed❌│ │
│ │Qty: 2       │Qty: 1       │Qty: 0   │ │
│ │[Request]    │[Request]    │[Wait]   │ │
│ └─────────────┴─────────────┴─────────┘ │
│                                         │
│ ┌─────────────┬─────────────┬─────────┐ │
│ │🖨️ Printer   │🎤 Microphone│📊 Tablet│ │
│ │Available ✅ │Available ✅ │Available│ │
│ │Qty: 3       │Qty: 2       │Qty: 1   │ │
│ │[Request]    │[Request]    │[Request]│ │
│ └─────────────┴─────────────┴─────────┘ │
└─────────────────────────────────────────┘
```

**Penjelasan tampilan:**
- ✅ **Available**: Barang bisa dipinjam
- ❌ **Borrowed**: Semua unit sedang dipinjam
- 🔢 **Qty**: Jumlah tersedia
- 🔍 **Search**: Bisa search nama barang
- 🔽 **Category**: Filter berdasarkan kategori

**Yang harus dilakukan:**
1. 👀 Cari barang yang diinginkan (contoh: MacBook)
2. ✅ Pastikan status **"Available"**
3. 🖱️ Klik tombol biru **"Request"** pada barang pilihan

---

## 📝 Step 4: Form Request Peminjaman

### Tampilan Form Request
```
┌─────────────────────────────────────────┐
│            REQUEST LOAN                 │
├─────────────────────────────────────────┤
│                                         │
│  Selected Item: 💻 MacBook Pro          │
│  Available: 1 unit                      │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ 📅 Return Date *                    ││
│  │ [MM/DD/YYYY___] 📅                  ││
│  │                                     ││
│  │ 🎯 Purpose *                        ││
│  │ [_________________________]        ││
│  │ [_________________________]        ││
│  │                                     ││
│  │ 📝 Additional Notes                 ││
│  │ [_________________________]        ││
│  │ [_________________________]        ││
│  │                                     ││
│  │    [ Cancel ]  [ Submit Request ]   ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

**Contoh pengisian yang BENAR:**

### 📅 Return Date:
```
Pilih: 01/20/2024 (contoh: 5 hari dari sekarang)
```

### 🎯 Purpose:
```
✅ CONTOH BAIK:
"Presentasi tugas akhir mata kuliah Sistem Informasi 
tanggal 18 Januari 2024 di ruang seminar lantai 3"

❌ CONTOH BURUK:
"butuh buat presentasi"
```

### 📝 Additional Notes:
```
✅ CONTOH BAIK:
"Presentasi dimulai jam 09:00-11:00. Akan digunakan 
untuk demo aplikasi yang sudah dikembangkan. 
Contact: 081234567890"

⭕ BOLEH KOSONG jika tidak ada info tambahan
```

**Yang harus dilakukan:**
1. 📅 **Klik date picker** → pilih tanggal realistis
2. ✍️ **Tulis purpose** dengan jelas dan spesifik
3. ✍️ **Tulis notes** tambahan (opsional)
4. ✅ **Review** semua informasi
5. 🖱️ **Klik "Submit Request"**

---

## ✅ Step 5: Konfirmasi Submit

### Tampilan Setelah Submit
```
┌─────────────────────────────────────────┐
│               SUCCESS! ✅               │
├─────────────────────────────────────────┤
│                                         │
│    Your request has been submitted      │
│                                         │
│  📋 Request Details:                    │
│  • Item: MacBook Pro                    │
│  • Return Date: Jan 20, 2024            │
│  • Status: Pending Approval ⏳         │
│                                         │
│  You will receive a notification when   │
│  your request is reviewed by admin.     │
│                                         │
│          [ View My Loans ]              │
│          [ Browse More Items ]          │
└─────────────────────────────────────────┘
```

**Yang terjadi:**
- ✅ Request berhasil disimpan
- ⏳ Status: **"Pending"** (menunggu approval)
- 🔔 Akan dapat notifikasi saat ada update
- 👀 Bisa cek status di "My Loans"

**Yang harus dilakukan:**
1. 🖱️ Klik **"View My Loans"** untuk monitor status, ATAU
2. 🖱️ Klik **"Browse More Items"** untuk request barang lain

---

## 📦 Step 6: Monitor Status di My Loans

### Tampilan My Loans
```
┌─────────────────────────────────────────┐
│              MY LOANS                   │
├─────────────────────────────────────────┤
│                                         │
│ 📊 Summary:                             │
│ Active: 1  │  Pending: 1  │  History: 3│
│                                         │
├─────────────────────────────────────────┤
│ 🟡 PENDING REQUESTS                     │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 💻 MacBook Pro                      │ │
│ │ Requested: Jan 15, 2024             │ │
│ │ Return by: Jan 20, 2024             │ │
│ │ Status: ⏳ Pending Approval         │ │
│ │                                     │ │
│ │ Purpose: Presentasi tugas akhir...   │ │
│ │                      [ Cancel ]     │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ 🟢 ACTIVE LOANS                         │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 📱 iPhone 13                        │ │
│ │ Borrowed: Jan 10, 2024              │ │
│ │ Return by: Jan 17, 2024 (2 days)    │ │
│ │ Status: 🟢 Active                   │ │
│ │                                     │ │
│ │ Purpose: Testing mobile app...       │ │
│ │                      [ Return ]     │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Penjelasan status:**
- 🟡 **Pending**: Menunggu approval admin
- 🟢 **Active**: Sedang dipinjam
- 🔵 **Returned**: Sudah dikembalikan
- 🔴 **Overdue**: Terlambat return

**Yang bisa dilakukan:**
- 👀 **Monitor**: Status request
- ❌ **Cancel**: Request yang masih pending
- 🔄 **Return**: Pinjaman yang sudah selesai digunakan

---

## 🔔 Step 7: Notifikasi Update

### Tampilan Notifikasi Bell
```
┌─────────────────────────────────────────┐
│ 🔔 NOTIFICATIONS (2)                    │
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ✅ Request Approved                 │ │
│ │ Your MacBook Pro loan has been      │ │
│ │ approved. Please coordinate with    │ │
│ │ admin for item pickup.              │ │
│ │                                     │ │
│ │ 2 hours ago                    [✖]  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ⚠️ Due Soon                          │ │
│ │ Your iPhone 13 loan is due in 2     │ │
│ │ days. Please prepare for return.    │ │
│ │                                     │ │
│ │ 1 day ago                      [✖]  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│           [ Clear All ]                 │
└─────────────────────────────────────────┘
```

**Jenis notifikasi yang mungkin muncul:**
- ✅ **Request Approved**: Request disetujui
- ❌ **Request Rejected**: Request ditolak
- ⚠️ **Due Soon**: Akan jatuh tempo
- 🔴 **Overdue**: Sudah terlambat
- 📝 **Info Request**: Admin minta info tambahan

**Yang harus dilakukan:**
1. 📖 **Baca** notifikasi dengan seksama
2. 📋 **Follow up** sesuai instruksi
3. ✖️ **Dismiss** notifikasi yang sudah dibaca

---

## 🔄 Step 8: Return Barang

### Tampilan Return Process
```
┌─────────────────────────────────────────┐
│            RETURN LOAN                  │
├─────────────────────────────────────────┤
│                                         │
│  📱 iPhone 13                           │
│  Borrowed: Jan 10, 2024                 │
│  Due: Jan 17, 2024                      │
│                                         │
│  ⚠️ CONFIRMATION                        │
│  Are you sure you want to mark this     │
│  loan as returned?                      │
│                                         │
│  Please ensure:                         │
│  ✅ Item is in good condition           │
│  ✅ All accessories included            │
│  ✅ Item is clean                       │
│  ✅ No damage occurred                  │
│                                         │
│       [ Cancel ]  [ Confirm Return ]    │
│                                         │
│  📝 Note: You still need to physically  │
│  return the item to admin after         │
│  confirming here.                       │
└─────────────────────────────────────────┘
```

**Checklist sebelum return:**
- ✅ **Kondisi baik**: Tidak ada kerusakan
- ✅ **Lengkap**: Semua aksesoris ada
- ✅ **Bersih**: Sudah dibersihkan
- ✅ **Koordinasi**: Sudah janjian dengan admin

**Yang harus dilakukan:**
1. ✅ **Check** kondisi barang
2. 🖱️ **Klik "Confirm Return"** di aplikasi
3. 📞 **Koordinasi** dengan admin untuk return fisik
4. 🤝 **Serahkan** barang ke admin

---

## 📱 Tips Mobile Usage

### Tampilan Mobile (Portrait)
```
┌─────────────────┐
│ 🏠 📋 📦 📊 👤 │  ← Bottom Navigation
├─────────────────┤
│                 │
│   📋 CATALOG    │
│                 │
│ 🔍 [Search...]  │
│                 │
│ ┌─────────────┐ │
│ │📱 iPhone 13 │ │
│ │Available ✅ │ │
│ │Qty: 2       │ │
│ │  [Request]  │ │
│ └─────────────┘ │
│                 │
│ ┌─────────────┐ │
│ │💻 MacBook   │ │
│ │Available ✅ │ │
│ │Qty: 1       │ │
│ │  [Request]  │ │
│ └─────────────┘ │
│                 │
└─────────────────┘
```

**Tips mobile:**
- 👆 **Tap** untuk select
- 📱 **Bottom nav** untuk navigasi
- 🔍 **Search** dengan keyboard
- 📷 **Screenshot** konfirmasi untuk backup

---

## ⚡ Cheatsheet: Quick Reference

### 🚀 Fast Track Borrowing:
```
1. Login → 2. Catalog → 3. Request → 4. Fill Form → 5. Submit
```

### 📝 Form Must-Fill:
- **Return Date**: Realistis + buffer
- **Purpose**: Jelas + spesifik + konteks

### 📊 Status Flow:
```
Pending → Approved → Active → Returned
    ↓
 Rejected (bisa request ulang)
```

### 🔔 Important Notifications:
- ✅ **Approved**: Koordinasi pickup
- ⚠️ **Due Soon**: Prepare return
- 🔴 **Overdue**: URGENT return

---

## ❓ Troubleshooting Visual

### Problem: Tidak Bisa Submit Request
```
┌─────────────────────────────────────────┐
│ ❌ Error: Please fill all required      │
│    fields                               │
│                                         │
│ 📅 Return Date * [EMPTY] ← Harus diisi │
│ 🎯 Purpose * [EMPTY]     ← Harus diisi │
│ 📝 Notes [Optional]                     │
└─────────────────────────────────────────┘
```
**Solusi**: Isi semua field yang ada tanda *

### Problem: Barang Tidak Available
```
┌─────────────────────────────────────────┐
│ 📷 Professional Camera                  │
│ Status: ❌ All units borrowed           │
│ Available: 0/2                          │
│ Next available: Jan 25, 2024            │
│                                         │
│        [ Notify When Available ]        │
└─────────────────────────────────────────┘
```
**Solusi**: Tunggu atau pilih barang alternatif

---

## 🎉 Success Indicators

### ✅ Request Berhasil:
- Pop-up konfirmasi muncul
- Status "Pending" di My Loans
- Notifikasi confirmation

### ✅ Login Berhasil:
- Redirect ke Dashboard
- Nama user muncul di header
- Menu sidebar accessible

### ✅ Return Berhasil:
- Status berubah "Returned"
- Item hilang dari Active Loans
- Muncul di History

---

**🎯 Selamat! Anda sudah siap meminjam barang dengan lancar!**

*Bookmark tutorial ini untuk referensi cepat. Happy borrowing! 📚✨*

---

*Visual tutorial ini disesuaikan dengan interface aplikasi Loan Management System. Last updated: September 2024*
