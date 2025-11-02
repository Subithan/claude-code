const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
const particles = [];
const STAR_COUNT = 120;
const MAX_SIZE = 2.4;
const COLORS = ['#7d5cf6', '#29d9c2', '#ff6ec7', '#8f84ff'];

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function createParticle() {
  const orbitRadius = Math.random() * Math.max(window.innerWidth, window.innerHeight);
  return {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * MAX_SIZE + 0.4,
    speed: Math.random() * 0.4 + 0.1,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: Math.random() * 0.6 + 0.3,
    angle: Math.random() * Math.PI * 2,
    orbitRadius,
    orbitSpeed: (Math.random() * 0.002 + 0.0005) * (Math.random() > 0.5 ? 1 : -1)
  };
}

function initParticles() {
  particles.length = 0;
  for (let i = 0; i < STAR_COUNT; i += 1) {
    particles.push(createParticle());
  }
}

function drawParticle(particle) {
  ctx.save();
  ctx.globalAlpha = particle.alpha;
  ctx.fillStyle = particle.color;
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function updateParticle(particle) {
  particle.angle += particle.orbitSpeed;
  particle.x += Math.cos(particle.angle) * particle.speed;
  particle.y += Math.sin(particle.angle) * particle.speed;

  if (
    particle.x < -10 ||
    particle.x > window.innerWidth + 10 ||
    particle.y < -10 ||
    particle.y > window.innerHeight + 10
  ) {
    Object.assign(particle, createParticle(), {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight
    });
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => {
    drawParticle(particle);
    updateParticle(particle);
  });
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

resizeCanvas();
initParticles();
animate();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  },
  {
    threshold: 0.2
  }
);

document.querySelectorAll('.feature-card, .glow-card, .testimonial-card, .cta__inner').forEach((element) => {
  element.classList.add('reveal');
  observer.observe(element);
});
