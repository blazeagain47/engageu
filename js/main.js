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
