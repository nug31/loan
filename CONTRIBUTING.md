# Contributing to Loan Management System

Terima kasih atas minat Anda untuk berkontribusi pada proyek Loan Management System! Panduan ini akan membantu Anda memulai kontribusi.

## 📋 Daftar Isi
1. [Code of Conduct](#code-of-conduct)
2. [Cara Berkontribusi](#cara-berkontribusi)
3. [Development Setup](#development-setup)
4. [Coding Standards](#coding-standards)
5. [Pull Request Process](#pull-request-process)
6. [Issue Guidelines](#issue-guidelines)

---

## 🤝 Code of Conduct

Proyek ini mengikuti prinsip-prinsip berikut:
- Bersikap hormat dan inklusif terhadap semua kontributor
- Memberikan feedback yang konstruktif
- Fokus pada apa yang terbaik untuk komunitas
- Menunjukkan empati terhadap anggota komunitas lainnya

## 🛠️ Cara Berkontribusi

Ada beberapa cara untuk berkontribusi:

### 1. Melaporkan Bug
- Gunakan template issue yang disediakan
- Sertakan langkah-langkah untuk reproduce bug
- Lampirkan screenshot atau log error jika memungkinkan

### 2. Mengusulkan Fitur Baru
- Diskusikan terlebih dahulu melalui issue
- Jelaskan use case dan benefit fitur tersebut
- Pertimbangkan dampak terhadap existing users

### 3. Menulis Kode
- Fix bug yang ada
- Implementasi fitur baru
- Meningkatkan performa
- Menambah test coverage

### 4. Menulis Dokumentasi
- Memperbaiki typo atau kesalahan
- Menambah contoh penggunaan
- Menerjemahkan dokumentasi
- Menulis tutorial

## ⚙️ Development Setup

### Prerequisites
```bash
# Install Node.js 16+
# Install PostgreSQL 12+
# Install Git
```

### Setup Project
```bash
# 1. Fork repository di GitHub
# 2. Clone fork Anda
git clone https://github.com/YOUR_USERNAME/loan.git
cd loan

# 3. Setup upstream remote
git remote add upstream https://github.com/nug31/loan.git

# 4. Install dependencies
npm install
cd backend && npm install && cd ..

# 5. Setup database dan environment
createdb loan_db_dev
cd backend
cp .env.example .env
# Edit .env dengan konfigurasi development Anda

# 6. Run tests
npm test
cd backend && npm test && cd ..
```

### Development Workflow
```bash
# 1. Sync dengan upstream
git checkout main
git pull upstream main
git push origin main

# 2. Buat branch untuk fitur/bugfix
git checkout -b feature/nama-fitur
# atau
git checkout -b bugfix/nama-bug

# 3. Develop dan test
npm run dev  # Frontend
cd backend && node server-pg.js  # Backend

# 4. Commit changes
git add .
git commit -m "feat: deskripsi singkat perubahan"

# 5. Push dan create PR
git push origin feature/nama-fitur
```

## 📝 Coding Standards

### JavaScript/TypeScript
- Gunakan **ES6+** syntax
- Prefer **const** dan **let** daripada **var**
- Gunakan **async/await** daripada callback
- Consistent **indentation** (2 spaces)

### React Components
- Gunakan **functional components** dengan hooks
- **PropTypes** atau **TypeScript** untuk type checking
- Consistent **naming convention** (PascalCase untuk components)

### API Development
- RESTful API design
- Consistent **error handling**
- **Input validation** untuk semua endpoints
- **Status code** yang sesuai

### Database
- Gunakan **migrations** untuk perubahan schema
- **Indexing** untuk kolom yang sering di-query
- **Normalization** yang baik

### Example Code Style
```javascript
// ✅ Good
const getUserLoans = async (userId) => {
  try {
    const loans = await Loan.findAll({
      where: { userId },
      include: [Item, User],
      order: [['createdAt', 'DESC']]
    });
    return loans;
  } catch (error) {
    throw new Error(`Failed to fetch user loans: ${error.message}`);
  }
};

// ❌ Bad
function getUserLoans(userId, callback) {
  Loan.findAll({
    where: {userId: userId}
  }, function(err, loans) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, loans);
    }
  });
}
```

## 🔄 Pull Request Process

### 1. Before Creating PR
- [ ] Code berjalan tanpa error
- [ ] Tests pass (jika ada)
- [ ] Documentation diupdate jika perlu
- [ ] Self-review code changes
- [ ] Rebase dengan main branch terbaru

### 2. PR Title Format
```
type(scope): short description

Examples:
feat(auth): add password reset functionality
fix(loans): resolve overdue notification bug
docs(readme): update installation instructions
refactor(api): simplify error handling
```

### 3. PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix/feature causing existing functionality to break)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Code is commented where necessary
- [ ] Documentation updated
```

### 4. Review Process
1. **Automated checks** harus pass
2. **Code review** dari maintainer
3. **Discussion** jika ada perubahan yang diperlukan
4. **Approval** dan merge

## 🐛 Issue Guidelines

### Bug Reports
```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable, add screenshots

**Environment:**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Node.js version: [e.g. 16.14.0]
- App version: [e.g. 1.2.0]
```

### Feature Requests
```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
Clear description of what you want to happen

**Describe alternatives you've considered**
Alternative solutions or features you've considered

**Additional context**
Any other context or screenshots about the feature request
```

## 🏷️ Commit Message Convention

Gunakan format [Conventional Commits](https://conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types:
- **feat**: Fitur baru
- **fix**: Bug fix
- **docs**: Dokumentasi saja
- **style**: Formatting, semicolons, dll (tidak mengubah kode)
- **refactor**: Code refactoring
- **test**: Menambah atau mengubah tests
- **chore**: Maintenance tasks

### Examples:
```bash
feat(auth): add OAuth login support
fix(loans): resolve return date validation
docs(api): update endpoint documentation
style(components): format code with prettier
refactor(database): optimize loan queries
test(auth): add login integration tests
chore(deps): update dependencies
```

## 🧪 Testing Guidelines

### Unit Tests
- Test **individual functions/components**
- Mock external dependencies
- Focus pada **business logic**

### Integration Tests
- Test **API endpoints**
- Test **database interactions**
- Test **component integration**

### E2E Tests (Future)
- Test **complete user workflows**
- Test **critical paths**

### Running Tests
```bash
# Frontend tests
npm test

# Backend tests
cd backend
npm test

# Watch mode
npm run test:watch
```

## 📦 Release Process

1. **Version bump** mengikuti [Semantic Versioning](https://semver.org/)
2. **Update CHANGELOG.md**
3. **Create release tag**
4. **Deploy to staging** untuk testing
5. **Deploy to production** setelah approval

## 🆘 Need Help?

- **Documentation**: Baca [USER_GUIDE.md](./USER_GUIDE.md) dan [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)
- **Discussions**: Gunakan GitHub Discussions untuk pertanyaan umum
- **Issues**: Untuk bug reports dan feature requests
- **Discord/Slack**: (jika tersedia) untuk real-time discussion

## 🙏 Recognition

Kontributor akan diakui di:
- **README.md** contributors section
- **Release notes** untuk kontribusi signifikan
- **Special thanks** di documentation

---

**Thank you for contributing!** 🎉

Setiap kontribusi, sekecil apapun, sangat berarti bagi proyek ini.

*Last updated: September 2024*
