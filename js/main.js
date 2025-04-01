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

function smoothScrollTo(target, duration) {
  const startY = window.pageYOffset;
  const offset = 70; // adjust if your navbar is taller/shorter
  const targetY = target.getBoundingClientRect().top + window.pageYOffset - offset;
  const distance = targetY - startY;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
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
  navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// ===== BOUNCING META LOGO IN "HOW WE DO IT" SECTION =====
const bouncingContainer = document.querySelector('.bouncing-container');
const bouncingLogo = document.querySelector('.bouncing-logo');

if (bouncingContainer && bouncingLogo) {
  let bounceStarted = false; // ensure the bounce triggers only once

  // IntersectionObserver: start bounce when container is in view
  const containerObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !bounceStarted) {
        bounceStarted = true;
        obs.unobserve(entry.target);
        startBounce();
      }
    });
  }, { threshold: 0.1 });

  containerObserver.observe(bouncingContainer);

  function startBounce() {
    // Remove the default center positioning so we can set random positions
    bouncingLogo.style.top = '0';
    bouncingLogo.style.left = '0';
    bouncingLogo.style.transform = 'none';

    // Grab container & logo dimensions
    const containerWidth = bouncingContainer.clientWidth;
    const containerHeight = bouncingContainer.clientHeight;
    const logoWidth = bouncingLogo.clientWidth;
    const logoHeight = bouncingLogo.clientHeight;

    // Random starting position within container
    let xPos = Math.random() * (containerWidth - logoWidth);
    let yPos = Math.random() * (containerHeight - logoHeight);

    // Random speeds & directions (range ~1–3)
    let xSpeed = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 2 + 1);
    let ySpeed = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 2 + 1);

    // Immediately jump to random start position
    bouncingLogo.style.transform = `translate(${xPos}px, ${yPos}px)`;

    function bounceLogo() {
      // Re-check in case container is resized
      const cWidth = bouncingContainer.clientWidth;
      const cHeight = bouncingContainer.clientHeight;
      const lWidth = bouncingLogo.clientWidth;
      const lHeight = bouncingLogo.clientHeight;

      xPos += xSpeed;
      yPos += ySpeed;

      // Bounce off left/right edges
      if (xPos <= 0) {
        xPos = 0;
        xSpeed = -xSpeed;
      } else if (xPos + lWidth >= cWidth) {
        xPos = cWidth - lWidth;
        xSpeed = -xSpeed;
      }

      // Bounce off top/bottom edges
      if (yPos <= 0) {
        yPos = 0;
        ySpeed = -ySpeed;
      } else if (yPos + lHeight >= cHeight) {
        yPos = cHeight - lHeight;
        ySpeed = -ySpeed;
      }

      // Apply new position
      bouncingLogo.style.transform = `translate(${xPos}px, ${yPos}px)`;
      requestAnimationFrame(bounceLogo);
    }

    // Begin bouncing loop
    bounceLogo();
  }
}
