// Schedule Page Functionality

(function() {
  'use strict';

  // Tab elements
  const tabButtons = document.querySelectorAll('.tab-btn');
  const scheduleDays = document.querySelectorAll('.schedule-day');

  // Initialize tab functionality
  function initTabs() {
    if (!tabButtons.length || !scheduleDays.length) return;

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetNight = btn.dataset.night;
        switchTab(targetNight, btn);
      });
    });

    // Keyboard navigation for tabs
    tabButtons.forEach((btn, index) => {
      btn.addEventListener('keydown', (e) => {
        let targetIndex;
        
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            targetIndex = index > 0 ? index - 1 : tabButtons.length - 1;
            tabButtons[targetIndex].focus();
            break;
          
          case 'ArrowRight':
            e.preventDefault();
            targetIndex = index < tabButtons.length - 1 ? index + 1 : 0;
            tabButtons[targetIndex].focus();
            break;
          
          case 'Home':
            e.preventDefault();
            tabButtons[0].focus();
            break;
          
          case 'End':
            e.preventDefault();
            tabButtons[tabButtons.length - 1].focus();
            break;
        }
      });
    });
  }

  // Switch between tabs
  function switchTab(targetNight, activeBtn) {
    // Update button states
    tabButtons.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    
    activeBtn.classList.add('active');
    activeBtn.setAttribute('aria-selected', 'true');

    // Update schedule day visibility
    scheduleDays.forEach(day => {
      day.classList.remove('active');
      day.setAttribute('aria-hidden', 'true');
    });

    const targetDay = document.getElementById(targetNight);
    if (targetDay) {
      targetDay.classList.add('active');
      targetDay.setAttribute('aria-hidden', 'false');
    }

    // Announce change to screen readers
    if (window.announceToScreenReader) {
      const dayName = targetNight === 'thursday' ? 'Thursday' : 'Friday';
      window.announceToScreenReader(`Switched to ${dayName} schedule`);
    }

    // Smooth scroll to schedule section
    const scheduleSection = targetDay || document.querySelector('.schedule-day.active');
    if (scheduleSection) {
      scheduleSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }

  // Timeline item animations on scroll
  function initScrollAnimations() {
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      // Observe timeline items
      const timelineItems = document.querySelectorAll('.timeline-item');
      timelineItems.forEach((item, index) => {
        // Set initial state
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        timelineObserver.observe(item);
      });
    }
  }

  // Add current time indicator (if event is happening today)
  function addCurrentTimeIndicator() {
    const now = new Date();
    const eventDate = new Date('2025-09-18'); // Thursday
    const eventDate2 = new Date('2025-09-19'); // Friday
    
    // Check if today is one of the event days
    const isEventDay = (
      now.toDateString() === eventDate.toDateString() ||
      now.toDateString() === eventDate2.toDateString()
    );

    if (!isEventDay) return;

    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute; // Convert to minutes

    // Event times in minutes from midnight
    const eventTimes = [
      { time: 19 * 60, element: null }, // 7:00 PM
      { time: 19.5 * 60, element: null }, // 7:30 PM
      { time: 20 * 60, element: null }, // 8:00 PM
      // Add more times as needed
    ];

    // Find the current or next event
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
      const timeText = item.querySelector('.time').textContent;
      const eventTime = parseTimeString(timeText);
      
      if (eventTime && currentTime >= eventTime && currentTime < eventTime + 60) {
        // Current event
        item.classList.add('current-event');
        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (eventTime && currentTime < eventTime) {
        // Upcoming event
        item.classList.add('upcoming-event');
      } else if (eventTime && currentTime > eventTime + 60) {
        // Past event
        item.classList.add('past-event');
      }
    });
  }

  // Parse time string to minutes
  function parseTimeString(timeStr) {
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return null;

    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3].toUpperCase();

    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    return hours * 60 + minutes;
  }

  // Export schedule data (for future API integration)
  function getScheduleData() {
    const scheduleData = {
      thursday: [],
      friday: []
    };

    scheduleDays.forEach(day => {
      const dayName = day.id;
      const timelineItems = day.querySelectorAll('.timeline-item');
      
      timelineItems.forEach(item => {
        const time = item.querySelector('.time').textContent;
        const title = item.querySelector('h3').textContent;
        const description = item.querySelector('p').textContent;
        
        scheduleData[dayName].push({
          time,
          title,
          description
        });
      });
    });

    return scheduleData;
  }

  // Initialize everything when DOM is ready
  function init() {
    initTabs();
    initScrollAnimations();
    addCurrentTimeIndicator();

    // Set up ARIA attributes
    tabButtons.forEach((btn, index) => {
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      btn.setAttribute('aria-controls', btn.dataset.night);
    });

    scheduleDays.forEach((day, index) => {
      day.setAttribute('role', 'tabpanel');
      day.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
    });

    // Make schedule data available globally (for debugging or API)
    window.getScheduleData = getScheduleData;
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Handle hash changes (for direct linking to specific days)
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    if (hash === 'thursday' || hash === 'friday') {
      const targetBtn = document.querySelector(`[data-night="${hash}"]`);
      if (targetBtn) {
        switchTab(hash, targetBtn);
      }
    }
  });

  // Check for hash on initial load
  window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    if (hash === 'thursday' || hash === 'friday') {
      const targetBtn = document.querySelector(`[data-night="${hash}"]`);
      if (targetBtn) {
        switchTab(hash, targetBtn);
      }
    }
  });

})();
