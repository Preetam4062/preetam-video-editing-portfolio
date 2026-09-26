import './style.css';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { contactInfo } from './contactData.js';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Initialize Lucide Icons
if (window.lucide) {
  window.lucide.createIcons();
}

// -----------------------------------------------------------------
// PRELOADER SYSTEM
// -----------------------------------------------------------------
const preloader = document.getElementById('preloader');
const loaderBar = document.getElementById('loader-bar');
const loaderPercentage = document.getElementById('loader-percentage');
const loaderStatus = document.getElementById('loader-status');

const statusMessages = [
  'Initializing timeline...',
  'Importing raw footage...',
  'Slicing transitions...',
  'Adding motion templates...',
  'Color grading HDR colors...',
  'Syncing sound effects...',
  'Compiling render pipelines...',
  'Finalizing final cut...'
];

let progress = 0;

function updatePreloader() {
  const increment = Math.floor(Math.random() * 8) + 2;
  progress = Math.min(progress + increment, 100);
  
  loaderBar.style.width = `${progress}%`;
  loaderPercentage.textContent = `${progress}%`;
  
  const msgIdx = Math.min(Math.floor((progress / 100) * statusMessages.length), statusMessages.length - 1);
  loaderStatus.textContent = statusMessages[msgIdx];
  
  if (progress < 100) {
    setTimeout(updatePreloader, Math.random() * 80 + 30);
  } else {
    setTimeout(exitPreloader, 400);
  }
}

function exitPreloader() {
  const tl = gsap.timeline({
    onComplete: () => {
      preloader.style.display = 'none';
      initScrollAnimations();
    }
  });

  tl.to(preloader, {
    opacity: 0,
    duration: 0.8,
    ease: 'power3.inOut'
  });

  tl.from('.logo', {
    y: -30,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.4');

  tl.from('.nav-link, .nav-cta', {
    y: -30,
    opacity: 0,
    stagger: 0.08,
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.5');

  tl.from('#hero-section .reveal-up', {
    y: 50,
    opacity: 0,
    stagger: 0.15,
    duration: 1,
    ease: 'power3.out'
  }, '-=0.4');

  tl.add(() => {
    initCounters();
  }, '-=0.2');
}

window.addEventListener('DOMContentLoaded', () => {
  updatePreloader();
});

// -----------------------------------------------------------------
// LENIS SMOOTH SCROLLING
// -----------------------------------------------------------------
let lenis;
function initSmoothScroll() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.1,
    touchMultiplier: 1.5,
    infinite: false,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}
initSmoothScroll();

// -----------------------------------------------------------------
// CUSTOM INTERACTIVE CURSOR & MOUSE GLOW
// -----------------------------------------------------------------
const cursor = document.getElementById('custom-cursor');
const cursorGlow = document.getElementById('custom-cursor-glow');
const cursorText = document.getElementById('custom-cursor-text');
const mouseGlow = document.getElementById('mouse-glow');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorX = mouseX;
let cursorY = mouseY;
let glowX = mouseX;
let glowY = mouseY;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  mouseGlow.style.left = `${e.pageX}px`;
  mouseGlow.style.top = `${e.pageY}px`;
});

gsap.ticker.add(() => {
  cursorX += (mouseX - cursorX) * 0.25;
  cursorY += (mouseY - cursorY) * 0.25;
  
  glowX += (mouseX - glowX) * 0.12;
  glowY += (mouseY - glowY) * 0.12;
  
  cursor.style.left = `${cursorX}px`;
  cursor.style.top = `${cursorY}px`;
  
  cursorGlow.style.left = `${glowX}px`;
  cursorGlow.style.top = `${glowY}px`;
});

function setupCursorHovers() {
  const links = document.querySelectorAll('a, button, .filter-btn, .project-card, .showreel-wrap');
  
  links.forEach(item => {
    item.addEventListener('mouseenter', () => {
      cursor.classList.add('hovering');
      cursorGlow.classList.add('hovering');
      
      if (item.classList.contains('project-card') || item.closest('.project-card')) {
        cursorGlow.classList.add('text-mode');
        cursorText.textContent = 'PLAY';
      } else if (item.classList.contains('showreel-wrap') || item.closest('.showreel-wrap')) {
        cursorGlow.classList.add('text-mode');
        cursorText.textContent = 'PLAY';
      }
    });
    
    item.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovering');
      cursorGlow.classList.remove('hovering');
      cursorGlow.classList.remove('text-mode');
    });
  });

  window.addEventListener('mousedown', () => {
    cursorGlow.classList.add('clicking');
  });

  window.addEventListener('mouseup', () => {
    cursorGlow.classList.remove('clicking');
  });
}
setupCursorHovers();

