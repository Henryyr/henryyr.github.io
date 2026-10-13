'use strict';
const translations = {
  id: {
    skip: 'Langsung ke konten',
    bio: 'Saya membangun API, merangkai logika bisnis, dan menguji aplikasi. Fokus pada kode yang jelas dan sistem yang mudah dirawat.',
    education: 'Manajemen Informatika',
    projectsTitle: 'Proyek pilihan',
    allRepos: 'Lihat semua',
    salon: 'Backend booking salon dengan voucher, stok produk, dan pembayaran Midtrans.',
    villa: 'API penyewaan properti dengan autentikasi, hak akses, booking, dan favorit.',
    gaet: 'Aplikasi katalog dan portofolio untuk driver serta guide wisata.',
    leaderboard: 'Eksperimen peringkat real-time dengan Redis dan koneksi WebSocket.',
    inventory: 'Proyek belajar pengelolaan item, stok, dan pengguna dengan NestJS dan Prisma.',
    toolsTitle: 'Tools sehari-hari',
    backTop: 'Ke atas ↑',
    description: 'Henry Yusuf Rizaldy — Backend Developer & QA. Profil dan proyek pilihan dari GitHub.'
  },
  en: {
    skip: 'Skip to content',
    bio: 'I build APIs, connect business logic, and test applications. My focus is on clear code and maintainable systems.',
    education: 'Informatics Management',
    projectsTitle: 'Selected projects',
    allRepos: 'View all',
    salon: 'A salon booking backend with vouchers, product inventory, and Midtrans payments.',
    villa: 'A property rental API with authentication, permissions, bookings, and favorites.',
    gaet: 'A catalog and portfolio app for drivers and tour guides.',
    leaderboard: 'A real-time leaderboard experiment using Redis and WebSocket connections.',
    inventory: 'A study project exploring items, stock, and users with NestJS and Prisma.',
    toolsTitle: 'Everyday tools',
    backTop: 'Back to top ↑',
    description: 'Henry Yusuf Rizaldy — Backend Developer & QA. Profile and selected GitHub projects.'
  }
};
let language = 'id';
try {
  const saved = localStorage.getItem('henry-language');
  if (saved === 'id' || saved === 'en') language = saved;
} catch { /* Language switching also works without saved preferences. */ }
function applyLanguage() {
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach(node => {
    node.textContent = translations[language][node.dataset.i18n];
  });
  document.querySelector('#language-id').classList.toggle('active', language === 'id');
  document.querySelector('#language-en').classList.toggle('active', language === 'en');
  document.querySelector('#language-button').setAttribute('aria-label', language === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia');
  document.querySelector('meta[name="description"]').content = translations[language].description;
  document.querySelector('meta[property="og:description"]').content = translations[language].description;
}
document.querySelector('#language-button').addEventListener('click', () => {
  language = language === 'id' ? 'en' : 'id';
  try { localStorage.setItem('henry-language', language); } catch { /* Storage is optional. */ }
  applyLanguage();
});
document.querySelector('#year').textContent = String(new Date().getFullYear());
applyLanguage();
