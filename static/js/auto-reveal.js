/* ----------  smooth-scroll-reveal.js  ---------- */
(function () {
  /* 1. Подождать, пока страница загрузится полностью */
  function init() {
    /* 2. Селекторы для анимации */
    const selectors = [
      ".hero",
      ".investment",
      ".benefits",
      ".corporate",
      ".advantages",
      ".advantages-section",
      ".stories",
      ".how-section",
      ".about-section",
      ".team-section",
      ".mission-section",
      ".contacts",
      ".footer",
      ".process__step",
      ".stagger > *",
      ".hero-section",
      ".we-section",
      ".pluses-section",
      ".why-section",
      ".cases-section",
      ".brands-section",
      ".reviews-section",
      ".steps-section",
    ];

    /* 3. Настройки анимации */
    const animationConfig = {
      // Основные настройки
      baseDuration: 0.8,
      baseDelay: 0.1,
      // Настройки IntersectionObserver
      observerThreshold: 0.15, // Срабатывает при 15% видимости
      observerRootMargin: '0px 0px -30px 0px', // Плавный отступ снизу
      // Кривые Безье для плавности
      easing: 'cubic-bezier(0.16, 0.84, 0.44, 1)', // Более плавная кривая
      // Отступ для повторной анимации
      hideOffset: 150, // Когда элемент ушел на 150px вверх, его можно анимировать снова
    };

    /* 4. Функция для добавления классов анимации */
    function addAnimationClasses() {
      const elems = document.querySelectorAll(selectors.join(","));
      
      elems.forEach((el) => {
        // Если элемент уже видим при загрузке, сразу показываем его
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (!isVisible) {
          el.classList.add("sr");
          // Сохраняем первоначальное состояние
          el.dataset.animated = "false";
        } else {
          // Элементы, которые сразу видны
          el.classList.add("no-sr");
        }
      });
      
      return elems;
    }

    /* 5. Создаём и вставляем стили один раз */
    const style = document.createElement("style");
    style.textContent = `
      .sr {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity ${animationConfig.baseDuration}s ${animationConfig.easing}, 
                    transform ${animationConfig.baseDuration}s ${animationConfig.easing};
        will-change: opacity, transform;
        backface-visibility: hidden; /* Улучшает производительность */
      }
      
      .sr.show {
        opacity: 1;
        transform: translateY(0);
      }
      
      /* Специальные анимации для разных типов элементов */
      .sr-delay-1 { transition-delay: ${animationConfig.baseDelay * 1}s; }
      .sr-delay-2 { transition-delay: ${animationConfig.baseDelay * 2}s; }
      .sr-delay-3 { transition-delay: ${animationConfig.baseDelay * 3}s; }
      .sr-delay-4 { transition-delay: ${animationConfig.baseDelay * 4}s; }
      .sr-delay-5 { transition-delay: ${animationConfig.baseDelay * 5}s; }
      .sr-delay-6 { transition-delay: ${animationConfig.baseDelay * 6}s; }
      
      /* Для анимации появления слева */
      .sr-left {
        opacity: 0;
        transform: translateX(-30px);
        transition: opacity ${animationConfig.baseDuration}s ${animationConfig.easing}, 
                    transform ${animationConfig.baseDuration}s ${animationConfig.easing};
      }
      .sr-left.show {
        opacity: 1;
        transform: translateX(0);
      }
      
      /* Для анимации появления справа */
      .sr-right {
        opacity: 0;
        transform: translateX(30px);
        transition: opacity ${animationConfig.baseDuration}s ${animationConfig.easing}, 
                    transform ${animationConfig.baseDuration}s ${animationConfig.easing};
      }
      .sr-right.show {
        opacity: 1;
        transform: translateX(0);
      }
      
      /* Для плавного увеличения */
      .sr-scale {
        opacity: 0;
        transform: scale(0.95);
        transition: opacity ${animationConfig.baseDuration}s ${animationConfig.easing}, 
                    transform ${animationConfig.baseDuration}s ${animationConfig.easing};
      }
      .sr-scale.show {
        opacity: 1;
        transform: scale(1);
      }
      
      /* Элементы, которые должны быть сразу видны */
      .no-sr {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }
      
      /* Плавный ховер-эффект для интерактивных элементов */
      .sr a, .sr button, .sr .card {
        transition: all 0.3s ease;
      }
    `;
    document.head.appendChild(style);

    /* 6. Добавляем задержку для элементов внутри блоков */
    function addStaggerDelay(elems) {
      elems.forEach((el) => {
        // Добавляем задержку для дочерних элементов в определенных блоках
        if (el.classList.contains('advantages-section__grid') || 
            el.classList.contains('benefits__cards') ||
            el.classList.contains('corporate__cards') ||
            el.classList.contains('team-section__members')) {
          
          const children = el.children;
          Array.from(children).forEach((child, index) => {
            if (index < 6) { // Максимум 6 элементов
              child.classList.add(`sr-delay-${index + 1}`);
            }
          });
        }
      });
    }

    /* 7. Инициализация анимаций */
    const animatedElems = addAnimationClasses();
    addStaggerDelay(animatedElems);

    /* 8. Флаг для предотвращения множественных вызовов */
    let isAnimating = false;

    /* 9. IntersectionObserver с оптимизированными настройками */
    const io = new IntersectionObserver(
      (entries, observer) => {
        // Предотвращаем множественные вызовы
        if (isAnimating) return;
        isAnimating = true;
        
        requestAnimationFrame(() => {
          entries.forEach((entry) => {
            const element = entry.target;
            
            if (entry.isIntersecting) {
              // Если элемент уже был анимирован, не делаем это снова
              if (element.dataset.animated === "true") {
                // Просто показываем если скрыли
                if (!element.classList.contains('show')) {
                  element.classList.add('show');
                }
                return;
              }
              
              // Показываем элемент с небольшой задержкой для плавности
              setTimeout(() => {
                element.classList.add('show');
                element.dataset.animated = "true";
                
                // Для дочерних элементов с задержкой
                if (element.classList.contains('advantages-section__grid') || 
                    element.classList.contains('benefits__cards') ||
                    element.classList.contains('corporate__cards') ||
                    element.classList.contains('team-section__members')) {
                  
                  const children = element.children;
                  Array.from(children).forEach((child) => {
                    child.classList.add('show');
                    child.dataset.animated = "true";
                  });
                }
              }, 50);
              
            } else {
              // Убираем класс show только при скролле вверх далеко за пределы экрана
              const rect = element.getBoundingClientRect();
              if (rect.bottom < -animationConfig.hideOffset) {
                element.classList.remove('show');
              }
            }
          });
          
          isAnimating = false;
        });
      },
      {
        threshold: animationConfig.observerThreshold,
        rootMargin: animationConfig.observerRootMargin,
      }
    );

    /* 10. Начинаем наблюдение */
    animatedElems.forEach((el) => {
      if (el.classList.contains('sr')) {
        io.observe(el);
      }
    });

    /* 11. Принудительно показываем элементы, которые видны при загрузке */
    function checkInitialVisible() {
      const srElements = document.querySelectorAll('.sr');
      
      srElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && el.dataset.animated !== "true") {
          setTimeout(() => {
            el.classList.add('show');
            el.dataset.animated = "true";
          }, 100);
        }
      });
    }
    
    // Проверяем после небольшой задержки
    setTimeout(checkInitialVisible, 300);
    
    // И при изменении размера окна (с дебаунсом)
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkInitialVisible, 200);
    });

    /* 12. Обработка скролла для плавности */
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Минимальная логика для плавного скролла
          lastScrollY = window.scrollY;
          ticking = false;
        });
        ticking = true;
      }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* 13. Запускаем после полной загрузки страницы */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();