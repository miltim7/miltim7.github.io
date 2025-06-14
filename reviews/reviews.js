// reviews\reviews.js

document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('reviewsCarousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const cards = document.querySelectorAll('.review-card');
    
    if (!carousel || !prevBtn || !nextBtn || cards.length === 0) return;
    
    // Переменные для desktop drag с инерцией
    let isDragging = false;
    let startX = 0;
    let scrollStart = 0;
    let velocity = 0;
    let lastMoveTime = 0;
    let lastMoveX = 0;
    let rafId = null;
    
    // Определяем тип устройства
    const isMobile = window.innerWidth <= 767;
    
    // Вычисляем размеры для прокрутки кнопками
    function getScrollAmount() {
        const cardWidth = cards[0] ? cards[0].offsetWidth : 350;
        const gap = parseInt(getComputedStyle(carousel).gap) || 16;
        return cardWidth + gap;
    }
    
    // Обновляем состояние кнопок
    function updateButtons() {
        const scrollLeft = carousel.scrollLeft;
        const maxScroll = carousel.scrollWidth - carousel.offsetWidth;
        
        prevBtn.disabled = scrollLeft <= 0;
        nextBtn.disabled = scrollLeft >= maxScroll;
    }
    
    // Следующие карточки
    function scrollNext() {
        const scrollAmount = getScrollAmount();
        carousel.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
    
    // Предыдущие карточки  
    function scrollPrev() {
        const scrollAmount = getScrollAmount();
        carousel.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    }
    
    // === DESKTOP DRAG с инерцией ===
    function handleMouseDown(e) {
        if (window.innerWidth <= 767) return; // Только для ПК
        
        isDragging = true;
        startX = e.pageX;
        scrollStart = carousel.scrollLeft;
        velocity = 0;
        lastMoveTime = Date.now();
        lastMoveX = e.pageX;
        
        carousel.classList.add('dragging');
        e.preventDefault();
        
        // Останавливаем инерцию если она была
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }
    
    function handleMouseMove(e) {
        if (!isDragging || window.innerWidth <= 767) return;
        
        e.preventDefault();
        const x = e.pageX;
        const walk = (x - startX);
        const now = Date.now();
        
        // Вычисляем скорость для инерции
        if (now - lastMoveTime > 0) {
            velocity = (x - lastMoveX) / (now - lastMoveTime);
        }
        
        carousel.scrollLeft = scrollStart - walk;
        
        lastMoveTime = now;
        lastMoveX = x;
    }
    
    function handleMouseUp() {
        if (!isDragging || window.innerWidth <= 767) return;
        
        isDragging = false;
        carousel.classList.remove('dragging');
        
        // Запускаем инерцию если скорость достаточная
        if (Math.abs(velocity) > 0.1) {
            startInertia();
        }
    }
    
    function handleMouseLeave() {
        if (window.innerWidth <= 767) return;
        
        if (isDragging) {
            isDragging = false;
            carousel.classList.remove('dragging');
            
            // Запускаем инерцию при выходе за границы
            if (Math.abs(velocity) > 0.1) {
                startInertia();
            }
        }
    }
    
    // Инерция для desktop
    function startInertia() {
        const friction = 0.95; // Трение
        const minVelocity = 0.1; // Минимальная скорость
        
        function inertiaStep() {
            if (Math.abs(velocity) < minVelocity) {
                rafId = null;
                return;
            }
            
            carousel.scrollLeft -= velocity * 20; // Умножитель для силы инерции
            velocity *= friction;
            
            rafId = requestAnimationFrame(inertiaStep);
        }
        
        rafId = requestAnimationFrame(inertiaStep);
    }
    
    // === MOBILE/TOUCH EVENTS - обычная нативная прокрутка ===
    // Для мобильных используем простейший подход - убираем все обработчики
    // и позволяем браузеру обрабатывать touch события нативно
    
    // === EVENT LISTENERS ===
    
    // Кнопки навигации
    nextBtn.addEventListener('click', scrollNext);
    prevBtn.addEventListener('click', scrollPrev);
    
    // Desktop mouse drag events - только для ПК
    if (window.innerWidth > 767) {
        carousel.addEventListener('mousedown', handleMouseDown);
        carousel.addEventListener('mousemove', handleMouseMove);
        carousel.addEventListener('mouseup', handleMouseUp);
        carousel.addEventListener('mouseleave', handleMouseLeave);
        
        // Предотвращаем клик после drag на ПК
        carousel.addEventListener('click', (e) => {
            if (Math.abs(startX - e.pageX) > 5) {
                e.preventDefault();
            }
        });
    }
    
    // Обновляем кнопки при любой прокрутке
    carousel.addEventListener('scroll', updateButtons);
    
    // Клавиатурная навигация
    document.addEventListener('keydown', (e) => {
        if (!document.querySelector('.reviews').contains(document.activeElement)) {
            return;
        }
        
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            scrollPrev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            scrollNext();
        }
    });
    
    // Обработка изменения размера окна
    function handleResize() {
        // Останавливаем инерцию при изменении размера
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        
        setTimeout(updateButtons, 100);
    }
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 150);
    });
    
    // Инициализация
    function init() {
        updateButtons();
    }
    
    setTimeout(init, 100);
    
    // Анимация появления заголовков
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });
    
    const title = document.querySelector('.reviews-title');
    const subtitle = document.querySelector('.reviews-subtitle');
    
    if (title) observer.observe(title);
    if (subtitle) observer.observe(subtitle);
    
    window.addEventListener('load', () => {
        setTimeout(updateButtons, 200);
    });
});