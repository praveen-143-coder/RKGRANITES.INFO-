/* Core interactions: nav toggle, smooth scroll, product modal, lightbox gallery, floating WA update */
document.addEventListener('DOMContentLoaded', () => {
  // set year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // NAV TOGGLE for mobile
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    if (mainNav.style.display === 'flex') {
      mainNav.style.display = '';
    } else {
      mainNav.style.display = 'flex';
      mainNav.style.flexDirection = 'column';
      mainNav.style.alignItems = 'flex-end';
      mainNav.style.gap = '12px';
    }
  });

  // Smooth scroll for nav links
  document.querySelectorAll('.main-nav a, .hero-actions a, .btn-ghost[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({behavior: 'smooth', block: 'start'});
        // close mobile nav
        if (window.innerWidth <= 980 && mainNav.style.display === 'flex') {
          mainNav.style.display = '';
          navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  /* ---------- Product Modal ---------- */
  const modal = document.getElementById('productModal');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalImage = document.getElementById('modalImage');
  const modalDesc = document.getElementById('modalDesc');
  const modalWhats = document.getElementById('modalWhats');

  function openProduct(card) {
    const name = card.dataset.name || card.querySelector('h4')?.textContent;
    const img = card.dataset.img || card.querySelector('img')?.src;
    const desc = card.dataset.desc || card.querySelector('p')?.textContent;

    modalTitle.textContent = name || '';
    modalImage.src = img || '';
    modalImage.alt = name || '';
    modalDesc.textContent = desc || '';
    // WhatsApp link encoded
    const waText = encodeURIComponent(`Hello RK Granites, I'm interested in ${name}. Please share details.`);
    modalWhats.href = `https://wa.me/919390460800?text=${waText}`;

    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // lock scroll
  }

  function closeModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // attach openers
  document.querySelectorAll('.product').forEach(card => {
    const button = card.querySelector('.link-more');
    button.addEventListener('click', (e) => {
      e.preventDefault();
      openProduct(card);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') openProduct(card);
    });
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  /* ---------- Lightbox for project gallery ---------- */
  const galleryImgs = Array.from(document.querySelectorAll('.gallery img, .project-gallery img, .gallery-img'));
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lb-image');
  const lbClose = document.querySelector('.lb-close');
  const lbPrev = document.querySelector('.lb-prev');
  const lbNext = document.querySelector('.lb-next');

  let galleryIndex = -1;
  const sources = galleryImgs.map(img => img.dataset.full || img.src);

  galleryImgs.forEach((img, i) => {
    img.addEventListener('click', () => {
      galleryIndex = i;
      lbImage.src = img.dataset.full || img.src;
      openLightbox();
    });
  });

  function openLightbox(){ lightbox.classList.add('show'); lightbox.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
  function closeLightbox(){ lightbox.classList.remove('show'); lightbox.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
  function showIndex(i){
    if (i < 0) i = sources.length - 1;
    if (i >= sources.length) i = 0;
    galleryIndex = i;
    lbImage.src = sources[galleryIndex];
  }

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev) lbPrev.addEventListener('click', () => showIndex(galleryIndex - 1));
  if (lbNext) lbNext.addEventListener('click', () => showIndex(galleryIndex + 1));
  if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('show')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showIndex(galleryIndex - 1);
      if (e.key === 'ArrowRight') showIndex(galleryIndex + 1);
    }
    if (modal.classList.contains('show') && e.key === 'Escape') closeModal();
  });

  /* ---------- Accessibility: focus trap for modal (basic) ---------- */
  // (For larger projects use a robust focus-trap library)
  modal.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      const focusable = modal.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"]),input,textarea');
      const first = focusable[0], last = focusable[focusable.length -1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Minor: close mobile nav on resize if necessary ---------- */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) mainNav.style.display = '';
  });
});