// -----------------------------------------------------------------
// MOUSE PARALLAX EFFECT (HERO & FLOATING ELEMENTS)
// -----------------------------------------------------------------
function setupMouseParallax() {
  const heroSection = document.getElementById('hero-section');
  if (!heroSection) return;

  heroSection.addEventListener('mousemove', (e) => {
    const { width, height } = heroSection.getBoundingClientRect();
    const x = (e.clientX - width / 2) / (width / 2);
    const y = (e.clientY - height / 2) / (height / 2);

    // Subtle background video shift
    gsap.to('.hero-bg-video', {
      x: x * 15,
      y: y * 15,
      duration: 0.8,
      ease: 'power2.out'
    });

    // Opposite motion for floating elements
    gsap.to('.glass-el-1', { x: -x * 35, y: -y * 35, duration: 1, ease: 'power2.out' });
    gsap.to('.glass-el-2', { x: -x * 50, y: -y * 50, duration: 1.2, ease: 'power2.out' });
    gsap.to('.glass-el-3', { x: -x * 25, y: -y * 25, duration: 0.9, ease: 'power2.out' });
  });

  heroSection.addEventListener('mouseleave', () => {
    // Reset positions
    gsap.to('.hero-bg-video, .floating-glass-element', {
      x: 0,
      y: 0,
      duration: 1,
      ease: 'power2.out'
    });
  });
}
setupMouseParallax();

// -----------------------------------------------------------------
// MAGNETIC BUTTONS
// -----------------------------------------------------------------
function setupMagneticButtons() {
  const magneticItems = document.querySelectorAll('.btn, .nav-cta, .back-to-top, .social-icon-btn, .quick-contact-btn');
  
  magneticItems.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const bound = el.getBoundingClientRect();
      const x = e.clientX - bound.left - (bound.width / 2);
      const y = e.clientY - bound.top - (bound.height / 2);
      
      gsap.to(el, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.4)'
      });
    });
  });
}
setupMagneticButtons();

// -----------------------------------------------------------------
// GSAP SCROLL REVEALS
// -----------------------------------------------------------------
function initScrollAnimations() {
  ScrollTrigger.create({
    start: 'top -50px',
    onEnter: () => document.getElementById('header').classList.add('scrolled'),
    onLeaveBack: () => document.getElementById('header').classList.remove('scrolled'),
  });

  const revealUps = document.querySelectorAll('.reveal-up');
  revealUps.forEach(el => {
    gsap.fromTo(el, 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  const revealLefts = document.querySelectorAll('.reveal-left');
  revealLefts.forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: -60 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        }
      }
    );
  });

  const revealRights = document.querySelectorAll('.reveal-right');
  revealRights.forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: 60 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        }
      }
    );
  });

  const revealScales = document.querySelectorAll('.reveal-scale');
  revealScales.forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, scale: 0.94 },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        }
      }
    );
  });

  const processCards = document.querySelectorAll('.process-card');
  processCards.forEach((card, idx) => {
    gsap.from(card, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      delay: idx * 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#process',
        start: 'top 75%'
      }
    });
  });
}

// -----------------------------------------------------------------
// STATISTICS COUNTER ANIMATIONS (DYNAMIC SUFFIX SUPPORT)
// -----------------------------------------------------------------
function initCounters() {
  const counterElements = document.querySelectorAll('.stat-number, .showreel-stat-num');
  
  counterElements.forEach(counter => {
    const target = parseFloat(counter.getAttribute('data-target'));
    const suffix = counter.getAttribute('data-suffix') || '+';
    const isDecimal = target % 1 !== 0;
    
    const countObj = { val: 0 };
    
    gsap.to(countObj, {
      val: target,
      duration: 2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: counter,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        if (isDecimal) {
          counter.textContent = countObj.val.toFixed(1) + suffix;
        } else {
          counter.textContent = Math.floor(countObj.val) + suffix;
        }
      }
    });
  });
}

