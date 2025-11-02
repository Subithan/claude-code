// Handle animated particles background using canvas
const canvas = document.querySelector('.background-canvas');
const ctx = canvas.getContext('2d');
const particles = [];
let animationFrame;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}

function createParticles(count = 16) {
  particles.length = 0;
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 2.5 + 0.5,
      velocityX: (Math.random() - 0.5) * 0.4,
      velocityY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.2,
    });
  }
}

function drawParticles() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  ctx.clearRect(0, 0, width, height);
  particles.forEach((particle) => {
    ctx.beginPath();
    ctx.fillStyle = `rgba(103, 232, 249, ${particle.opacity})`;
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();

    particle.x += particle.velocityX;
    particle.y += particle.velocityY;

    if (particle.x > width || particle.x < 0) {
      particle.velocityX *= -1;
    }

    if (particle.y > height || particle.y < 0) {
      particle.velocityY *= -1;
    }
  });

  animationFrame = requestAnimationFrame(drawParticles);
}

function initParticles() {
  resizeCanvas();
  const dynamicCount = Math.min(Math.max(Math.round(window.innerWidth / 100), 12), 26);
  createParticles(dynamicCount);
  drawParticles();
}

if (!prefersReducedMotion) {
  window.addEventListener('resize', () => {
    resizeCanvas();
    const dynamicCount = Math.min(Math.max(Math.round(window.innerWidth / 100), 12), 26);
    createParticles(dynamicCount);
  });
  initParticles();
} else {
  canvas.style.display = 'none';
}

// Intersection Observer for reveal animations
const revealElements = document.querySelectorAll('.reveal');
if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
  });

  revealElements.forEach((el) => observer.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add('is-visible'));
}

// Hero parallax effect
const heroOrbital = document.querySelector('.hero__orbital');
if (heroOrbital && !prefersReducedMotion) {
  const handleParallax = (event) => {
    const rect = heroOrbital.getBoundingClientRect();
    const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * 14;
    const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * 14;
    heroOrbital.style.transform = `rotateX(${offsetY}deg) rotateY(${-offsetX}deg)`;
  };

  heroOrbital.addEventListener('mousemove', handleParallax);
  heroOrbital.addEventListener('mouseleave', () => {
    heroOrbital.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}

// Showcase parallax on scroll
const showcaseFrame = document.querySelector('.showcase__frame');
if (showcaseFrame && !prefersReducedMotion) {
  window.addEventListener('scroll', () => {
    const rect = showcaseFrame.getBoundingClientRect();
    const translate = rect.top * -0.06;
    showcaseFrame.style.transform = `translateY(${translate}px)`;
  }, { passive: true });
}

// FAQ accordion functionality
const faqButtons = document.querySelectorAll('.faq-item__button');
faqButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    const content = button.nextElementSibling;
    if (content) {
      if (expanded) {
        content.hidden = true;
      } else {
        content.hidden = false;
      }
    }
  });
});

// Mobile navigation toggle
const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.setAttribute('aria-hidden', expanded ? 'true' : 'false');
  });

  const syncNavState = () => {
    if (window.innerWidth > 900) {
      navLinks.setAttribute('aria-hidden', 'false');
      navToggle.setAttribute('aria-expanded', 'false');
    } else {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navLinks.setAttribute('aria-hidden', expanded ? 'false' : 'true');
    }
  };

  navLinks.setAttribute('aria-hidden', 'true');
  window.addEventListener('resize', syncNavState);
  syncNavState();

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900) {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.setAttribute('aria-hidden', 'true');
      }
    });
  });
}

// Set current year in footer
const currentYearEl = document.getElementById('current-year');
if (currentYearEl) {
  currentYearEl.textContent = new Date().getFullYear();
}

// Clean up on unload
window.addEventListener('beforeunload', () => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
});
