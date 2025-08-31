// Gallery Lightbox Functionality

(function() {
  'use strict';

  // Lightbox elements
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.querySelector('.lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDescription = document.getElementById('lightbox-description');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxOverlay = document.querySelector('.lightbox-overlay');

  // Gallery items
  const galleryItems = document.querySelectorAll('.gallery-item');

  // Initialize lightbox functionality
  function initLightbox() {
    if (!lightbox || !lightboxImage) return;

    // Add click listeners to gallery items
    galleryItems.forEach((item, index) => {
      const trigger = item.querySelector('.lightbox-trigger');
      const img = item.querySelector('img');
      const title = item.querySelector('h3');
      const description = item.querySelector('p');

      if (trigger && img) {
        trigger.addEventListener('click', () => {
          openLightbox(img, title, description, index);
        });

        // Also allow clicking on the image itself
        img.addEventListener('click', () => {
          openLightbox(img, title, description, index);
        });
      }
    });

    // Close lightbox listeners
    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxOverlay) {
      lightboxOverlay.addEventListener('click', closeLightbox);
    }

    // Keyboard navigation
    document.addEventListener('keydown', handleKeydown);
  }

  // Open lightbox with image
  function openLightbox(img, title, description, index) {
    if (!lightbox || !lightboxImage) return;

    // Set image source and alt text
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;

    // Set caption content
    if (lightboxTitle && title) {
      lightboxTitle.textContent = title.textContent;
    }

    if (lightboxDescription && description) {
      lightboxDescription.textContent = description.textContent;
    }

    // Show lightbox
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');

    // Focus management
    lightboxClose?.focus();

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Store current index for navigation
    lightbox.dataset.currentIndex = index;

    // Announce to screen readers
    if (window.announceToScreenReader) {
      window.announceToScreenReader(`Opened lightbox showing ${title?.textContent || 'image'}`);
    }
  }

  // Close lightbox
  function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');

    // Restore body scroll
    document.body.style.overflow = '';

    // Return focus to the trigger that opened the lightbox
    const currentIndex = parseInt(lightbox.dataset.currentIndex);
    if (!isNaN(currentIndex) && galleryItems[currentIndex]) {
      const trigger = galleryItems[currentIndex].querySelector('.lightbox-trigger');
      trigger?.focus();
    }

    // Announce to screen readers
    if (window.announceToScreenReader) {
      window.announceToScreenReader('Closed lightbox');
    }
  }

  // Handle keyboard navigation
  function handleKeydown(e) {
    if (!lightbox.classList.contains('active')) return;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        closeLightbox();
        break;
      
      case 'ArrowLeft':
        e.preventDefault();
        navigateLightbox(-1);
        break;
      
      case 'ArrowRight':
        e.preventDefault();
        navigateLightbox(1);
        break;
      
      case 'Tab':
        // Trap focus within lightbox
        trapFocus(e);
        break;
    }
  }

  // Navigate between images in lightbox
  function navigateLightbox(direction) {
    const currentIndex = parseInt(lightbox.dataset.currentIndex);
    if (isNaN(currentIndex)) return;

    let newIndex = currentIndex + direction;

    // Wrap around
    if (newIndex < 0) {
      newIndex = galleryItems.length - 1;
    } else if (newIndex >= galleryItems.length) {
      newIndex = 0;
    }

    const newItem = galleryItems[newIndex];
    if (newItem) {
      const img = newItem.querySelector('img');
      const title = newItem.querySelector('h3');
      const description = newItem.querySelector('p');

      if (img) {
        openLightbox(img, title, description, newIndex);
      }
    }
  }

  // Trap focus within lightbox
  function trapFocus(e) {
    const focusableElements = lightbox.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  }

  // Lazy loading enhancement for gallery images
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // Add loading animation
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            
            // Load image
            const tempImg = new Image();
            tempImg.onload = () => {
              img.src = tempImg.src;
              img.style.opacity = '1';
            };
            tempImg.src = img.dataset.src || img.src;
            
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px'
      });

      // Observe all gallery images
      galleryItems.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
          imageObserver.observe(img);
        }
      });
    }
  }

  // Gallery filter functionality (for future enhancement)
  function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        
        // Update active state
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter gallery items
        galleryItems.forEach(item => {
          if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });

        // Announce filter change
        if (window.announceToScreenReader) {
          window.announceToScreenReader(`Filtered gallery to show ${category === 'all' ? 'all items' : category + ' items'}`);
        }
      });
    });
  }

  // Initialize everything when DOM is ready
  function init() {
    initLightbox();
    initLazyLoading();
    initFilters();
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Handle page visibility changes (pause any animations)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && lightbox.classList.contains('active')) {
      // Optionally close lightbox when page becomes hidden
      // closeLightbox();
    }
  });

})();
