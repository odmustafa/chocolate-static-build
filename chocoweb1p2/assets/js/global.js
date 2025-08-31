// Global JavaScript for Chocolate & Art Show

(function() {
  'use strict';

  // Eventbrite Tracking - Attach to All Ticket Buttons
  function initEventbriteTracking() {
    const els = document.querySelectorAll('[data-eb-link]');
    els.forEach(el => {
      const base = el.dataset.ebLink;
      const aff = el.dataset.ebAff || 'dallas_site';
      const ref = el.dataset.ebRef || 'site_cta';
      
      try {
        const url = new URL(base);
        url.searchParams.set('aff', aff);
        url.searchParams.set('ref', ref);
        el.href = url.toString();
        el.rel = 'noopener';
        el.target = '_blank';
      } catch (error) {
        console.warn('Invalid Eventbrite URL:', base);
      }
    });
  }

  // Gmail Compose Links - Build Gmail compose URLs from data attributes
  function initGmailLinks() {
    const q = s => document.querySelectorAll(s);
    q('a[data-gmail]').forEach(a => {
      const to = a.getAttribute('to');
      const sub = encodeURIComponent(a.dataset.subject || '');
      const body = a.dataset.body || '';
      const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${sub}&body=${body}`;
      const mailto = `mailto:${to}?subject=${sub}&body=${body}`;
      
      a.href = gmail;
      a.target = '_blank';
      
      a.addEventListener('click', e => {
        // If Gmail blocked (e.g., no login), let the browser fall back to mailto after a timeout
        setTimeout(() => {
          a.href = mailto;
        }, 200);
      });
    });
  }

  // Hero Video - Lock start at 30s (mobile safe) and honor reduced-motion
  function initHeroVideo() {
    const v = document.getElementById('heroVid');
    if (!v) return;
    
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      v.removeAttribute('autoplay');
      v.pause();
      return;
    }
    
    v.addEventListener('loadedmetadata', () => {
      try {
        v.currentTime = 30;
      } catch (e) {
        console.warn('Could not set video start time');
      }
      v.play().catch(() => {
        console.warn('Video autoplay failed');
      });
    });
  }

  // Night Selector - Handle night button clicks with Eventbrite tracking
  function initNightSelector() {
    const live = document.querySelector('.night-select .sr');
    document.querySelectorAll('.night-select .night').forEach(btn => {
      const base = btn.dataset.ebLink;
      const ref = btn.dataset.ebRef || 'night';
      
      if (base) {
        try {
          const url = new URL(base);
          url.searchParams.set('aff', 'dallas_site');
          url.searchParams.set('ref', ref);
          
          if (btn.dataset.status === 'low' && live) {
            live.textContent = `${btn.dataset.date} is almost sold out.`;
          }
          
          btn.addEventListener('click', () => {
            window.open(url.toString(), '_blank', 'noopener');
          });
        } catch (error) {
          console.warn('Invalid night selector URL:', base);
        }
      }
    });
  }

  // Carousel Navigation - For artist detail pages
  function initCarouselNavigation() {
    const prevBtn = document.querySelector('.nav button[onclick*="scrollBy"]');
    const nextBtn = document.querySelector('.nav button[onclick*="scrollBy"]');
    const carousel = document.querySelector('.carousel');
    
    if (prevBtn && nextBtn && carousel) {
      // Remove inline onclick handlers and add proper event listeners
      prevBtn.removeAttribute('onclick');
      nextBtn.removeAttribute('onclick');
      
      prevBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: -500, behavior: 'smooth' });
      });
      
      nextBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: 500, behavior: 'smooth' });
      });
    }
  }

  // Accessibility - Keyboard navigation for custom elements
  function initAccessibility() {
    // Handle Enter key on buttons that aren't real buttons
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.matches('[role="button"]')) {
        e.target.click();
      }
    });

    // Announce dynamic content changes
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);

    // Store announcer globally for other scripts to use
    window.announceToScreenReader = function(message) {
      announcer.textContent = message;
      setTimeout(() => {
        announcer.textContent = '';
      }, 1000);
    };
  }

  // Lazy Loading - Enhanced lazy loading for images
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // Performance - Preload critical resources
  function initPerformanceOptimizations() {
    // Preload hero video poster
    const heroVideo = document.getElementById('heroVid');
    if (heroVideo && heroVideo.poster) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = heroVideo.poster;
      document.head.appendChild(link);
    }

    // Preload critical images
    const criticalImages = [
      '/assets/images/choco-logo.png'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  // Initialize all functionality when DOM is ready
  function init() {
    initEventbriteTracking();
    initGmailLinks();
    initHeroVideo();
    initNightSelector();
    initCarouselNavigation();
    initAccessibility();
    initLazyLoading();
    initPerformanceOptimizations();
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Handle page visibility changes (for video pause/play)
  document.addEventListener('visibilitychange', () => {
    const video = document.getElementById('heroVid');
    if (video) {
      if (document.hidden) {
        video.pause();
      } else if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        video.play().catch(() => {
          console.warn('Video play failed on visibility change');
        });
      }
    }
  });

})();
