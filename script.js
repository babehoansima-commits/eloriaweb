// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  
  // ===== NAVBAR SCROLL EFFECT =====
  const header = document.querySelector('.header');
  const heroContent = document.querySelector('.hero__content');
  
  function updateNavbar() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  
  window.addEventListener('scroll', updateNavbar);
  updateNavbar(); // Initial check
  
  // ===== MOBILE MENU TOGGLE =====
  const hamburger = document.querySelector('.header__hamburger');
  const mobileMenu = document.querySelector('.header__mobile-menu');
  
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
  }
  
  // ===== CLOSE MOBILE MENU ON LINK CLICK =====
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  
  // ===== HERO TEXT SPLIT ANIMATION (optionnel) =====
  // Déjà fait en CSS, mais on pourrait ajouter GSAP ici plus tard
  
});


// ===== SECTION 2 : CARROUSEL COMMUNAUTÉ =====
function initCommunityCarousel() {
  const track = document.getElementById('communityTrack');
  const slides = track ? Array.from(track.children) : [];
  const dots = document.querySelectorAll('#communityDots .dot');
  const prevBtn = document.getElementById('communityPrev');
  const nextBtn = document.getElementById('communityNext');
  
  if (!track || !slides.length) return;
  
  let currentIndex = 0;
  const totalSlides = slides.length;
  
  function updateCarousel(index, animated = true) {
    if (!track) return;
    
    if (!animated) {
      track.style.transition = 'none';
    } else {
      track.style.transition = 'transform 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.08)';
    }
    
    track.style.transform = `translateX(-${index * 100}%)`;
    
    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }
  
  function goToSlide(index) {
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }
    updateCarousel(currentIndex);
  }
  
  // Event listeners
  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
  
  // Dots
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => goToSlide(idx));
  });
  
  // Swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  track.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex - 1);
      }
    }
  }, { passive: true });
  
  // Initialisation
  updateCarousel(0, false);
  
  // Fix resize
  window.addEventListener('resize', () => {
    track.style.transition = 'none';
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    track.offsetHeight;
    track.style.transition = 'transform 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.08)';
  });
}

// ===== INTERSECTION OBSERVER (animation au scroll) =====
function initScrollAnimations() {
  const sections = document.querySelectorAll('.section-community');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });
  
  sections.forEach(section => observer.observe(section));
}

// Lancement au chargement
document.addEventListener('DOMContentLoaded', () => {
  initCommunityCarousel();
  initScrollAnimations();
});

// ===== SECTION 3 : ARTICLES & MODALS =====
function initArticles() {
  // Tous les boutons "Lire"
  const readButtons = document.querySelectorAll('.article-card__btn');
  const modals = document.querySelectorAll('.article-modal');
  const closeButtons = document.querySelectorAll('.article-modal__close');
  const body = document.body;
  
  // Ouvrir le modal correspondant
  readButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const articleId = this.dataset.article;
      const targetModal = document.getElementById(`article-${articleId}`);
      
      if (targetModal) {
        // Fermer tous les autres modals
        modals.forEach(modal => modal.classList.remove('active'));
        // Ouvrir celui-ci
        targetModal.classList.add('active');
        // Bloquer scroll
        body.classList.add('modal-open');
      }
    });
  });
  
  // Fermer avec le bouton retour
  closeButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const modal = this.closest('.article-modal');
      modal.classList.remove('active');
      body.classList.remove('modal-open');
    });
  });
  
  // Fermer en cliquant sur l'overlay
  modals.forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target.classList.contains('article-modal__overlay')) {
        this.classList.remove('active');
        body.classList.remove('modal-open');
      }
    });
  });
  
  // Fermer avec touche Echap
  window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.article-modal.active');
      if (activeModal) {
        activeModal.classList.remove('active');
        body.classList.remove('modal-open');
      }
    }
  });
}

// ===== SECTION 4 : SECOND CARROUSEL GALERIE =====
function initGalleryCarousel() {
  const track = document.getElementById('galleryTrack');
  const slides = track ? Array.from(track.children) : [];
  const dots = document.querySelectorAll('#galleryDots .gallery-dot');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');
  
  if (!track || !slides.length) return;
  
  let currentIndex = 0;
  const totalSlides = slides.length;
  
  function updateCarousel(index, animated = true) {
    if (!track) return;
    
    if (!animated) {
      track.style.transition = 'none';
    } else {
      track.style.transition = 'transform 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.08)';
    }
    
    track.style.transform = `translateX(-${index * 100}%)`;
    
    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }
  
  function goToSlide(index) {
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }
    updateCarousel(currentIndex);
  }
  
  // Event listeners
  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
  
  // Dots
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => goToSlide(idx));
  });
  
  // Swipe tactile
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  track.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex - 1);
      }
    }
  }, { passive: true });
  
  // Initialisation
  updateCarousel(0, false);
  
  // Fix resize
  window.addEventListener('resize', () => {
    track.style.transition = 'none';
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    track.offsetHeight;
    track.style.transition = 'transform 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.08)';
  });
}

// ===== MISE À JOUR DE L'INTERSECTION OBSERVER =====
function initScrollAnimations() {
  const sections = document.querySelectorAll('.section-community, .section-gallery');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });
  
  sections.forEach(section => observer.observe(section));
}

// ===== INIT GLOBALE MISE À JOUR =====
document.addEventListener('DOMContentLoaded', () => {
  initCommunityCarousel();
  initGalleryCarousel(); // <- Nouveau carrousel
  initArticles();
  initScrollAnimations();
});