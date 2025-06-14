// portfolio\portfolio.js

document.addEventListener('DOMContentLoaded', function () {
    let currentSlide = 0;
    let totalSlides = 0;
    let isSliderActive = false;
    let touchStartX = 0;
    let touchEndX = 0;
    let activeFilter = 'all';
    let isDragging = false;
    
    // ПЕРЕМЕННЫЕ ДЛЯ ПАГИНАЦИИ
    let currentPage = 0;
    const itemsPerPage = 6;
    let allCards = [];
    let filteredCards = [];
    let portfolioData = null;

    // ПЕРЕМЕННЫЕ ДЛЯ ГАЛЕРЕИ
    let currentImageIndex = 0;
    let modalImages = [];

    // Элементы DOM
    const portfolioTrack = document.querySelector('.portfolio-track');
    const prevBtn = document.querySelector('.portfolio .slider-btn.prev');
    const nextBtn = document.querySelector('.portfolio .slider-btn.next');
    const dotsContainer = document.querySelector('.portfolio .slider-dots');
    const portfolioGrid = document.getElementById('portfolioGrid');
    const sliderCounter = document.querySelector('.portfolio .slider-counter');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadMoreContainer = document.querySelector('.portfolio-load-more');
    const loadMoreCount = document.querySelector('.load-more-count');

    // Элементы галереи
    const modalImage = document.getElementById('modalImage');
    const galleryPrev = document.getElementById('galleryPrev');
    const galleryNext = document.getElementById('galleryNext');
    const modalImageDots = document.getElementById('modalImageDots');

    // =============================================
    // ЗАГРУЗКА ДАННЫХ ИЗ JSON
    // =============================================
    async function loadPortfolioData() {
        try {
            const response = await fetch('portfolio.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            portfolioData = await response.json();
            console.log('Portfolio data loaded successfully:', portfolioData);
            
            // Проверяем и фильтруем существующие изображения
            await validateAndFilterImages();
            
            // Генерируем HTML для карточек
            generatePortfolioCards();
            
            // Инициализируем все функции после загрузки данных
            initializePortfolio();
            
        } catch (error) {
            console.error('Error loading portfolio data:', error);
            // Показываем сообщение об ошибке пользователю
            if (portfolioGrid) {
                portfolioGrid.innerHTML = '<p style="text-align: center; color: #31493c; padding: 2rem;">Ошибка загрузки данных портфолио. Попробуйте обновить страницу.</p>';
            }
        }
    }

    // =============================================
    // ПРОВЕРКА СУЩЕСТВОВАНИЯ ИЗОБРАЖЕНИЙ
    // =============================================
    async function validateAndFilterImages() {
        if (!portfolioData || !portfolioData.projects) return;

        for (let project of portfolioData.projects) {
            const validImages = [];
            
            for (let imagePath of project.images) {
                try {
                    const imageExists = await checkImageExists(imagePath);
                    if (imageExists) {
                        validImages.push(imagePath);
                    } else {
                        console.warn(`Image not found: ${imagePath}`);
                    }
                } catch (error) {
                    console.warn(`Error checking image ${imagePath}:`, error);
                }
            }
            
            // Если не найдено ни одного изображения, используем placeholder
            if (validImages.length === 0) {
                validImages.push('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZThmMWYyIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjN2E5ZTdlIiBmb250LXNpemU9IjE2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiPkZvdG8gbm90IGZvdW5kPC90ZXh0Pgo8L3N2Zz4K');
                console.warn(`No valid images found for project ${project.id}, using placeholder`);
            }
            
            project.images = validImages;
        }
    }

    // =============================================
    // ПРОВЕРКА СУЩЕСТВОВАНИЯ ИЗОБРАЖЕНИЯ
    // =============================================
    function checkImageExists(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = src;
            
            // Timeout через 3 секунды
            setTimeout(() => resolve(false), 3000);
        });
    }

    // =============================================
    // ГЕНЕРАЦИЯ HTML КАРТОЧЕК ИЗ JSON
    // =============================================
    function generatePortfolioCards() {
        if (!portfolioData || !portfolioData.projects) return;

        const cardsHTML = portfolioData.projects.map(project => `
            <div class="portfolio-card" data-category="${project.category}" data-project="${project.id}">
                <div class="portfolio-image">
                    <img src="${project.images[0]}" alt="${project.title}" loading="lazy">
                </div>
                <div class="portfolio-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-category">${project.categoryName}</p>
                    <p class="project-description">${project.description}</p>
                    <div class="project-technologies">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="portfolio-buttons">
                        <button class="portfolio-btn primary" onclick="event.stopPropagation(); openProjectModal(${project.id})">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" stroke-width="2" />
                                <path d="M2.458 12C3.732 7.943 7.523 5 12 5C16.478 5 20.268 7.943 21.542 12C20.268 16.057 16.478 19 12 19C7.523 19 3.732 16.057 2.458 12Z" stroke="currentColor" stroke-width="2" />
                            </svg>
                            Детали
                        </button>
                        <a href="${project.liveLink}" class="portfolio-btn secondary" onclick="event.stopPropagation()" target="_blank">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" stroke-width="2" />
                                <path d="M15 3H21V9" stroke="currentColor" stroke-width="2" />
                                <path d="M10 14L21 3" stroke="currentColor" stroke-width="2" />
                            </svg>
                            Сайт
                        </a>
                    </div>
                </div>
            </div>
        `).join('');

        if (portfolioGrid) {
            portfolioGrid.innerHTML = cardsHTML;
            
            // Добавляем обработчики кликов на карточки
            addCardClickHandlers();
        }
    }

    // =============================================
    // ДОБАВЛЕНИЕ ОБРАБОТЧИКОВ КЛИКОВ НА КАРТОЧКИ
    // =============================================
    function addCardClickHandlers() {
        const cards = document.querySelectorAll('.portfolio-card');
        
        cards.forEach(card => {
            card.addEventListener('click', function(e) {
                // Проверяем, что клик не по кнопке или ссылке
                if (e.target.closest('.portfolio-btn') || e.target.closest('a')) {
                    return; // Не обрабатываем клик, если это кнопка или ссылка
                }
                
                const projectId = parseInt(this.dataset.project);
                console.log('Card clicked, opening modal for project:', projectId);
                openProjectModal(projectId);
            });
            
            // Добавляем визуальную обратную связь при наведении
            card.style.cursor = 'pointer';
        });
    }

    // =============================================
    // ИНИЦИАЛИЗАЦИЯ ПОРТФОЛИО
    // =============================================
    function initializePortfolio() {
        initFilters();
        initPagination();
        initGallery();
        checkSliderState();
        initObserver();
        
        // Обработчики событий
        window.addEventListener('resize', debouncedHandleResize);
        
        // Создаем счетчик программно, если его нет
        createSliderCounter();
    }

    // =============================================
    // ИНИЦИАЛИЗАЦИЯ ПАГИНАЦИИ
    // =============================================
    function initPagination() {
        allCards = Array.from(document.querySelectorAll('.portfolio-card'));
        
        // Изначально скрываем все карточки
        allCards.forEach(card => {
            card.style.display = 'none';
            card.classList.remove('animate');
        });
        
        // Применяем начальную фильтрацию и пагинацию
        filterProjects('all');
        
        // Добавляем обработчик кнопки "Посмотреть еще"
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', loadMoreProjects);
        }
    }

    // =============================================
    // ЗАГРУЗКА ДОПОЛНИТЕЛЬНЫХ ПРОЕКТОВ
    // =============================================
    function loadMoreProjects() {
        currentPage++;
        showProjectsForCurrentPage();
        updateLoadMoreButton();
        
        // Анимация новых карточек
        const startIndex = currentPage * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filteredCards.length);
        
        for (let i = startIndex; i < endIndex; i++) {
            if (filteredCards[i]) {
                setTimeout(() => {
                    filteredCards[i].classList.add('animate');
                }, (i - startIndex) * 100);
            }
        }
    }

    // =============================================
    // ПОКАЗ ПРОЕКТОВ ДЛЯ ТЕКУЩЕЙ СТРАНИЦЫ
    // =============================================
    function showProjectsForCurrentPage() {
        const endIndex = (currentPage + 1) * itemsPerPage;
        
        filteredCards.forEach((card, index) => {
            if (index < endIndex) {
                card.style.display = 'block';
            }
        });
    }

    // =============================================
    // ОБНОВЛЕНИЕ КНОПКИ "ПОСМОТРЕТЬ ЕЩЕ"
    // =============================================
    function updateLoadMoreButton() {
        if (!loadMoreBtn || !loadMoreContainer) return;
        
        const shownItems = (currentPage + 1) * itemsPerPage;
        const remainingItems = filteredCards.length - shownItems;
        
        if (remainingItems > 0) {
            const itemsToShow = Math.min(remainingItems, itemsPerPage);
            loadMoreCount.textContent = `+${itemsToShow}`;
            loadMoreContainer.classList.add('show');
        } else {
            loadMoreContainer.classList.remove('show');
        }
    }

    // =============================================
    // ИНИЦИАЛИЗАЦИЯ ФИЛЬТРОВ
    // =============================================
    function initFilters() {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                // Обновляем активную кнопку
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Получаем категорию фильтра
                const filter = this.dataset.filter;
                activeFilter = filter;

                // Сбрасываем пагинацию
                currentPage = 0;

                // Применяем фильтр
                filterProjects(filter);
            });
        });
    }

    // =============================================
    // ФИЛЬТРАЦИЯ ПРОЕКТОВ
    // =============================================
    function filterProjects(category) {
        const portfolioGrid = document.querySelector('.portfolio-grid');
        allCards = Array.from(document.querySelectorAll('.portfolio-card'));

        // Добавляем класс фильтрации к контейнеру
        portfolioGrid.classList.add('filtering');

        // Фаза 1: Плавно скрываем ВСЕ карточки
        allCards.forEach(card => {
            card.classList.remove('animate', 'filtered', 'hidden');
            card.classList.add('filtering', 'filtering-out');
            card.style.display = 'none';
        });

        // Фаза 2: Определяем отфильтрованные карточки
        setTimeout(() => {
            filteredCards = allCards.filter(card => {
                const cardCategory = card.dataset.category;
                return category === 'all' || cardCategory === category;
            });

            // Показываем первую страницу отфильтрованных карточек
            showProjectsForCurrentPage();

            // Обновляем кнопку "Посмотреть еще"
            updateLoadMoreButton();

            // Заново добавляем обработчики кликов (так как карточки пере-генерированы)
            addCardClickHandlers();

            // Фаза 3: Анимация появления
            setTimeout(() => {
                const itemsToShow = Math.min(itemsPerPage, filteredCards.length);
                
                for (let i = 0; i < itemsToShow; i++) {
                    if (filteredCards[i]) {
                        setTimeout(() => {
                            filteredCards[i].classList.remove('filtering-out', 'filtering');
                            filteredCards[i].classList.add('animate');
                        }, i * 80);
                    }
                }

                // Убираем класс фильтрации с контейнера
                setTimeout(() => {
                    portfolioGrid.classList.remove('filtering');
                    
                    // Отмечаем неотфильтрованные как скрытые
                    allCards.forEach(card => {
                        if (!filteredCards.includes(card)) {
                            card.classList.add('hidden', 'filtered');
                        }
                        card.classList.remove('filtering', 'filtering-out');
                    });
                }, itemsToShow * 80 + 200);

            }, 100);

        }, 300);

        // Обновляем слайдер если он активен
        if (isSliderActive) {
            setTimeout(() => {
                updateSliderAfterFilter();
            }, 800);
        }
    }

    // =============================================
    // СЛАЙДЕР ФУНКЦИИ
    // =============================================
    function updateSliderAfterFilter() {
        duplicateCardsToSlider();
        const sliderCards = portfolioTrack.querySelectorAll('.portfolio-card');
        totalSlides = sliderCards.length;
        currentSlide = 0;
        createDots();
        updateSlider();
        updateDots();
        updateCounter();
    }

    function duplicateCardsToSlider() {
        if (!portfolioTrack) return;

        portfolioTrack.innerHTML = '';
        const visibleCards = Array.from(document.querySelectorAll('.portfolio-card')).filter(card =>
            !card.classList.contains('filtered')
        );

        visibleCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.remove('filtered');
            clone.classList.add('animate');
            
            // Добавляем обработчик клика для клонированной карточки
            clone.addEventListener('click', function(e) {
                if (e.target.closest('.portfolio-btn') || e.target.closest('a')) {
                    return;
                }
                const projectId = parseInt(this.dataset.project);
                openProjectModal(projectId);
            });
            
            portfolioTrack.appendChild(clone);
        });

        totalSlides = visibleCards.length;
    }

    function checkSliderState() {
        isSliderActive = window.innerWidth < 1024;

        if (isSliderActive) {
            duplicateCardsToSlider();
            initSlider();
        } else {
            destroySlider();
        }
    }

    function initSlider() {
        if (!portfolioTrack) return;

        const sliderCards = portfolioTrack.querySelectorAll('.portfolio-card');
        totalSlides = sliderCards.length;
        currentSlide = 0;

        createDots();
        updateSlider();
        updateDots();
        updateCounter();
        addSliderEventListeners();
    }

    function destroySlider() {
        if (portfolioTrack) {
            portfolioTrack.style.transform = 'translateX(0)';
        }
        removeSliderEventListeners();
    }

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

    function goToSlide(slideIndex) {
        if (slideIndex < 0 || slideIndex >= totalSlides) return;
        currentSlide = slideIndex;
        updateSlider();
        updateDots();
        updateCounter();
    }

    function nextSlide() {
        if (totalSlides === 0) return;
        if (currentSlide >= totalSlides - 1) {
            currentSlide = 0;
        } else {
            currentSlide++;
        }
        goToSlide(currentSlide);
    }

    function prevSlide() {
        if (totalSlides === 0) return;
        if (currentSlide <= 0) {
            currentSlide = totalSlides - 1;
        } else {
            currentSlide--;
        }
        goToSlide(currentSlide);
    }

    function updateSlider() {
        if (!portfolioTrack || totalSlides === 0) return;
        const offset = currentSlide * 100;
        portfolioTrack.style.transform = `translateX(-${offset}%)`;
        updateSliderButtons();
    }

    function updateSliderButtons() {
        if (prevBtn) {
            prevBtn.disabled = totalSlides <= 1;
            prevBtn.style.opacity = totalSlides <= 1 ? '0.5' : '1';
        }
        if (nextBtn) {
            nextBtn.disabled = totalSlides <= 1;
            nextBtn.style.opacity = totalSlides <= 1 ? '0.5' : '1';
        }
    }

    function updateDots() {
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function updateCounter() {
        if (!sliderCounter) return;
        if (totalSlides === 0) {
            sliderCounter.textContent = 'Нет проектов';
        } else {
            sliderCounter.textContent = `${currentSlide + 1} из ${totalSlides}`;
        }
    }

    function addSliderEventListeners() {
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        if (portfolioTrack) {
            portfolioTrack.addEventListener('touchstart', handleTouchStart, { passive: false });
            portfolioTrack.addEventListener('touchmove', handleTouchMove, { passive: false });
            portfolioTrack.addEventListener('touchend', handleTouchEnd, { passive: false });
        }
    }

    function removeSliderEventListeners() {
        if (prevBtn) prevBtn.removeEventListener('click', prevSlide);
        if (nextBtn) nextBtn.removeEventListener('click', nextSlide);

        if (portfolioTrack) {
            portfolioTrack.removeEventListener('touchstart', handleTouchStart);
            portfolioTrack.removeEventListener('touchmove', handleTouchMove);
            portfolioTrack.removeEventListener('touchend', handleTouchEnd);
        }
    }

    // Touch события
    function handleTouchStart(e) {
        if (totalSlides <= 1) return;
        touchStartX = e.touches[0].clientX;
        touchEndX = touchStartX;
        isDragging = false;
        portfolioTrack.style.transition = 'none';
    }

    function handleTouchMove(e) {
        if (totalSlides <= 1) return;
        touchEndX = e.touches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 5) {
            isDragging = true;
            e.preventDefault();
            const maxDrag = 100;
            const dragOffset = Math.max(-maxDrag, Math.min(maxDrag, -diff * 0.3));
            const currentOffset = currentSlide * 100;
            portfolioTrack.style.transform = `translateX(-${currentOffset}%) translateX(${dragOffset}px)`;
        }
    }

    function handleTouchEnd(e) {
        if (totalSlides <= 1) return;
        portfolioTrack.style.transition = 'transform 0.3s ease';
        if (isDragging) {
            handleSwipe();
        }
        isDragging = false;
        updateSlider();
    }

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

    // =============================================
    // ИНИЦИАЛИЗАЦИЯ ГАЛЕРЕИ
    // =============================================
    function initGallery() {
        if (galleryPrev) {
            galleryPrev.addEventListener('click', () => {
                if (currentImageIndex > 0) {
                    currentImageIndex--;
                    updateModalImage();
                }
            });
        }

        if (galleryNext) {
            galleryNext.addEventListener('click', () => {
                if (currentImageIndex < modalImages.length - 1) {
                    currentImageIndex++;
                    updateModalImage();
                }
            });
        }
    }

    function updateModalImage() {
        if (modalImage && modalImages.length > 0) {
            modalImage.src = modalImages[currentImageIndex];
            
            // Обновляем кнопки навигации
            if (galleryPrev) {
                galleryPrev.disabled = currentImageIndex === 0;
            }
            if (galleryNext) {
                galleryNext.disabled = currentImageIndex === modalImages.length - 1;
            }
            
            // Обновляем точки навигации
            updateImageDots();
        }
    }

    function createImageDots() {
        if (!modalImageDots) return;
        
        modalImageDots.innerHTML = '';
        
        modalImages.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'modal-image-dot';
            dot.addEventListener('click', () => {
                currentImageIndex = index;
                updateModalImage();
            });
            modalImageDots.appendChild(dot);
        });
    }

    function updateImageDots() {
        if (!modalImageDots) return;
        
        const dots = modalImageDots.querySelectorAll('.modal-image-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentImageIndex);
        });
    }

    // =============================================
    // ОБРАБОТКА ИЗМЕНЕНИЯ РАЗМЕРА ОКНА
    // =============================================
    function handleResize() {
        const wasSliderActive = isSliderActive;
        checkSliderState();

        if (wasSliderActive !== isSliderActive) {
            filterProjects(activeFilter);
        }

        if (isSliderActive) {
            updateSliderButtons();
        }
    }

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

    const debouncedHandleResize = debounce(handleResize, 250);

    // =============================================
    // АНИМАЦИЯ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ
    // =============================================
    function initObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        // Наблюдаем за заголовками
        const portfolioTitle = document.querySelector('.portfolio-title');
        const portfolioSubtitle = document.querySelector('.portfolio-subtitle');

        if (portfolioTitle) observer.observe(portfolioTitle);
        if (portfolioSubtitle) observer.observe(portfolioSubtitle);
    }

    // =============================================
    // СОЗДАНИЕ СЧЕТЧИКА СЛАЙДОВ
    // =============================================
    function createSliderCounter() {
        if (!sliderCounter && document.querySelector('.portfolio .slider-dots')) {
            const counter = document.createElement('div');
            counter.className = 'slider-counter';
            document.querySelector('.portfolio .slider-dots').parentNode.insertBefore(
                counter,
                document.querySelector('.portfolio .slider-dots').nextSibling
            );
        }
    }

    // =============================================
    // ЗАПУСК ПРИЛОЖЕНИЯ
    // =============================================
    loadPortfolioData();
});

