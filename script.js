// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Initialize Swiper for testimonials
const testimonialsSwiper = new Swiper('.testimonials-slider', {
    slidesPerView: 1,
    spaceBetween: 30,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    breakpoints: {
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    },
});

// Mobile menu toggle
const burger = document.getElementById('burger')
const overlay = document.getElementById('overlay')
const navMenu = document.getElementById('navMenu')
const navLinks = navMenu.querySelectorAll('a')

function toggleMenu() {
  burger.classList.toggle('active')
  navMenu.classList.toggle('show')
  overlay.classList.toggle('show')
}

burger.addEventListener('click', toggleMenu)
overlay.addEventListener('click', toggleMenu)
navLinks.forEach(link => {
  link.addEventListener('click', toggleMenu)
})


// FAQ accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        faqItems.forEach(faqItem => {
            faqItem.classList.remove('active');
        });

        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
});

// Header scroll effect
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 80) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Form submission with validation
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Basic form validation
    const formInputs = contactForm.querySelectorAll('input, textarea');
    let isValid = true;

    formInputs.forEach(input => {
        if (input.required && !input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }

        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                input.classList.add('error');
            }
        }
    });

    if (isValid) {
        // Add success message
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.textContent = 'Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.';
        
        contactForm.insertAdjacentElement('beforebegin', successMessage);
        contactForm.reset();

        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }
});

// Animate numbers in hero stats
const statsNumbers = document.querySelectorAll('.stat-number');

const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + (element.dataset.suffix || '');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};

// Intersection Observer for stats animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            statsNumbers.forEach(stat => {
                const endValue = parseInt(stat.textContent);
                animateValue(stat, 0, endValue, 2000);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// Parallax effect for hero section
const heroSection = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
    if (window.innerWidth > 768) {
        const scroll = window.pageYOffset;
        heroContent.style.transform = `translateY(${scroll * 0.5}px)`;
        heroSection.style.backgroundPositionY = `${scroll * 0.5}px`;
    }
});