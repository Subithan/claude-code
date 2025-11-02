const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
  }
);

document.querySelectorAll("[data-animate]").forEach((element) => {
  observer.observe(element);
});

const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const nav = document.querySelector(".nav");
let lastScroll = window.scrollY;

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;
  if (currentScroll > lastScroll && currentScroll > 120) {
    nav?.classList.add("nav--hidden");
  } else {
    nav?.classList.remove("nav--hidden");
  }
  lastScroll = currentScroll;
});
