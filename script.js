const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Particle canvas setup
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationFrameId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles(count = 16) {
  particles = new Array(count).fill(null).map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1.2,
    speedX: (Math.random() - 0.5) * 0.3,
    speedY: (Math.random() - 0.5) * 0.3,
    alpha: Math.random() * 0.4 + 0.2
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius);
    gradient.addColorStop(0, `rgba(34, 211, 238, ${particle.alpha})`);
    gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
    ctx.fillStyle = gradient;
    ctx.fill();
  });
}

function updateParticles() {
  particles.forEach((particle) => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.x < -50) particle.x = canvas.width + 50;
    if (particle.x > canvas.width + 50) particle.x = -50;
    if (particle.y < -50) particle.y = canvas.height + 50;
    if (particle.y > canvas.height + 50) particle.y = -50;
  });
}

function animateParticles() {
  drawParticles();
  updateParticles();
  animationFrameId = requestAnimationFrame(animateParticles);
}

function initParticles() {
  resizeCanvas();
  createParticles(window.innerWidth < 768 ? 12 : 18);
  drawParticles();
  if (!prefersReducedMotion) {
    animateParticles();
  }
}

window.addEventListener('resize', () => {
  resizeCanvas();
  createParticles(particles.length);
});

if (!prefersReducedMotion) {
  window.addEventListener('blur', () => cancelAnimationFrame(animationFrameId));
  window.addEventListener('focus', () => {
    cancelAnimationFrame(animationFrameId);
    animateParticles();
  });
}

// Scroll reveal animations
const revealElements = document.querySelectorAll('[data-reveal]');
if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealElements.forEach((el) => observer.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add('is-visible'));
}

// Mobile navigation toggle
const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navToggle.classList.toggle('is-open');
    navLinks.classList.toggle('is-open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.classList.remove('is-open');
      navLinks.classList.remove('is-open');
    });
  });
}

// FAQ accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach((item) => {
  const button = item.querySelector('.faq-item__toggle');
  const content = item.querySelector('.faq-item__content');
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    content.hidden = expanded;
  });
});

// Hero parallax effect
const heroVisual = document.querySelector('.hero__visual');
const heroScreen = document.querySelector('.hero__screen');
const heroOrb = document.querySelector('.hero__orb');
if (heroVisual && !prefersReducedMotion) {
  heroVisual.addEventListener('mousemove', (event) => {
    const rect = heroVisual.getBoundingClientRect();
    const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * 20;
    const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * 20;
    heroScreen.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
    if (heroOrb) {
      heroOrb.style.transform = `translate3d(${-offsetX / 2}px, ${-offsetY / 2}px, 0)`;
    }
  });

  heroVisual.addEventListener('mouseleave', () => {
    heroScreen.style.transform = '';
    if (heroOrb) {
      heroOrb.style.transform = '';
    }
  });
}

// Showcase parallax on scroll
const showcaseFrame = document.querySelector('.showcase__frame');
if (showcaseFrame && !prefersReducedMotion) {
  window.addEventListener('scroll', () => {
    const rect = showcaseFrame.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const progress = 1 - Math.min(Math.max((rect.top + rect.height / 2) / windowHeight, 0), 1);
    showcaseFrame.style.transform = `translate3d(0, ${progress * 12}px, 0)`;
  }, { passive: true });
}

// Update footer year
const yearElement = document.getElementById('year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Initialize particles after DOM ready to ensure canvas size
if (document.readyState !== 'loading') {
  initParticles();
} else {
  document.addEventListener('DOMContentLoaded', initParticles);
}
