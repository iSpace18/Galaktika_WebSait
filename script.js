/* ---------- Меню ---------- */
const menu = document.querySelector('.menu');
const nav = document.querySelector('.nav');

menu?.addEventListener('click', () => {
  const isOpen = nav.style.display === 'flex';
  if (isOpen) {
    nav.style.display = '';
  } else {
    nav.style.display = 'flex';
    nav.style.position = 'absolute';
    nav.style.top = '70px';
    nav.style.left = '0';
    nav.style.right = '0';
    nav.style.padding = '25px 5vw';
    nav.style.background = '#09090b';
    nav.style.flexDirection = 'column';
    nav.style.borderBottom = '1px solid #29282b';
  }
});

document.querySelectorAll('.nav a').forEach(a =>
  a.addEventListener('click', () => {
    if (window.innerWidth <= 850) nav.style.display = '';
  })
);

/* ---------- Плавное появление блоков (Intersection Observer) ---------- */
const revealEls = document.querySelectorAll('.reveal');

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target); // появление только один раз
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px'
});

revealEls.forEach((el) => io.observe(el));

/* ---------- Раскрытие направлений ---------- */
const directionCards = document.querySelectorAll('.direction-card[data-target]');
const directionDetails = document.querySelectorAll('.direction-detail');

directionCards.forEach((card) => {
  card.addEventListener('click', () => {
    const id = card.dataset.target;
    const target = document.getElementById(id);
    if (!target) return;

    const isOpen = target.classList.contains('is-open');

    // закрываем все
    directionDetails.forEach((d) => d.classList.remove('is-open'));

    if (!isOpen) {
      target.classList.add('is-open');
      // плавный скролл к открытому блоку
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    }
  });
});

document.querySelectorAll('.detail-close').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const parent = btn.closest('.direction-detail');
    parent?.classList.remove('is-open');
  });
});