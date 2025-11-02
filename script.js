const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

let particles = [];
const particleCount = 70;
const colors = ["#7c5bff", "#ff6ac1", "#3ad7ff", "#a1ffbf"];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);
resize();

class Particle {
  constructor() {
    this.init();
  }

  init() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2.8 + 0.5;
    this.speedX = Math.random() * 0.6 - 0.3;
    this.speedY = Math.random() * 0.6 - 0.3;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.alpha = Math.random() * 0.6 + 0.2;
    this.glowRadius = Math.random() * 12 + 8;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }

  draw() {
    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      this.size,
      this.x,
      this.y,
      this.glowRadius
    );
    const alphaHex = Math.floor(this.alpha * 255)
      .toString(16)
      .padStart(2, "0");
    gradient.addColorStop(0, `${this.color}${alphaHex}`);
    gradient.addColorStop(1, "transparent");

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(this.x, this.y, this.glowRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha + 0.15;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function connectParticles() {
  let opacityThreshold = 120;

  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < opacityThreshold) {
        ctx.beginPath();
        const alpha = 1 - distance / opacityThreshold;
        ctx.strokeStyle = `rgba(124, 91, 255, ${alpha * 0.35})`;
        ctx.lineWidth = 0.6;
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

function createParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  connectParticles();

  requestAnimationFrame(animate);
}

createParticles();
animate();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.2,
  }
);

document.querySelectorAll(".feature-card, .timeline-card, .testimonial-grid figure").forEach((el) => {
  observer.observe(el);
});
