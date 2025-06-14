// advantages\advantages.js

document.addEventListener('DOMContentLoaded', function() {
    let currentSlide = 0;
    let totalSlides = 0;
    let isSliderActive = false;
    let touchStartX = 0;
    let touchEndX = 0;

    // Элементы слайдера
    const advantagesTrack = document.querySelector('.advantages-track');
    const prevBtn = document.querySelector('.advantages .slider-btn.prev');
    const nextBtn = document.querySelector('.advantages .slider-btn.next');
    const dotsContainer = document.querySelector('.advantages .slider-dots');
    const advantageCards = document.querySelectorAll('.advantages-track .advantage-card');
    const sliderCounter = document.querySelector('.advantages .slider-counter');

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
        if (!advantagesTrack) return;
        
        totalSlides = advantageCards.length;
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
        if (advantagesTrack) {
            advantagesTrack.style.transform = 'translateX(0)';
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
            currentSlide = 0;
        } else {
            currentSlide++;
        }
        goToSlide(currentSlide);
    }

    // Предыдущий слайд с циклическим переключением
    function prevSlide() {
        if (currentSlide <= 0) {
            currentSlide = totalSlides - 1;
        } else {
            currentSlide--;
        }
        goToSlide(currentSlide);
    }

    // Обновление позиции слайдера
    function updateSlider() {
        if (!advantagesTrack) return;
        
        const offset = currentSlide * 100;
        advantagesTrack.style.transform = `translateX(-${offset}%)`;
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
        if (advantagesTrack) {
            advantagesTrack.addEventListener('touchstart', handleTouchStart, { passive: true });
            advantagesTrack.addEventListener('touchend', handleTouchEnd, { passive: true });
        }

        // Клавиатурная навигация
        document.addEventListener('keydown', handleKeyDown);
    }

    // Удаление обработчиков событий
    function removeSliderEventListeners() {
        if (prevBtn) prevBtn.removeEventListener('click', prevSlide);
        if (nextBtn) nextBtn.removeEventListener('click', nextSlide);
        
        if (advantagesTrack) {
            advantagesTrack.removeEventListener('touchstart', handleTouchStart);
            advantagesTrack.removeEventListener('touchend', handleTouchEnd);
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
    const advantagesTitle = document.querySelector('.advantages-title');
    const advantagesSubtitle = document.querySelector('.advantages-subtitle');
    
    if (advantagesTitle) observer.observe(advantagesTitle);
    if (advantagesSubtitle) observer.observe(advantagesSubtitle);

    // Анимация карточек - ТОЛЬКО ДЛЯ ДЕСКТОПНОЙ СЕТКИ
    const gridAdvantageCards = document.querySelectorAll('.advantages-grid .advantage-card');
    gridAdvantageCards.forEach((card, index) => {
        observer.observe(card);
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Hover эффекты только для десктопа
    if (window.matchMedia('(hover: hover)').matches && window.innerWidth >= 1024) {
        const allAdvantageCards = document.querySelectorAll('.advantage-card');
        allAdvantageCards.forEach(card => {
            let isHovering = false;
            
            card.addEventListener('mouseenter', function() {
                isHovering = true;
            });
            
            card.addEventListener('mouseleave', function() {
                isHovering = false;
                card.style.transform = '';
                
                const icon = card.querySelector('.advantage-icon');
                
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
    const debouncedHandleResize = debounce(handleResize, 250);

    // Обработчики событий
    window.addEventListener('resize', debouncedHandleResize);

    // Инициализация
    checkSliderState();

    // Создаем счетчик программно, если его нет
    if (!sliderCounter && document.querySelector('.advantages .slider-dots')) {
        const counter = document.createElement('div');
        counter.className = 'slider-counter';
        document.querySelector('.advantages .slider-dots').parentNode.insertBefore(counter, document.querySelector('.advantages .slider-dots').nextSibling);
    }
});