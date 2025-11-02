const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const card = entry.target;
        card.classList.add('in-view');
        observer.unobserve(card);
      }
    });
  },
  {
    threshold: 0.25,
  }
);

document.querySelectorAll('.feature-card, .testimonial-card, .floating-card').forEach((card, index) => {
  card.style.setProperty('--delay', `${index * 0.08}s`);
  observer.observe(card);
});

const numbers = document.querySelectorAll('.number');
let numbersAnimated = false;

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !numbersAnimated) {
        numbersAnimated = true;
        animateNumbers();
        countObserver.disconnect();
      }
    });
  },
  {
    threshold: 0.4,
  }
);

if (numbers.length) {
  countObserver.observe(numbers[0].closest('.stats'));
}

function animateNumbers() {
  numbers.forEach((num) => {
    const target = parseFloat(num.dataset.count);
    const duration = 1800;
    const start = performance.now();

    function update(currentTime) {
      const progress = Math.min((currentTime - start) / duration, 1);
      const eased = easeOutCubic(progress);
      const value = target > 100 ? Math.floor(target * eased) : (target * eased).toFixed(target % 1 === 0 ? 0 : 1);
      num.textContent = value;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  });
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

let lastScroll = 0;
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (current > lastScroll && current > 160) {
    nav.style.transform = 'translateY(-140%)';
  } else {
    nav.style.transform = 'translateY(0)';
  }
  lastScroll = current;
});

const floatingCards = document.querySelectorAll('.floating-card');

if (!prefersReducedMotion) {
  document.addEventListener('pointermove', (event) => {
    floatingCards.forEach((card) => {
      if (!card.classList.contains('in-view')) return;
      const rect = card.getBoundingClientRect();
      const relativeX = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
      const relativeY = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
      card.style.setProperty('--tilt-y', `${-relativeX * 10}deg`);
      card.style.setProperty('--tilt-x', `${relativeY * 10}deg`);
      card.style.setProperty('--hover-translate', `${relativeY * -10}px`);
    });
  });
}