// -----------------------------------------------------------------
// PORTFOLIO FILTER SYSTEM
// -----------------------------------------------------------------
function setupPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const grid = document.querySelector('.projects-grid');

  function updateGridClass(filterValue) {
    if (!grid) return;
    if (filterValue === 'reels') {
      grid.classList.add('reels-active');
    } else {
      grid.classList.remove('reels-active');
    }
  }

  // Filter on load based on active button (Short Form / Reels)
  const activeBtn = document.querySelector('.filter-btn.active');
  if (activeBtn) {
    const startFilter = activeBtn.getAttribute('data-filter');
    updateGridClass(startFilter);
    projectCards.forEach(card => {
      const cat = card.getAttribute('data-category');
      if (cat !== startFilter) {
        card.style.display = 'none';
        gsap.set(card, { scale: 0.95, opacity: 0 });
      } else {
        card.style.display = 'flex';
        gsap.set(card, { scale: 1, opacity: 1 });
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      updateGridClass(filterValue);

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        
        if (cat === filterValue) {
          gsap.killTweensOf(card);
          card.style.display = 'flex';
          gsap.fromTo(card,
            { scale: 0.95, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' }
          );
        } else {
          gsap.killTweensOf(card);
          gsap.to(card, {
            scale: 0.95,
            opacity: 0,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => { card.style.display = 'none'; }
          });
        }
      });
      
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);
    });
  });
}
setupPortfolioFilters();

// -----------------------------------------------------------------
// HOVER TO PLAY PROJECTS VIDEO PREVIEW
// -----------------------------------------------------------------
function setupProjectVideoHovers() {
  const mediaWraps = document.querySelectorAll('.project-media-wrap');
  
  mediaWraps.forEach(wrap => {
    const video = wrap.querySelector('.project-video');
    if (!video) return;
    let isHovered = false;
    
    wrap.addEventListener('mouseenter', () => {
      isHovered = true;
      if (video.readyState === 0) {
        video.load();
      }
      
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          if (!isHovered) {
            video.pause();
            video.currentTime = 0;
          }
        }).catch(error => {
          if (error.name !== 'AbortError') {
            console.log('Video preview autoplay prevented.', error);
          }
        });
      }
    });

    wrap.addEventListener('mouseleave', () => {
      isHovered = false;
      video.pause();
      video.currentTime = 0;
    });
  });
}
setupProjectVideoHovers();



// -----------------------------------------------------------------
// FULLSCREEN CINEMATIC VIDEO PLAYER MODAL & PROJECT CARDS ROUTING
// -----------------------------------------------------------------
function setupVideoModal() {
  const modal = document.getElementById('video-modal');
  const modalVideo = document.getElementById('modal-video');
  const modalClose = document.getElementById('modal-close');

  function openModal(url) {
    if (lenis) lenis.stop();
    
    modalVideo.src = url;
    modal.classList.add('active');
    modalVideo.load();
    
    const playPromise = modalVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log('Video modal playback failed:', error);
      });
    }
  }

  function closeModal() {
    if (lenis) lenis.start();
    modal.classList.remove('active');
    modalVideo.pause();
    modalVideo.src = '';
  }





  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}
setupVideoModal();

// -----------------------------------------------------------------
// DYNAMIC GLASSMORPHIC TOAST NOTIFICATION HELPERS
// -----------------------------------------------------------------
function showToast(message, isSuccess = true) {
  const existingToast = document.getElementById('contact-toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.id = 'contact-toast';
  toast.textContent = message;

  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '40px',
    right: '40px',
    backgroundColor: isSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
    border: isSuccess ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
    color: '#fff',
    padding: '16px 24px',
    borderRadius: '12px',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.95rem',
    fontWeight: '500',
    backdropFilter: 'blur(10px)',
    boxShadow: isSuccess 
      ? '0 10px 30px rgba(16, 185, 129, 0.1), 0 0 20px rgba(16, 185, 129, 0.05)'
      : '0 10px 30px rgba(239, 68, 68, 0.1), 0 0 20px rgba(239, 68, 68, 0.05)',
    zIndex: '9999',
    transform: 'translateY(20px)',
    opacity: '0',
    transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
  });

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  }, 50);

  setTimeout(() => {
    toast.style.transform = 'translateY(20px)';
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4000);
}

