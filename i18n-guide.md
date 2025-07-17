# Panduan Internationalization (i18n)

## Overview
Aplikasi Loan Management System sekarang mendukung multi-bahasa dengan:
- **Bahasa Indonesia** sebagai default
- **Bahasa Inggris** sebagai alternatif
- Language switcher di header
- Penyimpanan preferensi bahasa di localStorage

## Struktur i18n

### Files
```
src/i18n/
├── index.ts              # Konfigurasi i18next
├── locales/
│   ├── id.json          # Terjemahan Bahasa Indonesia
│   └── en.json          # Terjemahan Bahasa Inggris
```

### Komponen
```
src/components/UI/LanguageSwitcher.tsx  # Komponen switch bahasa
```

## Cara Menggunakan

### 1. Import useTranslation
```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <h1>{t('dashboard.title')}</h1>
  );
};
```

### 2. Menggunakan Terjemahan
```typescript
// Simple translation
{t('common.save')}

// With interpolation
{t('dashboard.welcome', { name: user.name })}

// With pluralization
{t('items.count', { count: items.length })}
```

### 3. Menambah Terjemahan Baru

#### Bahasa Indonesia (id.json)
```json
{
  "newSection": {
    "title": "Judul Baru",
    "description": "Deskripsi dalam bahasa Indonesia"
  }
}
```

#### Bahasa Inggris (en.json)
```json
{
  "newSection": {
    "title": "New Title",
    "description": "Description in English"
  }
}
```

## Struktur Terjemahan

### Common (Umum)
- `common.loading` - "Memuat..." / "Loading..."
- `common.save` - "Simpan" / "Save"
- `common.cancel` - "Batal" / "Cancel"

### Authentication
- `auth.login` - "Masuk" / "Login"
- `auth.email` - "Email" / "Email"
- `auth.password` - "Kata Sandi" / "Password"

### Navigation
- `navigation.dashboard` - "Dasbor" / "Dashboard"
- `navigation.items` - "Barang" / "Items"
- `navigation.loans` - "Peminjaman" / "Loans"

### Dashboard
- `dashboard.title` - "Dasbor" / "Dashboard"
- `dashboard.totalItems` - "Total Barang" / "Total Items"
- `dashboard.activeLoans` - "Peminjaman Aktif" / "Active Loans"

### Items
- `items.title` - "Manajemen Barang" / "Item Management"
- `items.addItem` - "Tambah Barang" / "Add Item"
- `items.conditions.excellent` - "Sangat Baik" / "Excellent"

### Loans
- `loans.title` - "Manajemen Peminjaman" / "Loan Management"
- `loans.status.pending` - "Menunggu" / "Pending"
- `loans.status.approved` - "Disetujui" / "Approved"

### Users
- `users.title` - "Manajemen Pengguna" / "User Management"
- `users.roles.admin` - "Administrator" / "Administrator"

### Messages
- `messages.success.itemAdded` - "Barang berhasil ditambahkan" / "Item added successfully"
- `messages.error.general` - "Terjadi kesalahan" / "An error occurred"

## Language Switcher

### Lokasi
Language switcher terletak di header, sebelah kiri notifications.

### Fitur
- Dropdown dengan bendera negara
- Nama bahasa dalam bahasa asli
- Checkmark untuk bahasa aktif
- Hover effects dan smooth transitions

### Penyimpanan
Preferensi bahasa disimpan di localStorage dan akan diingat saat user kembali.

## Best Practices

### 1. Konsistensi Penamaan
```
section.subsection.item
dashboard.stats.totalItems
auth.form.emailLabel
```

### 2. Gunakan Namespace
```json
{
  "dashboard": { ... },
  "items": { ... },
  "loans": { ... }
}
```

### 3. Fallback Text
Selalu sediakan fallback untuk key yang belum diterjemahkan:
```typescript
{t('new.key', 'Default text')}
```

### 4. Interpolation
```typescript
{t('welcome.message', { name: user.name })}
```

## Menambah Bahasa Baru

### 1. Buat File Terjemahan
```
src/i18n/locales/fr.json  # Contoh: Bahasa Prancis
```

### 2. Update Konfigurasi
```typescript
// src/i18n/index.ts
import fr from './locales/fr.json';

const resources = {
  id: { translation: id },
  en: { translation: en },
  fr: { translation: fr }  // Tambah bahasa baru
};
```

### 3. Update Language Switcher
```typescript
// src/components/UI/LanguageSwitcher.tsx
const languages = [
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }  // Tambah bahasa baru
];
```

## Status Implementasi

### ✅ Sudah Diimplementasi
- Konfigurasi i18next
- Bahasa Indonesia dan Inggris
- Language switcher di header
- Terjemahan untuk LoginForm
- localStorage persistence

### 🔄 Dalam Progress
- Terjemahan untuk semua komponen
- Interpolation dan pluralization
- Date/time localization

### 📋 TODO
- Terjemahan lengkap untuk semua komponen
- RTL support (jika diperlukan)
- Number formatting localization
- Error message translations