// =============================================
// МОДАЛЬНОЕ ОКНО - ГЛОБАЛЬНЫЕ ФУНКЦИИ
// =============================================
function openProjectModal(projectId) {
    const modal = document.getElementById('projectModal');
    
    console.log('Opening modal for project:', projectId);
    
    // Загружаем данные проекта из JSON
    fetch('portfolio.json')
        .then(response => response.json())
        .then(data => {
            const project = data.projects.find(p => p.id === projectId);
            
            if (!project) {
                console.error('Project not found:', projectId);
                return;
            }

            // Настраиваем галерею изображений
            window.modalImages = [...project.images]; // Копируем массив
            window.currentImageIndex = 0;

            console.log(`Project ${projectId} has ${window.modalImages.length} images:`, window.modalImages);

            // Заполняем модальное окно данными
            document.getElementById('modalImage').src = project.images[0];
            document.getElementById('modalImage').alt = project.title;
            document.getElementById('modalTitle').textContent = project.title;
            document.getElementById('modalCategory').textContent = project.categoryName;
            document.getElementById('modalDescription').textContent = project.description;

            // Технологии
            const modalTech = document.getElementById('modalTech');
            modalTech.innerHTML = '';
            project.technologies.forEach(tech => {
                const span = document.createElement('span');
                span.className = 'tech-tag';
                span.textContent = tech;
                modalTech.appendChild(span);
            });

            // Особенности
            const modalFeatures = document.getElementById('modalFeatures');
            modalFeatures.innerHTML = '';
            project.features.forEach(feature => {
                const li = document.createElement('li');
                li.textContent = feature;
                modalFeatures.appendChild(li);
            });

            // Ссылка на сайт
            document.getElementById('modalLiveLink').href = project.liveLink;

            // Инициализируем галерею
            initModalGallery();

            // Показываем модальное окно
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        })
        .catch(error => {
            console.error('Error loading project data:', error);
        });
}

