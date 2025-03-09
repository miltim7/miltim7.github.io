document.addEventListener('DOMContentLoaded', function () {
  function getLanguageFromPath() {
    const path = window.location.pathname;
    if (path.startsWith('/ru')) return 'ru';
    if (path.startsWith('/az')) return 'az';
    return 'en';
  }
  function updatePathForLanguage(path, lang) {
    if (path.startsWith('/ru')) {
      path = path.slice(3) || '/';
    } else if (path.startsWith('/az')) {
      path = path.slice(3) || '/';
    }
    if (!path.startsWith('/')) path = '/' + path;
    return lang === 'en' ? path : '/' + lang + path;
  }
  const currentLang = getLanguageFromPath();
  const storedLang = localStorage.getItem('language');
  if (storedLang && storedLang !== currentLang) {
    const newPath = updatePathForLanguage(window.location.pathname, storedLang);
    window.location.pathname = newPath;
  } else {
    localStorage.setItem('language', currentLang);
  }
  const langSelects = document.querySelectorAll('#lang-switcher-desktop, #lang-switcher-mobile');
  langSelects.forEach(select => {
    select.value = currentLang;
    select.addEventListener('change', function () {
      const selectedLang = this.value;
      localStorage.setItem('language', selectedLang);
      const newPath = updatePathForLanguage(window.location.pathname, selectedLang);
      window.location.pathname = newPath;
    });
  });
  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const navbar = document.querySelector('.navbar');
  function updateNavbarTransparency() {
    const logoImg = document.querySelector('.logo img');
    if (window.pageYOffset === 0) {
      navbar.classList.add('transparent');
      logoImg.src = '../assets/images/logo2.png';
    } else {
      navbar.classList.remove('transparent');
      logoImg.src = '../assets/images/logo.png';
    }
  }
  updateNavbarTransparency();
  window.addEventListener('scroll', updateNavbarTransparency);

  function openMobileMenu() {
    if (navbar) {
      const navbarHeight = navbar.offsetHeight;
      mobileMenu.style.top = navbarHeight + 'px';
      mobileMenu.style.height = `calc(100vh - ${navbarHeight}px)`;
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      document.body.classList.toggle('menu-open');
      if (mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  window.addEventListener('resize', function () {
    if (mobileMenu.classList.contains('open') && navbar) {
      const navbarHeight = navbar.offsetHeight;
      mobileMenu.style.top = navbarHeight + 'px';
      mobileMenu.style.height = `calc(100vh - ${navbarHeight}px)`;
    }
  });

  const scrollLinks = document.querySelectorAll('[data-target]');
  scrollLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        if (mobileMenu && mobileMenu.classList.contains('open')) {
          closeMobileMenu();
          document.body.classList.remove('menu-open');
        }
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        const targetPosition = targetSection.offsetTop - navbarHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        updateActiveLink(targetId);
      }
    });
  });

  const featureItems = document.querySelectorAll('.feature-item');
  featureItems.forEach(item => {
    const header = item.querySelector('.feature-header');
    const toggleBtn = item.querySelector('.toggle-btn');
    if (header && toggleBtn) {
      header.addEventListener('click', function () {
        item.classList.toggle('active');
        if (item.classList.contains('active')) {
          toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron-up"><path d="m18 15-6-6-6 6"/></svg>';
        } else {
          toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron-down"><path d="m6 9 6 6 6-6"/></svg>';
        }
      });
    }
  });

  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const delay = element.getAttribute('data-delay') || 0;
          setTimeout(() => {
            element.classList.add('visible');
          }, delay);
          observer.unobserve(element);
        }
      });
    }, { threshold: 0.1 });
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }

  function updateActiveLink(sectionId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      if (link.getAttribute('data-target') === sectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', function () {
    const scrollPosition = window.scrollY + window.innerHeight / 3;
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        updateActiveLink(section.id);
      }
    });
  });

  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Спасибо за вашу заявку! Мы свяжемся с вами в ближайшее время.');
      contactForm.reset();
    });
  }

  window.addEventListener('scroll', function () {
    const scrollPosition = window.pageYOffset;
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
      const aboutSectionTop = aboutSection.offsetTop;
      const aboutSectionHeight = aboutSection.offsetHeight;
      if (scrollPosition > aboutSectionTop - window.innerHeight && scrollPosition < aboutSectionTop + aboutSectionHeight) {
        const speed = 0.1;
        const yPos = -(scrollPosition - aboutSectionTop) * speed;
        aboutSection.style.backgroundPosition = `center ${yPos}px`;
      }
    }
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      const speed = 0.5;
      const yPos = scrollPosition * speed;
      heroSection.style.backgroundPositionY = `calc(50% + ${yPos * 0.1}px)`;
    }
    const whyUsSection = document.querySelector('.why-us-section');
    if (whyUsSection) {
      const speed = 0.05;
      const yPos = scrollPosition * speed;
      whyUsSection.style.backgroundPositionY = `${-yPos}px`;
    }
    const serviceSections = document.querySelectorAll('.service-section');
    serviceSections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition > sectionTop - window.innerHeight && scrollPosition < sectionTop + sectionHeight) {
        const speed = 0.08;
        const yPos = -(scrollPosition - sectionTop) * speed;
        section.style.backgroundPosition = `center ${yPos}px`;
      }
    });
  });

  const serviceBlocks = document.querySelectorAll('.service-block');
  serviceBlocks.forEach(block => {
    block.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-10px)';
      this.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.1)';
    });
    block.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.05)';
    });
  });

  const serviceIcons = document.querySelectorAll('.service-icon');
  serviceIcons.forEach(icon => {
    icon.addEventListener('mouseenter', function () {
      this.style.transform = 'scale(1.1) rotate(5deg)';
    });
    icon.addEventListener('mouseleave', function () {
      this.style.transform = 'scale(1) rotate(0)';
    });
  });

  const servicesToggle = document.querySelector('.mobile-menu .services-toggle');
  const servicesMobileMenu = document.querySelector('.mobile-menu .services-mobile-menu');
  if (servicesToggle && servicesMobileMenu) {
    servicesToggle.addEventListener('click', function () {
      servicesMobileMenu.style.display = servicesMobileMenu.style.display === 'flex' ? 'none' : 'flex';
    });
  }
});
