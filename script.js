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
/* ---------- Карусель результатов ---------- */
document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const track = carousel.querySelector('[data-track]');
  const slides = Array.from(track.children);
  const prevBtn = carousel.querySelector('[data-prev]');
  const nextBtn = carousel.querySelector('[data-next]');
  const dotsWrap = carousel.querySelector('[data-dots]');

  if (!track || slides.length === 0) return;

  let index = 0;

  // Сколько карточек видно одновременно (зависит от ширины)
  const getVisible = () => {
    const w = window.innerWidth;
    if (w <= 560) return 1;
    if (w <= 850) return 2;
    return 3;
  };

  // Максимальный индекс, до которого можно листать
  const getMaxIndex = () => Math.max(0, slides.length - getVisible());

  // Создаём точки
  const buildDots = () => {
    dotsWrap.innerHTML = '';
    const max = getMaxIndex();
    for (let i = 0; i <= max; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Слайд ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  };

  const updateDots = () => {
    const dots = dotsWrap.querySelectorAll('.carousel-dot');
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
  };

  // Основная функция перемещения
  const goTo = (i) => {
    const max = getMaxIndex();
    if (i < 0) i = max;
    if (i > max) i = 0;
    index = i;

    // Вычисляем смещение: ширина слайда + gap
    const slideEl = slides[0];
    const slideWidth = slideEl.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const offset = index * (slideWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
  };

  prevBtn?.addEventListener('click', () => goTo(index - 1));
  nextBtn?.addEventListener('click', () => goTo(index + 1));

  // Пересчёт при изменении размера окна
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildDots();
      goTo(Math.min(index, getMaxIndex()));
    }, 150);
  });

  // Автопрокрутка (закомментируйте, если не нужна)
  // let autoplay = setInterval(() => goTo(index + 1), 5000);
  // carousel.addEventListener('mouseenter', () => clearInterval(autoplay));
  // carousel.addEventListener('mouseleave', () => {
  //   autoplay = setInterval(() => goTo(index + 1), 5000);
  // });

  buildDots();
  goTo(0);
});
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

if (dot && ring && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  // Кольцо догоняет с инерцией
  const loop = () => {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  };
  loop();

  // Реакция на интерактив
  document.querySelectorAll('a, button, .direction-card, summary').forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
  });
}
const canvas = document.querySelector('.hero-particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const mouse = { x: -9999, y: -9999 };

  const resize = () => {
    const r = canvas.parentElement.getBoundingClientRect();
    W = canvas.width = r.width * devicePixelRatio;
    H = canvas.height = r.height * devicePixelRatio;
    canvas.style.width = r.width + 'px';
    canvas.style.height = r.height + 'px';

    const count = Math.min(110, Math.floor(r.width / 14));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * 0.3,
      vy: (Math.random() - .5) * 0.3,
      r: Math.random() * 1.6 + 0.4,
    }));
  };

  const tick = () => {
    ctx.clearRect(0, 0, W, H);
    const accent = '216, 255, 54';

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx * devicePixelRatio;
      p.y += p.vy * devicePixelRatio;

      // отталкивание от курсора
      const dx = p.x - mouse.x * devicePixelRatio;
      const dy = p.y - mouse.y * devicePixelRatio;
      const d2 = dx * dx + dy * dy;
      if (d2 < 120 * 120) {
        const d = Math.sqrt(d2) || 1;
        p.x += (dx / d) * 0.8;
        p.y += (dy / d) * 0.8;
      }

      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * devicePixelRatio, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${accent}, .7)`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const ddx = p.x - q.x, ddy = p.y - q.y;
        const dist = Math.hypot(ddx, ddy);
        const max = 130 * devicePixelRatio;
        if (dist < max) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${accent}, ${(1 - dist / max) * 0.18})`;
          ctx.lineWidth = 1 * devicePixelRatio;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  };

  window.addEventListener('resize', resize);
  canvas.parentElement.addEventListener('mousemove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  canvas.parentElement.addEventListener('mouseleave', () => {
    mouse.x = mouse.y = -9999;
  });

  resize();
  tick();
}
const progress = document.querySelector('.scroll-progress');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const p = h.scrollTop / (h.scrollHeight - h.clientHeight);
  progress.style.width = (p * 100) + '%';
}, { passive: true });

