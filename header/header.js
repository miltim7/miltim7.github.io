// header\header.js

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const header = document.getElementById('header');
const hero = document.getElementById('hero');

let heroHeight = 0;

// Получаем высоту hero блока при загрузке и изменении размера окна
function updateHeroHeight() {
    if (hero) {
        heroHeight = hero.offsetHeight;
    }
}

// Бургер меню
hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');

    // Блокируем/разблокируем прокрутку страницы
    if (mobileMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
});

// Закрытие меню при клике на ссылку
const mobileLinks = mobileMenu.querySelectorAll('.nav-link, .cta-button');
mobileLinks.forEach(link => {
    link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Закрытие меню при клике вне его области
document.addEventListener('click', function (e) {
    if (mobileMenu.classList.contains('active') &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Эффект прокрутки header с учетом hero блока
function handleHeaderScroll() {
    const scrollY = window.scrollY;
    const heroScrollPoint = heroHeight * 0.8; // 80% от высоты hero блока
    const fullScrollPoint = heroHeight * 0.95; // 95% от высоты hero блока

    // Удаляем все классы состояния
    header.classList.remove('scrolled', 'solid');

    if (scrollY > heroScrollPoint && scrollY < fullScrollPoint) {
        // Промежуточное состояние - полупрозрачный header
        header.classList.add('scrolled');
    } else if (scrollY >= fullScrollPoint) {
        // Полностью непрозрачный header
        header.classList.add('solid');
    }
    // Если scrollY <= heroScrollPoint, header остается прозрачным (без классов)
}

// ===== НОВЫЙ ФУНКЦИОНАЛ: АКТИВНАЯ НАВИГАЦИЯ ПРИ СКРОЛЛЕ =====

// Функция для обновления активной ссылки в навигации
function updateActiveNavLink() {
    const scrollY = window.scrollY;
    const headerHeight = header.offsetHeight;
    const sections = [];

    // Собираем все секции, которые есть на странице
    const heroSection = document.getElementById('hero');
    const servicesSection = document.getElementById('services');
    const advantagesSection = document.getElementById('advantages');
    const portfolioSection = document.getElementById('portfolio');
    const reviewsSection = document.getElementById('reviews');
    const contactSection = document.getElementById('contact');

    // Добавляем существующие секции в массив
    if (heroSection) {
        sections.push({
            element: heroSection,
            id: 'hero',
            navSelector: 'a[href="/"], a[href="#home"], a[href="#hero"]' // Для главной страницы
        });
    }


    if (advantagesSection) {
        sections.push({
            element: advantagesSection,
            id: 'advantages',
            navSelector: 'a[href="#advantages"]'
        });
    }

    if (servicesSection) {
        sections.push({
            element: servicesSection,
            id: 'services',
            navSelector: 'a[href="#services"]'
        });
    }

    if (portfolioSection) {
        sections.push({
            element: portfolioSection,
            id: 'portfolio',
            navSelector: 'a[href="#portfolio"]'
        });
    }

    if (reviewsSection) {
        sections.push({
            element: reviewsSection,
            id: 'reviews',
            navSelector: 'a[href="#reviews"]'
        });
    }

    if (contactSection) {
        sections.push({
            element: contactSection,
            id: 'contact',
            navSelector: 'a[href="#contact"]'
        });
    }

    // Определяем, какая секция сейчас активна
    let activeSection = null;

    // Проверяем каждую секцию
    sections.forEach(section => {
        const rect = section.element.getBoundingClientRect();
        const elementTop = rect.top;
        const elementBottom = rect.bottom;
        const elementHeight = rect.height;

        // Секция считается активной, если:
        // 1. Её верх находится выше середины экрана
        // 2. Её низ находится ниже верха экрана
        // 3. Или если мы находимся в верхней части страницы (для hero)

        const screenMiddle = window.innerHeight / 2;

        if (section.id === 'hero') {
            // Для hero секции: активна если мы в верхней части страницы или если hero виден
            if (scrollY < (heroHeight - headerHeight) || (elementTop <= screenMiddle && elementBottom >= 0)) {
                activeSection = section;
            }
        } else {
            // Для остальных секций: активна если секция пересекает середину экрана
            if (elementTop <= screenMiddle && elementBottom >= screenMiddle) {
                activeSection = section;
            }
        }
    });

    // Если не нашли активную секцию, но находимся в самом верху страницы
    if (!activeSection && scrollY < 100) {
        activeSection = sections.find(section => section.id === 'hero');
    }

    // Если все еще нет активной секции, выбираем ближайшую к центру экрана
    if (!activeSection && sections.length > 0) {
        const screenMiddle = window.innerHeight / 2;
        let closestSection = null;
        let smallestDistance = Infinity;

        sections.forEach(section => {
            const rect = section.element.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;
            const distance = Math.abs(sectionCenter - screenMiddle);

            if (distance < smallestDistance) {
                smallestDistance = distance;
                closestSection = section;
            }
        });

        activeSection = closestSection;
    }

    // Убираем активный класс со всех ссылок
    const allNavLinks = document.querySelectorAll('.nav-link');
    allNavLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Добавляем активный класс к нужной ссылке
    if (activeSection) {
        const activeLinks = document.querySelectorAll(activeSection.navSelector);
        activeLinks.forEach(link => {
            if (link.classList.contains('nav-link')) {
                link.classList.add('active');
            }
        });
    }
}

// Объединяем обработку скролла
function handleScroll() {
    handleHeaderScroll();
    updateActiveNavLink();
}

window.addEventListener('scroll', handleScroll);

// Активная ссылка при клике (оставляем для мгновенной реакции)
const allNavLinks = document.querySelectorAll('.nav-link');
allNavLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Проверяем, является ли это внутренней ссылкой
        if (href.startsWith('#') || href === '/') {
            // Убираем активный класс у всех ссылок
            allNavLinks.forEach(l => l.classList.remove('active'));

            // Добавляем активный класс к текущей ссылке
            this.classList.add('active');

            // Также обновляем соответствующую ссылку в другом меню
            const correspondingLinks = document.querySelectorAll(`a[href="${href}"].nav-link`);
            correspondingLinks.forEach(correspondingLink => {
                correspondingLink.classList.add('active');
            });
        }
    });
});

// Обработка изменения размера экрана
window.addEventListener('resize', function () {
    // Если экран стал больше 1024px, закрываем мобильное меню
    if (window.innerWidth > 1024) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Обновляем высоту hero блока
    updateHeroHeight();
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    updateHeroHeight();
    handleScroll(); // Проверяем начальное состояние
});

// Дополнительная проверка после полной загрузки всех ресурсов
window.addEventListener('load', function () {
    updateHeroHeight();
    handleScroll();
});

// Плавная прокрутка к секциям при клике на навигацию
allNavLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Обработка ссылки на главную страницу
        if (href === '/' || href === '#home') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }

        // Проверяем, является ли это внутренней ссылкой
        if (href.startsWith('#') && href !== '#') {
            const targetElement = document.querySelector(href);

            if (targetElement) {
                e.preventDefault();

                // Вычисляем позицию с учетом высоты header
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Оптимизация производительности - throttle для scroll события
let ticking = false;

function updateHeader() {
    handleScroll();
    ticking = false;
}

window.addEventListener('scroll', function () {
    if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
    }
});