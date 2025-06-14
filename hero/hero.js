// hero\hero.js

document.addEventListener('DOMContentLoaded', function() {
    const heroTextContainer = document.getElementById('heroText');
    const heroWords = document.querySelectorAll('.hero-word');
    const hero = document.getElementById('hero');
    const header = document.getElementById('header');
    
    let isMouseInside = false;
    
    // Проверяем, поддерживает ли устройство hover И не является ли мобильным
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    const isMobile = window.innerWidth <= 768;
    
    // 3D эффекты только для десктопа
    if (supportsHover && !isMobile && heroTextContainer) {
        
        // Отслеживание входа мыши в область hero
        hero.addEventListener('mouseenter', function() {
            isMouseInside = true;
        });
        
        hero.addEventListener('mouseleave', function() {
            isMouseInside = false;
            // Возвращаем текст в исходное положение
            resetTextPosition();
        });
        
        // Основная функция 3D эффекта
        hero.addEventListener('mousemove', function(e) {
            if (!isMouseInside || window.innerWidth <= 768) return;
            
            const rect = hero.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Вычисляем относительные координаты мыши
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            // Нормализуем значения (-1 до 1)
            const normalizedX = mouseX / (rect.width / 2);
            const normalizedY = mouseY / (rect.height / 2);
            
            // Ограничиваем значения
            const maxRotation = 15;
            const rotateX = -normalizedY * maxRotation;
            const rotateY = normalizedX * maxRotation;
            
            // Применяем 3D трансформацию к контейнеру
            heroTextContainer.style.transform = `
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateZ(20px)
            `;
            
            // Индивидуальные эффекты для каждого слова
            heroWords.forEach((word, index) => {
                const delay = index * 0.1;
                const intensity = 1 + (index * 0.3);
                
                const wordRotateX = rotateX * intensity;
                const wordRotateY = rotateY * intensity;
                const translateZ = 10 + (index * 5);
                
                setTimeout(() => {
                    word.style.transform = `
                        rotateX(${wordRotateX}deg) 
                        rotateY(${wordRotateY}deg) 
                        translateZ(${translateZ}px)
                        scale(${1 + Math.abs(normalizedX) * 0.05})
                    `;
                }, delay * 100);
            });
        });
    }
    
    // Функция сброса позиции (только для десктопа)
    function resetTextPosition() {
        if (window.innerWidth > 768) {
            heroTextContainer.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
            
            heroWords.forEach((word, index) => {
                setTimeout(() => {
                    word.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)';
                }, index * 50);
            });
        } else {
            // На мобильных полностью убираем трансформации
            heroTextContainer.style.transform = 'none';
            heroWords.forEach(word => {
                word.style.transform = 'none';
            });
        }
    }
    
    // Функция для отключения 3D эффектов на мобильных
    function disableMobile3D() {
        if (window.innerWidth <= 768) {
            heroTextContainer.style.transform = 'none';
            heroTextContainer.style.transformStyle = 'flat';
            
            heroWords.forEach(word => {
                word.style.transform = 'none';
                word.style.transformStyle = 'flat';
                word.style.filter = 'none';
                // Убираем псевдоэлементы программно
                const beforeStyle = document.createElement('style');
                beforeStyle.textContent = `
                    @media (max-width: 768px) {
                        .hero-word::before, .hero-word::after {
                            display: none !important;
                        }
                    }
                `;
                document.head.appendChild(beforeStyle);
            });
        }
    }
    
    // Анимация появления текста при загрузке
    function animateTextOnLoad() {
        heroWords.forEach((word, index) => {
            word.style.opacity = '0';
            word.style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                word.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                word.style.opacity = '1';
                word.style.transform = window.innerWidth <= 768 ? 'none' : 'translateY(0px)';
            }, index * 200 + 500);
        });
    }
    
    // Запускаем анимацию появления
    animateTextOnLoad();
    
    // Функция для проверки пересечения текста с header
    function checkHeaderOverlap() {
        if (!header || !heroTextContainer) return;
        
        const headerHeight = header.offsetHeight;
        const heroRect = heroTextContainer.getBoundingClientRect();
        
        // Если текст заходит в область header, добавляем дополнительный отступ
        if (heroRect.top < headerHeight + 20) {
            hero.style.paddingTop = (headerHeight + 40) + 'px';
        }
    }
    
    // Обработка изменения размера экрана
    window.addEventListener('resize', function() {
        const isMobileNow = window.innerWidth <= 768;
        
        if (isMobileNow) {
            disableMobile3D();
        } else {
            resetTextPosition();
        }
        
        checkHeaderOverlap();
    });
    
    // Отключаем 3D эффекты на мобильных при загрузке
    disableMobile3D();
    
    // Проверяем пересечение при загрузке
    setTimeout(checkHeaderOverlap, 100);
    
    // Плавное появление кнопок
    const heroButtons = document.querySelectorAll('.hero-btn');
    heroButtons.forEach((btn, index) => {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            btn.style.transition = 'all 0.6s ease';
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0px)';
        }, 1500 + (index * 200));
    });
    
    // Обеспечиваем правильное воспроизведение видео на всех устройствах
    const video = hero.querySelector('video');
    if (video) {
        // Принудительно запускаем видео после загрузки
        video.addEventListener('loadeddata', function() {
            video.play().catch(e => {
                console.log('Автовоспроизведение видео заблокировано:', e);
            });
        });
        
        // На мобильных устройствах пытаемся запустить видео при первом касании
        document.addEventListener('touchstart', function() {
            if (video.paused) {
                video.play().catch(e => {
                    console.log('Не удалось запустить видео:', e);
                });
            }
        }, { once: true });
    }
});