document.addEventListener('DOMContentLoaded', () => {
    const content = document.querySelector('.whyus-content');
    const countersContainer = document.querySelector('.whyus-counters');
    const animateOnScroll = (element, className, threshold = 0.3) => {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            element.classList.add(className);
            obs.unobserve(element);
          }
        });
      }, { threshold });
      observer.observe(element);
    };
    animateOnScroll(content, 'animate');
    animateOnScroll(countersContainer, 'animate', 0.5);
    
    const counters = document.querySelectorAll('.counter');
    const duration = 2000;
    const animateCounters = (timestamp, startTime, countersArr) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      countersArr.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const suffix = counter.getAttribute('data-suffix') || '';
        const current = Math.floor(target * progress);
        counter.innerText = current + suffix;
      });
      if (progress < 1) {
        requestAnimationFrame((ts) => animateCounters(ts, startTime, countersArr));
      } else {
        countersArr.forEach(counter => {
          const target = counter.getAttribute('data-target');
          const suffix = counter.getAttribute('data-suffix') || '';
          counter.innerText = target + suffix;
        });
      }
    };
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          requestAnimationFrame((timestamp) => animateCounters(timestamp, timestamp, Array.from(counters)));
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterObserver.observe(countersContainer);
  });
  