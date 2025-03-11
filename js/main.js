// 1. Sticky Navbar on Scroll
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.querySelector('.navbar').classList.add('scrolled');
  } else {
    header.querySelector('.navbar').classList.remove('scrolled');
  }
});

// 2. Scroll Reveal with IntersectionObserver
const hiddenElements = document.querySelectorAll('.hidden');

const observerOptions = {
  threshold: 0.15,
};

const revealOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

hiddenElements.forEach(el => {
  revealOnScroll.observe(el);
});

// 3. Custom Smooth Scroll for Slower Animation
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    // Ignore external or empty links
    if (link.getAttribute('href') === '#' || link.getAttribute('target') === '_blank') return;
    
    e.preventDefault();
    const targetID = link.getAttribute('href');
    const targetEl = document.querySelector(targetID);
    if (!targetEl) return;

    // Smoothly scroll to the target element
    smoothScrollTo(targetEl, 1500); // 1500 ms = 1.5 second scroll
  });
});

/**
 * Smoothly scrolls the window to the target element over 'duration' ms.
 * You can tweak the easing function for different effects.
 */
function smoothScrollTo(target, duration) {
  const startY = window.pageYOffset;
  // offset to avoid the navbar overlap, if needed
  const offset = 70; // adjust if your navbar is taller/shorter
  const targetY = target.getBoundingClientRect().top + window.pageYOffset - offset;
  const distance = targetY - startY;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Easing: easeInOutQuad
    const easedProgress = easeInOutQuad(progress);

    window.scrollTo(0, startY + distance * easedProgress);

    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  }

  function easeInOutQuad(t) {
    return t < 0.5
      ? 2 * t * t
      : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  requestAnimationFrame(animation);
}

// ===== MOBILE NAV TOGGLE =====
const menuIcon = document.getElementById('menuIcon');
const navLinks = document.getElementById('navLinks');

menuIcon.addEventListener('click', () => {
  // Toggle the 'active' class to show/hide nav links
  navLinks.classList.toggle('active');
});

// Optional: Close the mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});
