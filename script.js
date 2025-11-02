const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d', { alpha: true });
let particles = [];
let prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let pixelRatio = window.devicePixelRatio || 1;

const setReducedMotion = () => {
  document.body.dataset.reducedMotion = prefersReducedMotion ? 'true' : 'false';
};

setReducedMotion();

const resizeCanvas = () => {
  pixelRatio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * pixelRatio;
  canvas.height = window.innerHeight * pixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
};

const createParticles = () => {
  const count = Math.min(20, Math.floor(window.innerWidth / 90));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 2.6 + 0.7,
    opacity: Math.random() * 0.4 + 0.25,
    driftX: (Math.random() - 0.5) * 0.2,
    driftY: (Math.random() - 0.5) * 0.3,
    hue: Math.random() > 0.5 ? 195 : 272,
  }));
};

const drawParticles = () => {
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.clearRect(0, 0, canvas.width / pixelRatio, canvas.height / pixelRatio);
  particles.forEach((particle) => {
    const gradient = ctx.createRadialGradient(
      particle.x,
      particle.y,
      0,
      particle.x,
      particle.y,
      particle.radius * 6
    );
    gradient.addColorStop(0, `hsla(${particle.hue}, 85%, 65%, ${particle.opacity})`);
    gradient.addColorStop(1, 'rgba(11, 15, 26, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius * 4, 0, Math.PI * 2);
    ctx.fill();
  });
};

const updateParticles = () => {
  particles.forEach((particle) => {
    particle.x += particle.driftX;
    particle.y += particle.driftY;

    if (particle.x < -50) particle.x = window.innerWidth + 50;
    if (particle.x > window.innerWidth + 50) particle.x = -50;
    if (particle.y < -50) particle.y = window.innerHeight + 50;
    if (particle.y > window.innerHeight + 50) particle.y = -50;
  });
};

let animationId;

const animateParticles = () => {
  if (prefersReducedMotion) {
    drawParticles();
    return;
  }
  updateParticles();
  drawParticles();
  animationId = requestAnimationFrame(animateParticles);
};

const handleResize = () => {
  resizeCanvas();
  createParticles();
  drawParticles();
};

window.addEventListener('resize', handleResize);

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  document.querySelectorAll('.reveal').forEach((section) => observer.observe(section));
} else {
  document.querySelectorAll('.reveal').forEach((section) => section.classList.add('revealed'));
}

const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');

const closeNav = () => {
  if (!navLinks || !navToggle) return;
  navLinks.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
};

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isExpanded));
    navLinks.classList.toggle('is-open');
  });

  navLinks.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => {
      if (window.innerWidth <= 920) {
        closeNav();
      }
    })
  );
}

// Parallax hero interaction
const heroOrb = document.querySelector('.hero__devices');

const handleParallax = (event) => {
  if (prefersReducedMotion || !heroOrb) return;
  const rect = heroOrb.getBoundingClientRect();
  const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
  const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
  heroOrb.style.transform = `rotateX(${offsetY * 6}deg) rotateY(${offsetX * -6}deg) translateZ(10px)`;
};

const resetParallax = () => {
  if (heroOrb) {
    heroOrb.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0)';
  }
};

document.querySelector('.hero__visual')?.addEventListener('mousemove', handleParallax);
document.querySelector('.hero__visual')?.addEventListener('mouseleave', resetParallax);

// FAQ accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach((item) => {
  const trigger = item.querySelector('.faq-item__trigger');
  const content = item.querySelector('.faq-item__content');

  trigger.addEventListener('click', () => {
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(!isOpen));
    if (isOpen) {
      content.hidden = true;
    } else {
      content.hidden = false;
    }
  });
});

const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const init = () => {
  resizeCanvas();
  createParticles();
  animateParticles();
};

if (prefersReducedMotion) {
  cancelAnimationFrame(animationId);
}

init();

window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (event) => {
  prefersReducedMotion = event.matches;
  setReducedMotion();
  if (prefersReducedMotion) {
    cancelAnimationFrame(animationId);
    drawParticles();
    resetParallax();
  } else {
    animateParticles();
  }
});
