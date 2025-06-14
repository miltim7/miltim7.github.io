// script.js

document.addEventListener('DOMContentLoaded', function() {
    
    // Инициализация всех общих функций
    initCustomCursor();
    initPreloader();
    initScrollAnimations();
    initSmoothScroll();
    initNotifications();
    initFormValidation();
    initLazyLoading();
    
    console.log('🚀 WebDev Pro - Сайт загружен успешно!');
});

// ===== СОВРЕМЕННЫЙ КАСТОМНЫЙ КУРСОР =====
// ===== СОВРЕМЕННЫЙ КАСТОМНЫЙ КУРСОР =====
function initCustomCursor() {
    // Проверяем, поддерживает ли устройство hover
    if (!window.matchMedia('(hover: hover)').matches) {
        console.log('Touch device detected, skipping custom cursor');
        return;
    }

    try {
        // Создаем элементы курсора
        const cursor = document.createElement('div');
        const cursorRing = document.createElement('div');
        
        cursor.className = 'cursor';
        cursorRing.className = 'cursor-ring';
        
        // Изначально скрываем курсоры
        cursor.style.display = 'none';
        cursorRing.style.display = 'none';
        
        document.body.appendChild(cursor);
        document.body.appendChild(cursorRing);
        
        let mouseX = 0;
        let mouseY = 0;
        let ringX = 0;
        let ringY = 0;
        let isMoving = false;
        
        // Функция обновления позиции основного курсора
        function updateCursor() {
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        }
        
        // Функция плавного следования кольца
        function updateRing() {
            const speed = 0.15;
            
            ringX += (mouseX - ringX) * speed;
            ringY += (mouseY - ringY) * speed;
            
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            
            requestAnimationFrame(updateRing);
        }
        
        // Обработчик движения мыши
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!isMoving) {
                isMoving = true;
                // Показываем курсоры при первом движении
                cursor.style.display = 'block';
                cursorRing.style.display = 'block';
                // Активируем кастомный курсор
                document.body.classList.add('custom-cursor');
            }
            
            updateCursor();
        });
        
        // Запускаем анимацию кольца
        updateRing();
        
        // Обработчик когда курсор покидает окно
        document.addEventListener('mouseleave', () => {
            cursor.style.display = 'none';
            cursorRing.style.display = 'none';
            document.body.classList.remove('custom-cursor');
        });
        
        // Обработчик когда курсор входит в окно
        document.addEventListener('mouseenter', () => {
            if (isMoving) {
                cursor.style.display = 'block';
                cursorRing.style.display = 'block';
                document.body.classList.add('custom-cursor');
            }
        });
        
        // Функция добавления hover эффектов
        function addHoverEffects(elements) {
            elements.forEach(element => {
                if (element.dataset.cursorInitialized) return;
                element.dataset.cursorInitialized = 'true';
                
                element.addEventListener('mouseenter', () => {
                    document.body.classList.add('cursor-hover');
                });
                
                element.addEventListener('mouseleave', () => {
                    document.body.classList.remove('cursor-hover');
                });
                
                element.addEventListener('mousedown', () => {
                    document.body.classList.add('cursor-click');
                });
                
                element.addEventListener('mouseup', () => {
                    document.body.classList.remove('cursor-click');
                });
            });
        }
        
        // Находим все интерактивные элементы
        function updateInteractiveElements() {
            const interactiveElements = document.querySelectorAll(
                'a, button, [role="button"], input[type="submit"], input[type="button"], .btn, .service-card, .cta-button, .slider-btn, .dot, .logo, .nav-link, .hamburger'
            );
            
            addHoverEffects(interactiveElements);
        }
        
        // Инициализируем существующие элементы
        updateInteractiveElements();
        
        // Отслеживаем новые элементы
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    shouldUpdate = true;
                }
            });
            
            if (shouldUpdate) {
                setTimeout(updateInteractiveElements, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('✅ Custom cursor initialized successfully');
        
    } catch (error) {
        console.error('❌ Error initializing custom cursor:', error);
        // В случае ошибки возвращаем стандартный курсор
        document.body.style.cursor = 'auto';
    }
}

// ===== ОСТАЛЬНЫЕ ФУНКЦИИ ОСТАЮТСЯ БЕЗ ИЗМЕНЕНИЙ =====

// ===== PRELOADER =====
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            if (preloader) {
                preloader.classList.add('hidden');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }
        }, 1000);
    });
}

// ===== АНИМАЦИИ ПРИ СКРОЛЛЕ =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos], .fade-in, .slide-in-left, .slide-in-right');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible', 'aos-animate');
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ===== ПЛАВНАЯ ПРОКРУТКА =====
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Обновляем URL
                history.pushState(null, null, href);
            }
        });
    });
}

// ===== СИСТЕМА УВЕДОМЛЕНИЙ =====
function initNotifications() {
    window.showNotification = function(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Показываем уведомление
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Скрываем уведомление
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    };
}

// ===== ВАЛИДАЦИЯ ФОРМ =====
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#e74c3c';
                    
                    // Удаляем красную рамку при вводе
                    field.addEventListener('input', function() {
                        this.style.borderColor = '';
                    }, { once: true });
                }
            });
            
            // Проверка email
            const emailFields = form.querySelectorAll('input[type="email"]');
            emailFields.forEach(field => {
                if (field.value && !isValidEmail(field.value)) {
                    isValid = false;
                    field.style.borderColor = '#e74c3c';
                    showNotification('Введите корректный email адрес', 'error');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showNotification('Пожалуйста, заполните все обязательные поля', 'error');
            }
        });
    });
}

// Проверка валидности email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== ЛЕНИВАЯ ЗАГРУЗКА ИЗОБРАЖЕНИЙ =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('loading');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        img.classList.add('loading');
        imageObserver.observe(img);
    });
}

// ===== УТИЛИТАРНЫЕ ФУНКЦИИ =====

// Debounce функция
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle функция
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Определение типа устройства
function getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
}

// Проверка поддержки WebP
function supportsWebP() {
    return new Promise((resolve) => {
        const webP = new Image();
        webP.onload = webP.onerror = () => resolve(webP.height === 2);
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
}

// Копирование текста в буфер обмена
function copyToClipboard(text) {
    if (navigator.clipboard) {
        return navigator.clipboard.writeText(text);
    } else {
        // Fallback для старых браузеров
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return Promise.resolve();
    }
}

// Получение параметров URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Форматирование чисел
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Анимация чисел
function animateNumber(element, start, end, duration = 2000) {
    let startTime = null;
    
    function animate(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        const currentNumber = Math.floor(progress * (end - start) + start);
        element.textContent = formatNumber(currentNumber);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

// Экспорт функций для использования в других скриптах
window.WebDevUtils = {
    debounce,
    throttle,
    getDeviceType,
    supportsWebP,
    copyToClipboard,
    getUrlParameter,
    formatNumber,
    animateNumber,
    showNotification: window.showNotification
};