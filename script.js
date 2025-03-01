document.addEventListener('DOMContentLoaded', function () {
    // Set current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Mobile menu toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function () {
            document.body.classList.toggle('menu-open');

            if (mobileMenu.style.display === 'flex') {
                mobileMenu.style.display = 'none';
            } else {
                mobileMenu.style.display = 'flex';
            }
        });
    }

    // Smooth scrolling for navigation links
    const scrollLinks = document.querySelectorAll('[data-target]');

    scrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Close mobile menu if open
                if (mobileMenu && mobileMenu.style.display === 'flex') {
                    mobileMenu.style.display = 'none';
                    document.body.classList.remove('menu-open');
                }

                // Scroll to section
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = targetSection.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update active link
                updateActiveLink(targetId);
            }
        });
    });

    // Feature items toggle
    const featureItems = document.querySelectorAll('.feature-item');

    featureItems.forEach(item => {
        const header = item.querySelector('.feature-header');
        const content = item.querySelector('.feature-content');
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

    // Scroll animations
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

                    // Unobserve after animation
                    observer.unobserve(element);
                }
            });
        }, {
            threshold: 0.1
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Update active navigation link on scroll
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

    // Detect active section on scroll
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

    // Form submission
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Here you would normally send the form data to a server
            // For demo purposes, we'll just show an alert
            alert('Спасибо за вашу заявку! Мы свяжемся с вами в ближайшее время.');

            // Reset form
            contactForm.reset();
        });
    }

    // Add parallax effect to sections
    window.addEventListener('scroll', function () {
        const scrollPosition = window.pageYOffset;

        // Parallax for about section
        const aboutSection = document.querySelector('.about-section');
        if (aboutSection) {
            const aboutSectionTop = aboutSection.offsetTop;
            const aboutSectionHeight = aboutSection.offsetHeight;

            if (scrollPosition > aboutSectionTop - window.innerHeight &&
                scrollPosition < aboutSectionTop + aboutSectionHeight) {
                const speed = 0.1;
                const yPos = -(scrollPosition - aboutSectionTop) * speed;
                aboutSection.style.backgroundPosition = `center ${yPos}px`;
            }
        }

        // Parallax for hero section
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const speed = 0.5;
            const yPos = scrollPosition * speed;
            heroSection.style.backgroundPositionY = `calc(50% + ${yPos * 0.1}px)`;
        }

        // Parallax for why-us section
        const whyUsSection = document.querySelector('.why-us-section');
        if (whyUsSection) {
            const speed = 0.05;
            const yPos = scrollPosition * speed;
            whyUsSection.style.backgroundPositionY = `${-yPos}px`;
        }

        // Parallax for service sections
        const serviceBlocks = document.querySelectorAll('.service-section');
        serviceBlocks.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition > sectionTop - window.innerHeight &&
                scrollPosition < sectionTop + sectionHeight) {
                const speed = 0.08;
                const yPos = -(scrollPosition - sectionTop) * speed;
                section.style.backgroundPosition = `center ${yPos}px`;
            }
        });
    });

    // Add hover effect to service blocks
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

    // Add animation to service icons
    const serviceIcons = document.querySelectorAll('.service-icon');

    serviceIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });

        icon.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1) rotate(0)';
        });
    });

    // Initialize first feature item as open
    if (featureItems.length > 0) {
        const firstItem = featureItems[0];
        firstItem.classList.add('active');
        const toggleBtn = firstItem.querySelector('.toggle-btn');
        if (toggleBtn) {
            toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron-up"><path d="m18 15-6-6-6 6"/></svg>';
        }
    }
});