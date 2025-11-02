// Utility to check reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Responsive navigation toggle
const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.site-header__toggle');
const nav = document.querySelector('#primary-nav');

if (navToggle && header && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('site-header--open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      header.classList.remove('site-header--open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Scroll reveal animations using IntersectionObserver
const revealElements = document.querySelectorAll('.reveal');
if (revealElements.length && !prefersReducedMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px'
    }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

// FAQ accordion logic
const accordionTriggers = document.querySelectorAll('.accordion-item__trigger');
accordionTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const expanded = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(!expanded));
    const content = trigger.nextElementSibling;
    if (content) {
      content.hidden = expanded;
    }
  });
});

// Footer year update
const yearElement = document.querySelector('#year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Parallax effect for hero visual and showcase frame
if (!prefersReducedMotion) {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  if (parallaxElements.length) {
    window.addEventListener('mousemove', (event) => {
      const { innerWidth, innerHeight } = window;
      const offsetX = (event.clientX - innerWidth / 2) / innerWidth;
      const offsetY = (event.clientY - innerHeight / 2) / innerHeight;

      parallaxElements.forEach((element, index) => {
        const intensity = (index + 1) * 6;
        element.style.transform = `translate3d(${offsetX * intensity}px, ${offsetY * intensity}px, 0)`;
      });
    });

    window.addEventListener('mouseleave', () => {
      parallaxElements.forEach((element) => {
        element.style.transform = 'translate3d(0, 0, 0)';
      });
    });
  }
}

// Animated background particles using canvas
const canvas = document.getElementById('particle-canvas');
if (canvas) {
  const context = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  const particles = [];
  const particleCount = 18;

  const resizeCanvas = () => {
    const ratio = window.devicePixelRatio || 1;
    width = canvas.width = window.innerWidth * ratio;
    height = canvas.height = window.innerHeight * ratio;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(ratio, ratio);
  };

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const createParticle = () => {
    const speed = Math.random() * 0.3 + 0.05;
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 2.4 + 0.6,
      alpha: Math.random() * 0.3 + 0.15,
      driftX: (Math.random() - 0.5) * speed,
      driftY: (Math.random() - 0.5) * speed
    };
  };

  for (let i = 0; i < particleCount; i += 1) {
    particles.push(createParticle());
  }

  const drawParticles = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle) => {
      context.beginPath();
      const gradient = context.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius);
      gradient.addColorStop(0, 'rgba(34, 211, 238, 0.65)');
      gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
      context.fillStyle = gradient;
      context.globalAlpha = particle.alpha;
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
      context.globalAlpha = 1;

      particle.x += particle.driftX;
      particle.y += particle.driftY;

      if (particle.x < -50 || particle.x > window.innerWidth + 50) {
        particle.x = Math.random() * window.innerWidth;
      }
      if (particle.y < -50 || particle.y > window.innerHeight + 50) {
        particle.y = Math.random() * window.innerHeight;
      }
    });
  };

  if (!prefersReducedMotion) {
    const animate = () => {
      drawParticles();
      requestAnimationFrame(animate);
    };
    animate();
  } else {
    drawParticles();
  }
}

// Icon microinteraction wiggle
if (!prefersReducedMotion) {
  const iconContainers = document.querySelectorAll('.feature-card__icon');
  iconContainers.forEach((container) => {
    container.addEventListener('mouseenter', () => {
      container.style.transform = 'rotate(-4deg) scale(1.05)';
    });
    container.addEventListener('mouseleave', () => {
      container.style.transform = 'rotate(0deg) scale(1)';
    });
  });
}

// Close navigation on Escape key when open
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && header && navToggle && header.classList.contains('site-header--open')) {
    header.classList.remove('site-header--open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});