function initModalGallery() {
    const modalImageDots = document.getElementById('modalImageDots');
    const galleryPrev = document.getElementById('galleryPrev');
    const galleryNext = document.getElementById('galleryNext');
    const modalImage = document.getElementById('modalImage');

    console.log(`Initializing gallery with ${window.modalImages.length} images`);

    // Создаем точки навигации только если изображений больше одного
    if (modalImageDots) {
        modalImageDots.innerHTML = '';
        
        if (window.modalImages.length > 1) {
            window.modalImages.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'modal-image-dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    window.currentImageIndex = index;
                    updateModalImage();
                });
                modalImageDots.appendChild(dot);
            });
        }
    }

    // Показываем/скрываем элементы навигации в зависимости от количества изображений
    const showNavigation = window.modalImages.length > 1;
    
    console.log(`Show navigation: ${showNavigation}`);
    
    if (galleryPrev) {
        galleryPrev.style.display = showNavigation ? 'flex' : 'none';
        galleryPrev.disabled = true; // Первое изображение - кнопка "назад" неактивна
    }
    
    if (galleryNext) {
        galleryNext.style.display = showNavigation ? 'flex' : 'none';
        galleryNext.disabled = window.modalImages.length <= 1;
    }
    
    if (modalImageDots) {
        modalImageDots.style.display = showNavigation ? 'flex' : 'none';
    }

    // Обработчики навигации
    if (galleryPrev) {
        galleryPrev.onclick = () => {
            if (window.currentImageIndex > 0) {
                window.currentImageIndex--;
                updateModalImage();
            }
        };
    }

    if (galleryNext) {
        galleryNext.onclick = () => {
            if (window.currentImageIndex < window.modalImages.length - 1) {
                window.currentImageIndex++;
                updateModalImage();
            }
        };
    }
}

