/* ----------  smooth-scroll-reveal.js  ---------- */
(function () {
  /* 1. Подождать, пока страница загрузится полностью */
  function init() {
    /* 2. Селекторы для анимации */
    const selectors = [
      ".hero",
      ".investment",
      ".clients",
      ".benefits",
      ".corporate",
      ".advantages",
      ".advantages-section",
      ".schemes",
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

    /* 3. Функция для добавления классов анимации */
    function addAnimationClasses() {
      const elems = document.querySelectorAll(selectors.join(","));
      
      elems.forEach((el) => {
        // Если элемент уже видим при загрузке, сразу показываем его
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (!isVisible) {
          el.classList.add("sr");
        }
      });
      
      return elems;
    }

    /* 4. Создаём и вставляем стили один раз */
    const style = document.createElement("style");
    style.textContent = `
      .sr {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                    transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        will-change: opacity, transform;
      }
      
      .sr.show {
        opacity: 1;
        transform: translateY(0);
      }
      
      /* Специальные анимации для разных типов элементов */
      .sr-delay-1 { transition-delay: 0.1s; }
      .sr-delay-2 { transition-delay: 0.2s; }
      .sr-delay-3 { transition-delay: 0.3s; }
      .sr-delay-4 { transition-delay: 0.4s; }
      .sr-delay-5 { transition-delay: 0.5s; }
      
      /* Для анимации появления слева */
      .sr-left {
        opacity: 0;
        transform: translateX(-30px);
        transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                    transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      .sr-left.show {
        opacity: 1;
        transform: translateX(0);
      }
      
      /* Для анимации появления справа */
      .sr-right {
        opacity: 0;
        transform: translateX(30px);
        transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                    transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      .sr-right.show {
        opacity: 1;
        transform: translateX(0);
      }
      
      /* Для плавного увеличения */
      .sr-scale {
        opacity: 0;
        transform: scale(0.95);
        transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                    transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      .sr-scale.show {
        opacity: 1;
        transform: scale(1);
      }
      
      /* Элементы, которые должны быть сразу видны */
      .no-sr {
        opacity: 1 !important;
        transform: none !important;
      }
    `;
    document.head.appendChild(style);

    /* 5. Добавляем задержку для элементов внутри блоков */
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

    /* 6. Инициализация анимаций */
    const animatedElems = addAnimationClasses();
    addStaggerDelay(animatedElems);

    /* 7. IntersectionObserver с улучшенными настройками */
    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Показываем элемент
            entry.target.classList.add('show');
            
            // Для дочерних элементов с задержкой
            if (entry.target.classList.contains('advantages-section__grid') || 
                entry.target.classList.contains('benefits__cards') ||
                entry.target.classList.contains('corporate__cards') ||
                entry.target.classList.contains('team-section__members')) {
              
              const children = entry.target.children;
              Array.from(children).forEach((child) => {
                child.classList.add('show');
              });
            }
            
            // Не отключаем наблюдение после показа
            // observer.unobserve(entry.target);
          } else {
            // Убираем класс show только при скролле вверх далеко
            const rect = entry.target.getBoundingClientRect();
            if (rect.bottom < -100) { // Если элемент ушел далеко вверх
              entry.target.classList.remove('show');
            }
          }
        });
      },
      {
        threshold: 0.1, // Срабатывает при 10% видимости
        rootMargin: '0px 0px -50px 0px', // Небольшой отступ снизу
      }
    );

    /* 8. Начинаем наблюдение */
    animatedElems.forEach((el) => {
      io.observe(el);
    });

    /* 9. Принудительно показываем элементы, которые видны при загрузке */
    function checkInitialVisible() {
      const srElements = document.querySelectorAll('.sr');
      
      srElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          el.classList.add('show');
        }
      });
    }
    
    // Проверяем после небольшой задержки
    setTimeout(checkInitialVisible, 100);
    
    // И при изменении размера окна
    window.addEventListener('resize', checkInitialVisible);
  }

  /* 10. Запускаем после полной загрузки страницы */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();