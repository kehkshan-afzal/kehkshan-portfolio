// Load Lucide icons after the page is ready.
window.addEventListener('load', () => {
  if (window.lucide) window.lucide.createIcons();
});

document.documentElement.classList.add('js');
const $ = (selector, el = document) => el.querySelector(selector);
const $$ = (selector, el = document) => [...el.querySelectorAll(selector)];

// Animated role text in the hero section.
const words = ['Frontend Developer', 'AI Developer', 'Python Developer'];
const typed = $('#typed');

if (typed && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let wordIndex = 0;
  let charIndex = words[0].length;
  let deleting = true;

  (function typeLoop() {
    const word = words[wordIndex];
    typed.textContent = word.slice(0, charIndex);
    let delay = deleting ? 45 : 95;

    if (!deleting && charIndex === word.length) {
      deleting = true;
      delay = 1600;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 350;
    } else {
      charIndex += deleting ? -1 : 1;
    }
    window.setTimeout(typeLoop, delay);
  })();
}

// Mobile navigation menu.
const links = $('#links');
const menuButton = $('#menuBtn');

if (links && menuButton) {
  menuButton.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  $$('#links a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open menu');
    });
  });
}

// Reveal sections as they enter the viewport.
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  $$('.reveal').forEach(element => revealObserver.observe(element));

  // Highlight the current section in the navigation.
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $$('#links a').forEach(link => {
          link.classList.toggle('active', link.hash === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  $$('section[id]').forEach(section => sectionObserver.observe(section));
} else {
  $$('.reveal').forEach(element => element.classList.add('in'));
}

// Small on-screen notification.
const toast = $('#toast');
let toastTimer;

function say(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2400);
}

// Project links are placeholders until real GitHub/demo URLs are added.
$$('.ph').forEach(link => {
  link.addEventListener('click', event => {
    if (link.getAttribute('href') === '#') {
      event.preventDefault();
      say('Add your project link in index.html first.');
    }
  });
});

// Copy the contact email.
const copyButton = $('#copyMail');
if (copyButton) {
  copyButton.addEventListener('click', async () => {
    const emailLink = $('a[href^="mailto:"]');
    const email = emailLink ? emailLink.getAttribute('href').replace('mailto:', '') : '';

    if (!email || email === 'your.email@example.com') {
      say('Add your email address in index.html first.');
      return;
    }

    try {
      await navigator.clipboard.writeText(email);
      say('Email copied!');
    } catch {
      say('Copy failed. Please copy the email manually.');
    }
  });
}

// Current year in the footer.
const year = $('#year');
if (year) year.textContent = new Date().getFullYear();
