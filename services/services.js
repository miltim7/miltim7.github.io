// services\services.js

document.addEventListener('DOMContentLoaded', function() {
    let currentSlide = 0;
    let totalSlides = 0;
    let isSliderActive = false;
    let touchStartX = 0;
    let touchEndX = 0;

    // Элементы слайдера
    const servicesTrack = document.querySelector('.services-track');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const dotsContainer = document.querySelector('.slider-dots');
    const serviceCards = document.querySelectorAll('.services-track .service-card');
    const sliderCounter = document.querySelector('.slider-counter');

    // Проверяем, активен ли слайдер
    function checkSliderState() {
        isSliderActive = window.innerWidth < 1024;
        
        if (isSliderActive) {
            initSlider();
        } else {
            destroySlider();
        }
    }

    // Инициализация слайдера
    function initSlider() {
        if (!servicesTrack) return;
        
        totalSlides = serviceCards.length;
        currentSlide = 0;
        
        // Создаем точки навигации
        createDots();
        
        // Обновляем позиции
        updateSlider();
        updateDots();
        updateCounter();
        
        // Добавляем обработчики событий
        addSliderEventListeners();
    }

    // Уничтожение слайдера
    function destroySlider() {
        if (servicesTrack) {
            servicesTrack.style.transform = 'translateX(0)';
        }
        removeSliderEventListeners();
    }

    // Создание точек навигации
    function createDots() {
        if (!dotsContainer) return;
        
        dotsContainer.innerHTML = '';
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    // Переход к слайду
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateSlider();
        updateDots();
        updateCounter();
    }

    // Следующий слайд с циклическим переключением
    function nextSlide() {
        if (currentSlide >= totalSlides - 1) {
            currentSlide = 0; // Переходим к первому слайду
        } else {
            currentSlide++;
        }
        goToSlide(currentSlide);
    }

    // Предыдущий слайд с циклическим переключением
    function prevSlide() {
        if (currentSlide <= 0) {
            currentSlide = totalSlides - 1; // Переходим к последнему слайду
        } else {
            currentSlide--;
        }
        goToSlide(currentSlide);
    }

    // Обновление позиции слайдера
    function updateSlider() {
        if (!servicesTrack) return;
        
        const offset = currentSlide * 100;
        servicesTrack.style.transform = `translateX(-${offset}%)`;
    }

    // Обновление точек
    function updateDots() {
        if (!dotsContainer) return;
        
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // Обновление счетчика
    function updateCounter() {
        if (!sliderCounter) return;
        
        sliderCounter.textContent = `${currentSlide + 1} из ${totalSlides}`;
    }

    // Добавление обработчиков событий
    function addSliderEventListeners() {
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        
        // Touch события
        if (servicesTrack) {
            servicesTrack.addEventListener('touchstart', handleTouchStart, { passive: true });
            servicesTrack.addEventListener('touchend', handleTouchEnd, { passive: true });
        }

        // Клавиатурная навигация
        document.addEventListener('keydown', handleKeyDown);
    }

    // Удаление обработчиков событий
    function removeSliderEventListeners() {
        if (prevBtn) prevBtn.removeEventListener('click', prevSlide);
        if (nextBtn) nextBtn.removeEventListener('click', nextSlide);
        
        if (servicesTrack) {
            servicesTrack.removeEventListener('touchstart', handleTouchStart);
            servicesTrack.removeEventListener('touchend', handleTouchEnd);
        }

        document.removeEventListener('keydown', handleKeyDown);
    }

    // Обработка клавиатуры
    function handleKeyDown(e) {
        if (!isSliderActive) return;
        
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
        }
    }

    // Обработка начала касания
    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
    }

    // Обработка окончания касания
    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    }

    // Обработка свайпа
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    // Анимация появления элементов при прокрутке
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Наблюдаем за заголовками
    const servicesTitle = document.querySelector('.services-title');
    const servicesSubtitle = document.querySelector('.services-subtitle');
    
    if (servicesTitle) observer.observe(servicesTitle);
    if (servicesSubtitle) observer.observe(servicesSubtitle);

    // Анимация карточек - ТОЛЬКО ДЛЯ ДЕСКТОПНОЙ СЕТКИ
    const gridServiceCards = document.querySelectorAll('.services-grid .service-card');
    gridServiceCards.forEach((card, index) => {
        observer.observe(card);
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Hover эффекты только для десктопа
    if (window.matchMedia('(hover: hover)').matches && window.innerWidth >= 1024) {
        const allServiceCards = document.querySelectorAll('.service-card');
        allServiceCards.forEach(card => {
            let isHovering = false;
            
            card.addEventListener('mouseenter', function() {
                isHovering = true;
            });
            
            card.addEventListener('mouseleave', function() {
                isHovering = false;
                card.style.transform = '';
                
                const features = card.querySelectorAll('.feature');
                const priceValue = card.querySelector('.price-value');
                const icon = card.querySelector('.service-icon');
                
                features.forEach(feature => {
                    feature.style.transform = '';
                    feature.style.transitionDelay = '';
                });
                
                if (priceValue) priceValue.style.transform = '';
                if (icon) icon.style.transform = '';
            });
            
            card.addEventListener('mousemove', function(e) {
                if (!isHovering || window.innerWidth < 1024) return;
                
                const rect = card.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const mouseX = e.clientX - centerX;
                const mouseY = e.clientY - centerY;
                
                const rotateX = Math.max(-8, Math.min(8, (mouseY / (rect.height / 2)) * -8));
                const rotateY = Math.max(-8, Math.min(8, (mouseX / (rect.width / 2)) * 8));
                
                card.style.transform = `
                    translateY(-15px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg)
                `;
            });
        });
    }

    // Улучшенная анимация особенностей услуг (только для десктопа)
    if (window.innerWidth >= 1024) {
        const allServiceCards = document.querySelectorAll('.service-card');
        allServiceCards.forEach(card => {
            const features = card.querySelectorAll('.feature');
            const priceElements = {
                from: card.querySelector('.price-from'),
                value: card.querySelector('.price-value'),
                currency: card.querySelector('.price-currency')
            };
            
            card.addEventListener('mouseenter', function() {
                features.forEach((feature, index) => {
                    feature.style.transitionDelay = `${index * 0.1}s`;
                    setTimeout(() => {
                        feature.style.transform = 'translateY(-3px) scale(1.05)';
                        feature.style.opacity = '1';
                    }, index * 100);
                });
                
                setTimeout(() => {
                    if (priceElements.from) {
                        priceElements.from.style.transform = 'translateY(-2px)';
                        priceElements.from.style.opacity = '1';
                    }
                }, 100);
                
                setTimeout(() => {
                    if (priceElements.value) {
                        priceElements.value.style.transform = 'scale(1.08)';
                    }
                }, 200);
                
                setTimeout(() => {
                    if (priceElements.currency) {
                        priceElements.currency.style.transform = 'translateY(-1px)';
                        priceElements.currency.style.opacity = '1';
                    }
                }, 300);
            });
            
            card.addEventListener('mouseleave', function() {
                features.forEach((feature, index) => {
                    feature.style.transitionDelay = `${index * 0.05}s`;
                    feature.style.transform = '';
                    feature.style.opacity = '';
                });
                
                Object.values(priceElements).forEach(element => {
                    if (element) {
                        element.style.transform = '';
                        element.style.opacity = '';
                    }
                });
            });
        });
    }

    // Функция для проверки видимости элемента
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Счетчик анимации для цен
    function animateCounters() {
        const priceValues = document.querySelectorAll('.price-value');
        
        priceValues.forEach(priceElement => {
            if (isElementInViewport(priceElement) && !priceElement.classList.contains('counted')) {
                priceElement.classList.add('counted');
                
                const originalText = priceElement.textContent;
                const targetValue = parseInt(originalText.replace(/\s/g, ''));
                const duration = 1000;
                const startTime = performance.now();
                
                function updateCounter(currentTime) {
                    const elapsedTime = currentTime - startTime;
                    const progress = Math.min(elapsedTime / duration, 1);
                    
                    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                    const currentValue = Math.floor(targetValue * easeOutCubic);
                    
                    priceElement.textContent = currentValue.toLocaleString('ru-RU');
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        priceElement.textContent = originalText;
                    }
                }
                
                requestAnimationFrame(updateCounter);
            }
        });
    }

    // Debounce функция для оптимизации
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

    // Обработка изменения размера окна
    function handleResize() {
        checkSliderState();
        
        if (isSliderActive) {
            createDots();
            updateSlider();
            updateDots();
            updateCounter();
        }
    }

    // Применяем debounce к событиям
    const debouncedAnimateCounters = debounce(animateCounters, 100);
    const debouncedHandleResize = debounce(handleResize, 250);

    // Обработчики событий
    window.addEventListener('scroll', debouncedAnimateCounters);
    window.addEventListener('resize', debouncedHandleResize);

    // Инициализация
    checkSliderState();
    animateCounters();

    // Создаем счетчик программно, если его нет
    if (!sliderCounter && document.querySelector('.slider-dots')) {
        const counter = document.createElement('div');
        counter.className = 'slider-counter';
        document.querySelector('.slider-dots').parentNode.insertBefore(counter, document.querySelector('.slider-dots').nextSibling);
    }
});