function updateModalImage() {
    const modalImage = document.getElementById('modalImage');
    const galleryPrev = document.getElementById('galleryPrev');
    const galleryNext = document.getElementById('galleryNext');
    const modalImageDots = document.getElementById('modalImageDots');

    if (modalImage && window.modalImages.length > 0) {
        modalImage.src = window.modalImages[window.currentImageIndex];
        
        console.log(`Showing image ${window.currentImageIndex + 1} of ${window.modalImages.length}: ${window.modalImages[window.currentImageIndex]}`);
        
        // Обновляем кнопки навигации
        if (galleryPrev) {
            galleryPrev.disabled = window.currentImageIndex === 0;
        }
        if (galleryNext) {
            galleryNext.disabled = window.currentImageIndex === window.modalImages.length - 1;
        }
        
        // Обновляем точки навигации
        if (modalImageDots) {
            const dots = modalImageDots.querySelectorAll('.modal-image-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === window.currentImageIndex);
            });
        }
    }
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Сбрасываем галерею
    window.modalImages = [];
    window.currentImageIndex = 0;
}

// Закрытие модального окна по клику на overlay
document.addEventListener('click', function (e) {
    const modal = document.getElementById('projectModal');
    if (e.target === modal) {
        closeProjectModal();
    }
});

// Закрытие модального окна по ESC
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
});

// Навигация по галерее с помощью клавиш стрелок
document.addEventListener('keydown', function (e) {
    const modal = document.getElementById('projectModal');
    if (modal.classList.contains('active') && window.modalImages && window.modalImages.length > 1) {
        if (e.key === 'ArrowLeft' && window.currentImageIndex > 0) {
            window.currentImageIndex--;
            updateModalImage();
        } else if (e.key === 'ArrowRight' && window.currentImageIndex < window.modalImages.length - 1) {
            window.currentImageIndex++;
            updateModalImage();
        }
    }
});