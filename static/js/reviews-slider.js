// static/js/reviews-slider.js
(function () {
    'use strict';

    console.log('🎬 Загрузка изолированного слайдера отзывов...');

    // Ждем полной загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSlider);
    } else {
        setTimeout(initSlider, 100);
    }

    function initSlider() {
        console.log('🔍 Поиск элементов слайдера...');

        // Находим элементы по ОДНОЙ специфичной структуре
        const container = document.querySelector('.reviews-slider-container');
        if (!container) {
            console.log('❌ Контейнер слайдера не найден');
            return;
        }

        const track = container.querySelector('.reviews-slider-track');
        const slides = container.querySelectorAll('.reviews-slider-slide');
        const prevBtn = container.querySelector('.reviews-slider-arrow--prev');
        const nextBtn = container.querySelector('.reviews-slider-arrow--next');
        const pagination = container.querySelector('.reviews-slider-pagination');

        if (!track || slides.length === 0) {
            console.error('❌ Основные элементы слайдера не найдены');
            return;
        }

        console.log(`✅ Найдено ${slides.length} слайдов`);

        // Создаем слайдер
        createSlider({
            container,
            track,
            slides: Array.from(slides),
            prevBtn,
            nextBtn,
            pagination
        });
    }

    function createSlider(elements) {
        const { container, track, slides, prevBtn, nextBtn, pagination } = elements;

        // Настройки
        let currentIndex = 0;
        let isAnimating = false;
        let autoPlayInterval = null;
        let slidesPerView = getSlidesPerView();
        let isMobile = slidesPerView === 1;
        let maxIndex = Math.max(0, slides.length - slidesPerView);

        console.log(`📱 Режим: ${isMobile ? 'Мобильный' : slidesPerView === 2 ? 'Планшет' : 'Десктоп'}`);

        // Инициализация
        setupSlides();
        setupNavigation();
        createPagination();
        updateSlider();

        if (!isMobile) {
            startAutoPlay();
        }

        // Обработка изменения размера окна
        setupResizeHandler();

        console.log('✅ Слайдер создан и работает!');

        // ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====

        function getSlidesPerView() {
            const width = window.innerWidth;
            if (width <= 767) return 1;
            if (width <= 991) return 2;
            return 3;
        }

        function setupSlides() {
            const slideWidth = 100 / slidesPerView;

            slides.forEach(slide => {
                slide.style.flex = `0 0 ${slideWidth}%`;
                slide.style.width = `${slideWidth}%`;
                slide.classList.remove('reviews-slider-slide--active');
            });

            // Обновляем maxIndex
            maxIndex = Math.max(0, slides.length - slidesPerView);

            // Первый слайд активный
            slides[0].classList.add('reviews-slider-slide--active');
        }

        function setupNavigation() {
            // Кнопка "Назад"
            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    prevSlide();
                });
            }

            // Кнопка "Вперед"
            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    nextSlide();
                });
            }

            // Свайп на мобильных
            if (isMobile) {
                setupSwipe();
            }
        }

        function setupSwipe() {
            console.log('👆 Настройка свайпа для мобильных...');

            let startX = 0;
            let startY = 0;
            let isSwiping = false;
            const minSwipeDistance = 50;

            // Начинаем свайп
            container.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                isSwiping = true;

                // Останавливаем анимацию если есть
                track.style.transition = 'none';
            }, { passive: true });

            // Движение во время свайпа
            container.addEventListener('touchmove', (e) => {
                if (!isSwiping) return;

                const currentX = e.touches[0].clientX;
                const currentY = e.touches[0].clientY;

                // Проверяем что это горизонтальный свайп, а не вертикальный
                const diffX = startX - currentX;
                const diffY = startY - currentY;

                // Если вертикальный свайп больше горизонтального - это скролл страницы
                if (Math.abs(diffY) > Math.abs(diffX)) {
                    isSwiping = false;
                    return;
                }

                // Предотвращаем вертикальный скролл при горизонтальном свайпе
                e.preventDefault();

                // Рассчитываем смещение для визуальной обратной связи
                const slideWidth = container.offsetWidth;
                const offset = (currentIndex * slideWidth) + (startX - currentX);
                track.style.transform = `translateX(-${offset}px)`;
            }, { passive: false });

            // Заканчиваем свайп
            container.addEventListener('touchend', (e) => {
                if (!isSwiping) return;

                const endX = e.changedTouches[0].clientX;
                const distance = startX - endX;

                // Восстанавливаем анимацию
                track.style.transition = 'transform 0.5s ease-in-out';

                if (Math.abs(distance) > minSwipeDistance) {
                    if (distance > 0) {
                        // Свайп вправо -> следующий слайд
                        console.log('👆 Свайп вправо -> следующий слайд');
                        nextSlide();
                    } else {
                        // Свайп влево -> предыдущий слайд
                        console.log('👆 Свайп влево -> предыдущий слайд');
                        prevSlide();
                    }
                } else {
                    // Возвращаем на место
                    updateSlider();
                }

                isSwiping = false;
            }, { passive: true });

            // Отмена свайпа
            container.addEventListener('touchcancel', () => {
                isSwiping = false;
                track.style.transition = 'transform 0.5s ease-in-out';
                updateSlider();
            }, { passive: true });
        }

        function createPagination() {
            if (!pagination) return;

            pagination.innerHTML = '';

            // Для мобильных - точки для каждого слайда
            const totalDots = isMobile ? slides.length : maxIndex + 1;

            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('button');
                dot.className = 'reviews-slider-dot';
                dot.type = 'button';
                dot.setAttribute('aria-label', `Перейти к слайду ${i + 1}`);

                if (i === 0) {
                    dot.classList.add('reviews-slider-dot--active');
                }

                dot.addEventListener('click', () => {
                    const targetIndex = isMobile ? i : i;
                    goToSlide(targetIndex);
                });

                pagination.appendChild(dot);
            }
        }

        function updateSlider() {
            if (isAnimating) return;

            isAnimating = true;

            // Рассчитываем смещение
            const slideWidth = 100 / slidesPerView;
            const offset = currentIndex * slideWidth;

            // Применяем смещение
            track.style.transform = `translateX(-${offset}%)`;

            // Обновляем активные слайды
            updateActiveSlides();

            // Обновляем пагинацию
            updatePagination();

            // Сбрасываем флаг анимации
            setTimeout(() => {
                isAnimating = false;
            }, 500);
        }

        function updateActiveSlides() {
            slides.forEach((slide, index) => {
                slide.classList.remove('reviews-slider-slide--active');

                if (isMobile) {
                    // На мобильных только текущий слайд активный
                    if (index === currentIndex) {
                        slide.classList.add('reviews-slider-slide--active');
                    }
                } else {
                    // На десктопе и планшетах - все видимые слайды
                    const start = currentIndex;
                    const end = currentIndex + slidesPerView - 1;

                    if (index >= start && index <= end) {
                        slide.classList.add('reviews-slider-slide--active');
                    }
                }
            });
        }

        function updatePagination() {
            if (!pagination) return;

            const dots = pagination.querySelectorAll('.reviews-slider-dot');

            if (isMobile) {
                // Для мобильных - активная точка для текущего слайда
                dots.forEach((dot, index) => {
                    dot.classList.toggle('reviews-slider-dot--active', index === currentIndex);
                });
            } else {
                // Для десктопа - активная точка для группы слайдов
                dots.forEach((dot, index) => {
                    dot.classList.toggle('reviews-slider-dot--active', index === currentIndex);
                });
            }
        }

        function goToSlide(index) {
            // Проверяем границы
            if (index < 0) index = 0;
            if (isMobile) {
                if (index >= slides.length) index = slides.length - 1;
            } else {
                if (index > maxIndex) index = maxIndex;
            }

            currentIndex = index;
            updateSlider();
            restartAutoPlay();
        }

        function nextSlide() {
            let nextIndex = currentIndex + 1;

            if (isMobile) {
                if (nextIndex >= slides.length) {
                    nextIndex = 0; // Зацикливаем
                }
            } else {
                if (nextIndex > maxIndex) {
                    nextIndex = 0; // Возвращаемся к началу
                }
            }

            goToSlide(nextIndex);
        }

        function prevSlide() {
            let prevIndex = currentIndex - 1;

            if (isMobile) {
                if (prevIndex < 0) {
                    prevIndex = slides.length - 1; // Переходим к последнему
                }
            } else {
                if (prevIndex < 0) {
                    prevIndex = maxIndex; // Переходим к последней группе
                }
            }

            goToSlide(prevIndex);
        }

        function startAutoPlay() {
            if (autoPlayInterval || isMobile) {
                return;
            }

            console.log('▶️ Автопрокрутка запущена (5 секунд)');

            autoPlayInterval = setInterval(() => {
                console.log('⏩ Автопрокрутка: следующий слайд');
                nextSlide();
            }, 5000);
        }

        function stopAutoPlay() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
                console.log('⏸️ Автопрокрутка остановлена');
            }
        }

        function restartAutoPlay() {
            if (isMobile) return;

            stopAutoPlay();

            // Перезапускаем через 3 секунды после ручного взаимодействия
            setTimeout(() => {
                startAutoPlay();
            }, 3000);
        }

        function setupResizeHandler() {
            let resizeTimeout;

            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    console.log('🔄 Обработка изменения размера окна...');
                    handleResize();
                }, 250);
            });
        }

        function handleResize() {
            const oldIsMobile = isMobile;
            const oldSlidesPerView = slidesPerView;

            // Останавливаем автопрокрутку
            stopAutoPlay();

            // Обновляем настройки
            slidesPerView = getSlidesPerView();
            isMobile = slidesPerView === 1;

            console.log(`📱 Новый режим: ${isMobile ? 'Мобильный' : slidesPerView === 2 ? 'Планшет' : 'Десктоп'}`);

            // Настраиваем слайды
            setupSlides();

            // Пересоздаем пагинацию
            createPagination();

            // Корректируем текущий индекс
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }

            updateSlider();

            // Если переключились с мобильного на десктоп или наоборот
            if (oldIsMobile !== isMobile) {
                console.log(`🔄 Переключение режима: ${oldIsMobile ? 'мобильный → ' : 'десктоп → '}${isMobile ? 'мобильный' : 'десктоп'}`);

                // Удаляем старые обработчики свайпа
                if (oldIsMobile) {
                    // Можно добавить очистку обработчиков если нужно
                }

                // Добавляем новые обработчики
                if (isMobile) {
                    setupSwipe();
                }
            }

            // Запускаем автопрокрутку если не мобильный
            if (!isMobile) {
                setTimeout(() => {
                    startAutoPlay();
                }, 1000);
            }
        }

        // Добавляем обработчики для паузы при наведении
        if (!isMobile) {
            container.addEventListener('mouseenter', () => {
                console.log('🖱️ Наведение мыши - пауза автопрокрутки');
                stopAutoPlay();
            });

            container.addEventListener('mouseleave', () => {
                console.log('🖱️ Убрали мышь - возобновление автопрокрутки');
                setTimeout(() => {
                    startAutoPlay();
                }, 1000);
            });
        }

        // Экспортируем API для отладки
        window.reviewsSliderAPI = {
            next: nextSlide,
            prev: prevSlide,
            goTo: goToSlide,
            getCurrent: () => currentIndex + 1,
            getMode: () => isMobile ? 'mobile' : slidesPerView === 2 ? 'tablet' : 'desktop',
            startAutoPlay: startAutoPlay,
            stopAutoPlay: stopAutoPlay,
            destroy: stopAutoPlay
        };
    }
})();