// -----------------------------------------------------------------
// CONTACT FORM SUBMISSION HANDLER WITH WEB3FORMS
// -----------------------------------------------------------------
function setupContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  if (!form) return;
  const submitBtn = form.querySelector('.submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const projectTypeSelect = document.getElementById('project-type');
    const messageInput = document.getElementById('message');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const projectType = projectTypeSelect.value;
    const message = messageInput.value.trim();

    // Required Field Validations
    if (!name) {
      showToast('Name is required.', false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showToast('Please enter a valid email address.', false);
      return;
    }

    if (!projectType) {
      showToast('Please select a project type.', false);
      return;
    }

    if (!message) {
      showToast('Message cannot be empty.', false);
      return;
    }

    // Disable button & show loader state
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
    submitBtn.disabled = true;

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: contactInfo.web3formsKey,
          name: name,
          email: email,
          project_type: projectType,
          message: message,
          subject: 'New Portfolio Inquiry'
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showToast('Thank you! Your message has been sent successfully.', true);
        form.reset();
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Web3Forms Error:', error);
      showToast('Something went wrong. Please try again.', false);
    } finally {
      submitBtn.innerHTML = originalContent;
      submitBtn.disabled = false;
    }
  });
}
setupContactForm();

// -----------------------------------------------------------------
// MOBILE NAV TOGGLE
// -----------------------------------------------------------------
function setupMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const nav = document.querySelector('.nav-links');
  
  toggle.addEventListener('click', () => {
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    
    if (nav.style.display === 'flex') {
      nav.style.flexDirection = 'column';
      nav.style.position = 'absolute';
      nav.style.top = '100%';
      nav.style.left = '0';
      nav.style.width = '100%';
      nav.style.backgroundColor = 'rgba(11, 11, 11, 0.95)';
      nav.style.backdropFilter = 'blur(15px)';
      nav.style.padding = '20px 40px';
      nav.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
      nav.style.gap = '20px';
    }
  });

  const navLinks = document.querySelectorAll('.nav-link, .nav-cta');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        nav.style.display = 'none';
      }
    });
  });
}
setupMobileMenu();
setupCursorHovers();

// -----------------------------------------------------------------
// CENTRALIZED CONTACT INFORMATION BINDING
// -----------------------------------------------------------------
function bindContactInfo() {
  const emailTextEl = document.getElementById('contact-email-text');
  const directEmailBtnEl = document.getElementById('contact-direct-email-btn');
  const whatsappBtnEl = document.getElementById('contact-whatsapp-btn');
  const instagramLinkEl = document.getElementById('contact-instagram-link');
  const linkedinLinkEl = document.getElementById('contact-linkedin-link');
  const youtubeLinkEl = document.getElementById('contact-youtube-link');
  const behanceLinkEl = document.getElementById('contact-behance-link');
  const locationTextEl = document.getElementById('contact-location-text');

  if (emailTextEl) {
    emailTextEl.href = `mailto:${contactInfo.email}`;
    emailTextEl.textContent = contactInfo.email;
  }
  if (directEmailBtnEl) {
    directEmailBtnEl.href = `mailto:${contactInfo.email}`;
  }
  if (whatsappBtnEl) {
    const cleanPhone = contactInfo.whatsapp.replace(/\D/g, '');
    whatsappBtnEl.href = `https://wa.me/${cleanPhone}?text=Hi%20Preetam,%20I'd%20like%20to%20discuss%20a%20video%20project!`;
  }
  if (instagramLinkEl) instagramLinkEl.href = contactInfo.instagram;
  if (linkedinLinkEl) linkedinLinkEl.href = contactInfo.linkedin;
  if (youtubeLinkEl) youtubeLinkEl.href = contactInfo.youtube;
  if (behanceLinkEl) behanceLinkEl.href = contactInfo.behance;
  if (locationTextEl) locationTextEl.textContent = contactInfo.location;
}
bindContactInfo();
