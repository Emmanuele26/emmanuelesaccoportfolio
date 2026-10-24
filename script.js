const header = document.querySelector('[data-header]');
const progress = document.querySelector('.scroll-progress span');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.primary-nav');
const cursorGlow = document.querySelector('.cursor-glow');
const toast = document.querySelector('.toast');

document.querySelector('[data-year]').textContent = new Date().getFullYear();

const updateScrollUI = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.transform = `scaleX(${ratio})`;
  header.classList.toggle('is-scrolled', window.scrollY > 28);
};

updateScrollUI();
window.addEventListener('scroll', updateScrollUI, { passive: true });

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  nav.classList.toggle('is-open', !isOpen);
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navToggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  });
});

document.querySelectorAll('.reveal').forEach((element) => {
  const delay = element.dataset.delay;
  if (delay) element.style.setProperty('--delay', `${delay}ms`);
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];

const activeSectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-38% 0px -55% 0px' });

sections.forEach((section) => activeSectionObserver.observe(section));

if (window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    cursorGlow.animate(
      { transform: `translate3d(${event.clientX - 280}px, ${event.clientY - 280}px, 0)` },
      { duration: 900, fill: 'forwards', easing: 'cubic-bezier(.2,.7,.2,1)' }
    );
  });
}

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      button.textContent = 'Copiata';
      toast.classList.add('is-visible');
      window.setTimeout(() => {
        button.textContent = 'Copia email';
        toast.classList.remove('is-visible');
      }, 2200);
    } catch {
      window.location.href = `mailto:${button.dataset.copy}`;
    }
  });
});
