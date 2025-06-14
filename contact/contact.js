// contact/contact.js

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    
    // Элементы полей
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const phoneInput = document.getElementById('userPhone');
    const messageInput = document.getElementById('userMessage');
    
    // Элементы ошибок
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const messageError = document.getElementById('messageError');

    // Функция получения элемента ошибки
    function getErrorElement(input) {
        const inputId = input.id;
        let errorId;
        
        switch(inputId) {
            case 'userName':
                errorId = 'nameError';
                break;
            case 'userEmail':
                errorId = 'emailError';
                break;
            case 'userPhone':
                errorId = 'phoneError';
                break;
            case 'userMessage':
                errorId = 'messageError';
                break;
            default:
                errorId = inputId + 'Error';
        }
        
        return document.getElementById(errorId);
    }

    // ИСПРАВЛЕНИЕ: Сразу показываем все элементы
    function initializeVisibility() {
        const elementsToShow = [
            '.contact-title',
            '.contact-subtitle', 
            '.contact-form-section',
            '.contact-info-section'
        ];
        
        elementsToShow.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.classList.add('animate');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0) translateX(0)';
            }
        });
    }

    initializeVisibility();

    // Удаляем ошибки при фокусе
    [nameInput, emailInput, phoneInput, messageInput].forEach(input => {
        if (input) {
            input.addEventListener('focus', function() {
                clearFieldError(this);
            });
        }
    });

    // Функция очистки ошибки поля
    function clearFieldError(input) {
        input.classList.remove('error');
        const errorElement = getErrorElement(input);
        if (errorElement) {
            errorElement.classList.remove('show');
            errorElement.textContent = '';
        }
    }

    // Функция показа ошибки поля
    function showFieldError(input, message) {
        input.classList.add('error');
        const errorElement = getErrorElement(input);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    // Валидация имени
    function validateName(name) {
        if (!name.trim()) {
            return 'Пожалуйста, введите ваше имя';
        }
        if (name.trim().length < 2) {
            return 'Имя должно содержать минимум 2 символа';
        }
        if (!/^[а-яёa-z\s\-]+$/i.test(name.trim())) {
            return 'Имя может содержать только буквы';
        }
        return null;
    }

    // Валидация email
    function validateEmail(email) {
        if (!email.trim()) {
            return 'Пожалуйста, введите ваш email';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return 'Пожалуйста, введите корректный email';
        }
        return null;
    }

    // Валидация телефона
    function validatePhone(phone) {
        if (!phone.trim()) {
            return 'Пожалуйста, введите номер телефона';
        }
        return null;
    }

    // Валидация сообщения
    function validateMessage(message) {
        if (message.trim().length > 500) {
            return 'Сообщение не должно превышать 500 символов';
        }
        return null;
    }

    // Общая валидация формы
    function validateForm() {
        let isValid = true;

        // Очищаем предыдущие ошибки
        [nameInput, emailInput, phoneInput, messageInput].forEach(input => {
            if (input) clearFieldError(input);
        });

        // Валидируем имя
        if (nameInput) {
            const nameErrorMsg = validateName(nameInput.value);
            if (nameErrorMsg) {
                showFieldError(nameInput, nameErrorMsg);
                isValid = false;
            }
        }

        // Валидируем email
        if (emailInput) {
            const emailErrorMsg = validateEmail(emailInput.value);
            if (emailErrorMsg) {
                showFieldError(emailInput, emailErrorMsg);
                isValid = false;
            }
        }

        // Валидируем телефон
        if (phoneInput) {
            const phoneErrorMsg = validatePhone(phoneInput.value);
            if (phoneErrorMsg) {
                showFieldError(phoneInput, phoneErrorMsg);
                isValid = false;
            }
        }

        // Валидируем сообщение
        if (messageInput) {
            const messageErrorMsg = validateMessage(messageInput.value);
            if (messageErrorMsg) {
                showFieldError(messageInput, messageErrorMsg);
                isValid = false;
            }
        }

        return isValid;
    }

    // Отправка формы
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Скрываем предыдущее сообщение об успехе
            if (successMessage) {
                successMessage.classList.remove('show');
            }
            
            // Валидируем форму
            if (!validateForm()) {
                return;
            }

            // Показываем состояние загрузки
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
            }

            // Собираем данные формы
            const formData = new FormData(contactForm);

            try {
                console.log('Отправляем запрос на сервер...');
                
                // Отправляем данные на сервер
                const response = await fetch('./send-form.php', {
                    method: 'POST',
                    body: formData
                });

                console.log('Статус ответа:', response.status);
                console.log('Content-Type:', response.headers.get('content-type'));

                // Проверяем статус ответа
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
                }

                // Получаем текст ответа
                const responseText = await response.text();
                console.log('Ответ сервера:', responseText);

                // Пытаемся парсить JSON
                let result;
                try {
                    result = JSON.parse(responseText);
                } catch (jsonError) {
                    console.error('Ошибка парсинга JSON:', jsonError);
                    console.error('Полученный текст:', responseText);
                    throw new Error('Сервер вернул некорректный ответ. Проверьте файл send-form.php');
                }

                if (result.success) {
                    // Успешная отправка
                    showSuccessMessage();
                    contactForm.reset();
                } else {
                    // Ошибка на сервере
                    throw new Error(result.message || 'Произошла ошибка при отправке');
                }

            } catch (error) {
                // Ошибка сети или сервера
                console.error('Ошибка:', error);
                showErrorMessage(error.message);
            } finally {
                // Убираем состояние загрузки
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }
            }
        });
    }

    // Показ сообщения об успехе
    function showSuccessMessage() {
        if (successMessage) {
            successMessage.classList.add('show');
            
            // Прокручиваем к сообщению
            successMessage.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });

            // Автоматически скрываем через 10 секунд
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 10000);
        }
    }

    // Показ сообщения об ошибке
    function showErrorMessage(message) {
        // Используем систему уведомлений из основного скрипта
        if (window.showNotification) {
            window.showNotification(message, 'error', 5000);
        } else {
            alert('Ошибка: ' + message);
        }
    }

    // Улучшенные эффекты для полей ввода
    [nameInput, emailInput, phoneInput, messageInput].forEach(input => {
        if (input) {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
                if (this.value.trim()) {
                    this.parentElement.classList.add('filled');
                } else {
                    this.parentElement.classList.remove('filled');
                }
            });

            // Проверяем при загрузке страницы
            if (input.value.trim()) {
                input.parentElement.classList.add('filled');
            }
        }
    });

    // Автоматическое изменение размера textarea
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }

    // Анимация появления элементов при прокрутке
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) translateX(0)';
                }
            });
        }, observerOptions);

        const elementsToObserve = [
            '.contact-title',
            '.contact-subtitle',
            '.contact-form-section',
            '.contact-info-section'
        ];

        elementsToObserve.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                observer.observe(element);
            }
        });
    }

    setTimeout(initScrollAnimations, 100);

    // Fallback: показываем элементы принудительно
    setTimeout(() => {
        const hiddenElements = document.querySelectorAll('.contact [style*="opacity: 0"], .contact-title:not(.animate), .contact-subtitle:not(.animate)');
        hiddenElements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) translateX(0)';
            element.classList.add('animate');
        });
    }, 1000);

    console.log('✅ Contact form initialized successfully');
});

// Дополнительная функция для принудительного показа всех элементов
function forceShowContactElements() {
    const contactSection = document.querySelector('.contact');
    if (contactSection) {
        const allElements = contactSection.querySelectorAll('*');
        allElements.forEach(element => {
            if (window.getComputedStyle(element).opacity === '0') {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0) translateX(0)';
                element.classList.add('animate');
            }
        });
    }
}

window.addEventListener('load', forceShowContactElements);