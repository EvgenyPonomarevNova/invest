document.addEventListener("DOMContentLoaded", () => {
  // Header Burger
  const burgerBtn = document.querySelectorAll(".js--menu-toggle");

  if (burgerBtn.length > 0) {
    burgerBtn.forEach(function (toggleBtn) {
      toggleBtn.addEventListener("click", function (e) {
        e.preventDefault();
        this.classList.toggle("header__burger_active");
        document
          .querySelector(".header__content")
          .classList.toggle("header__content_show");
      });
    });
  } // Anchor

  const scrollToElements = document.querySelectorAll(".js--scroll-to");
  scrollToElements.forEach((element) => {
    element.addEventListener("click", function (event) {
      event.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  }); 
  
  // Modals

  const modals = document.querySelectorAll(".modal");
  const modalButtons = document.querySelectorAll("[data-modal]");
  const modalCloseButtons = document.querySelectorAll(".js--modal-close");

  if (modals.length > 0 && modalButtons.length > 0) {
    const closeAllModals = () => {
      modals.forEach((modal) => {
        modal.classList.remove("active");
      });
    };

    modalButtons.forEach((button) => {
      button.addEventListener("click", () => {
        closeAllModals();
        const modalId = button.getAttribute("data-modal");
        const modal = document.getElementById(modalId);

        if (modal) {
          modal.classList.add("active");
        }
      });
    });
    modals.forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (
          !e.target.closest(".modal-container") ||
          e.target.classList.contains("modal-close")
        ) {
          modal.classList.remove("active");
        }
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
          modal.classList.remove("active");
        }
      });
    });
    modalCloseButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const modal = button.closest(".modal");

        if (modal) {
          modal.classList.remove("active");
        }
      });
    });
  } 
  
   // Swiper

  const casesSlider = new Swiper(".js--cases-slider", {
    slidesPerView: 1,
    loop: true,
    autoHeight: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".cases-section__arrow_next",
      prevEl: ".cases-section__arrow_prev",
    },
  });
  const brandsSlidebar = new Swiper(".js--brands-slider", {
    slidesPerView: 2,
    spaceBetween: 24,
    loop: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 3,
      },
      992: {
        slidesPerView: 4,
      },
      1280: {
        slidesPerView: 5,
      },
    },
  });


















const reviewsSlider = new Swiper(".js--reviews-slider", {
  slidesPerView: 1,
  spaceBetween: 24,
  loop: true,
  navigation: {
    nextEl: ".reviews-section__arrow_next",
    prevEl: ".reviews-section__arrow_prev",
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  // Важно: настраиваем Swiper для работы с iframe
  preventInteractionOnTransition: false,
  allowTouchMove: true,
  touchStartPreventDefault: false,
  touchReleaseOnEdges: true,
  // Специальные настройки для iframe
  noSwiping: false,
  noSwipingClass: 'swiper-slide',
  noSwipingSelector: 'iframe',
  // Отключаем некоторые фичи для мобильных
  breakpoints: {
    992: {
      slidesPerView: 2,
      spaceBetween: 48,
    },
    1280: {
      slidesPerView: 3,
      spaceBetween: 64,
      centeredSlides: true,
    },
  },
  // События
  on: {
    init: function() {
      // На мобильных отключаем pointer-events у iframe
      if (window.innerWidth < 992) {
        const iframes = this.el.querySelectorAll('iframe');
        iframes.forEach(iframe => {
          iframe.style.pointerEvents = 'none';
        });
      }
    },
    resize: function() {
      // Обновляем pointer-events при изменении размера
      const iframes = this.el.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        iframe.style.pointerEvents = window.innerWidth < 992 ? 'none' : 'auto';
      });
    }
  }
});








/* ============================================
   КАСТОМНЫЙ СЛАЙДЕР ОТЗЫВОВ - ИСПРАВЛЕННАЯ ВЕРСИЯ
   ============================================ */

class MobileReviewsSlider {
  constructor() {
    console.log('📱 Инициализация слайдера для мобильных...');
    
    // Находим элементы
    this.slider = document.getElementById('customReviewsSlider');
    if (!this.slider) {
      console.error('❌ Слайдер не найден!');
      return;
    }
    
    this.wrapper = this.slider.querySelector('.swiper-wrapper');
    this.slides = Array.from(this.slider.querySelectorAll('.swiper-slide'));
    this.prevBtn = document.querySelector('.reviews-section__arrow_prev');
    this.nextBtn = document.querySelector('.reviews-section__arrow_next');
    this.pagination = this.slider.querySelector('.swiper-pagination');
    
    if (!this.wrapper || this.slides.length === 0) {
      console.error('❌ Нет слайдов!');
      return;
    }
    
    console.log(`✅ Найдено ${this.slides.length} слайдов`);
    
    // Настройки
    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.isAnimating = false;
    this.isMobile = window.innerWidth <= 767;
    this.touchStartX = 0;
    this.touchCurrentX = 0;
    this.isDragging = false;
    
    // Инициализация
    this.init();
  }
  
  init() {
    console.log(`📱 Режим: ${this.isMobile ? 'Мобильный' : 'Десктоп'}`);
    
    // 1. Настраиваем слайды
    this.setupSlides();
    
    // 2. Создаем пагинацию
    this.createPagination();
    
    // 3. Настраиваем события
    this.setupEvents();
    
    // 4. Показываем первый слайд
    this.showSlide(this.currentIndex);
    
    console.log('✅ Слайдер инициализирован!');
  }
  
  setupSlides() {
    // Настраиваем wrapper
    this.wrapper.style.display = 'flex';
    this.wrapper.style.width = '100%';
    this.wrapper.style.transition = 'transform 0.4s ease';
    
    // Устанавливаем базовые стили для всех слайдов
    this.slides.forEach((slide, index) => {
      // ВАЖНО: на мобильных ВСЕ слайды должны быть видимы для анимации
      slide.style.cssText = `
        flex: 0 0 100%;
        width: 100%;
        opacity: ${index === 0 ? '1' : '0'};
        transform: ${index === 0 ? 'scale(1)' : 'scale(0.95)'};
        transition: all 0.4s ease;
        display: block !important; /* ВАЖНО: все слайды видны для анимации */
        visibility: ${index === 0 ? 'visible' : 'hidden'};
        position: relative;
      `;
    });
  }
  
  createPagination() {
    if (!this.pagination) return;
    
    this.pagination.innerHTML = '';
    
    for (let i = 0; i < this.totalSlides; i++) {
      const bullet = document.createElement('span');
      bullet.className = 'swiper-pagination-bullet';
      bullet.setAttribute('data-index', i);
      
      Object.assign(bullet.style, {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        background: i === this.currentIndex ? 'var(--color-accent)' : '#ddd',
        margin: '0 6px',
        cursor: 'pointer',
        display: 'inline-block',
        transition: 'all 0.3s ease',
        border: i === this.currentIndex ? '2px solid var(--color-accent)' : '2px solid transparent'
      });
      
      bullet.addEventListener('click', () => {
        this.goToSlide(i);
      });
      
      this.pagination.appendChild(bullet);
    }
  }
  
  updatePagination() {
    if (!this.pagination) return;
    
    const bullets = this.pagination.querySelectorAll('.swiper-pagination-bullet');
    bullets.forEach((bullet, index) => {
      bullet.style.background = index === this.currentIndex ? 'var(--color-accent)' : '#ddd';
      bullet.style.border = index === this.currentIndex ? '2px solid var(--color-accent)' : '2px solid transparent';
      bullet.style.transform = index === this.currentIndex ? 'scale(1.2)' : 'scale(1)';
    });
  }
  
  setupEvents() {
    // Настраиваем свайп на мобильных
    this.setupSwipeEvents();
    
    // Настраиваем кнопки на десктопе
    if (!this.isMobile) {
      this.setupDesktopButtons();
    }
    
    // Пауза при наведении
    this.slider.addEventListener('mouseenter', () => {
      if (this.autoplayTimer) clearInterval(this.autoplayTimer);
    });
    
    this.slider.addEventListener('mouseleave', () => {
      this.startAutoplay();
    });
  }
  
  setupDesktopButtons() {
    // Кнопка "Назад"
    if (this.prevBtn) {
      // Клонируем чтобы удалить старые обработчики
      const newPrevBtn = this.prevBtn.cloneNode(true);
      this.prevBtn.parentNode.replaceChild(newPrevBtn, this.prevBtn);
      this.prevBtn = newPrevBtn;
      
      this.prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.prev();
      });
      
      this.prevBtn.style.cursor = 'pointer';
    }
    
    // Кнопка "Вперед"
    if (this.nextBtn) {
      const newNextBtn = this.nextBtn.cloneNode(true);
      this.nextBtn.parentNode.replaceChild(newNextBtn, this.nextBtn);
      this.nextBtn = newNextBtn;
      
      this.nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.next();
      });
      
      this.nextBtn.style.cursor = 'pointer';
    }
  }
  
  setupSwipeEvents() {
    if (!this.isMobile) return;
    
    console.log('👆 Настройка свайпа для мобильных...');
    
    this.slider.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
      this.touchCurrentX = this.touchStartX;
      this.isDragging = true;
      
      // Останавливаем автопрокрутку при начале свайпа
      if (this.autoplayTimer) clearInterval(this.autoplayTimer);
      
      // Добавляем активный класс для стилей
      this.slider.classList.add('dragging');
      
    }, { passive: true });
    
    this.slider.addEventListener('touchmove', (e) => {
      if (!this.isDragging) return;
      
      this.touchCurrentX = e.touches[0].clientX;
      const diff = this.touchStartX - this.touchCurrentX;
      
      // Если свайп достаточно сильный, предотвращаем вертикальную прокрутку
      if (Math.abs(diff) > 10) {
        e.preventDefault();
      }
      
      // Плавно двигаем слайды во время свайпа
      this.moveSlidesDuringSwipe(diff);
      
    }, { passive: false }); // passive: false чтобы можно было preventDefault
    
    this.slider.addEventListener('touchend', (e) => {
      if (!this.isDragging) return;
      
      const diff = this.touchStartX - this.touchCurrentX;
      const threshold = 50; // Минимальный свайп для переключения
      const velocity = Math.abs(diff) / 300; // Простая "скорость" свайпа
      
      console.log(`👆 Свайп завершен, разница: ${diff}px, скорость: ${velocity}`);
      
      // Определяем направление свайпа
      if (diff > threshold || (diff > 20 && velocity > 0.3)) {
        // Свайп вправо - следующий слайд
        this.next();
      } else if (diff < -threshold || (diff < -20 && velocity > 0.3)) {
        // Свайп влево - предыдущий слайд
        this.prev();
      } else {
        // Свайп недостаточный, возвращаем текущий слайд
        this.showSlide(this.currentIndex);
      }
      
      this.isDragging = false;
      this.slider.classList.remove('dragging');
      
      // Запускаем автопрокрутку снова
      this.startAutoplay();
      
    }, { passive: true });
  }
  
  moveSlidesDuringSwipe(diff) {
    // Рассчитываем смещение для текущего свайпа
    const slideWidth = this.slider.clientWidth;
    const baseOffset = -this.currentIndex * 100;
    const swipeOffset = (diff / slideWidth) * 100;
    const totalOffset = baseOffset + swipeOffset;
    
    // Применяем смещение
    this.wrapper.style.transform = `translateX(${totalOffset}%)`;
    this.wrapper.style.transition = 'none'; // Отключаем анимацию во время свайпа
    
    // Показываем/скрываем соседние слайды во время свайпа
    this.updateSlideVisibilityDuringSwipe(diff);
  }
  
  updateSlideVisibilityDuringSwipe(diff) {
    const direction = diff > 0 ? 1 : -1;
    const nextIndex = this.currentIndex + direction;
    
    // Проверяем что следующий слайд существует
    if (nextIndex >= 0 && nextIndex < this.totalSlides) {
      const currentSlide = this.slides[this.currentIndex];
      const nextSlide = this.slides[nextIndex];
      
      // Плавно меняем opacity во время свайпа
      const progress = Math.min(Math.abs(diff) / 150, 1);
      
      if (direction > 0) {
        // Свайп вправо - уходим влево
        currentSlide.style.opacity = 1 - progress;
        currentSlide.style.transform = `scale(${1 - progress * 0.1})`;
        
        nextSlide.style.opacity = progress;
        nextSlide.style.transform = `scale(${0.9 + progress * 0.1})`;
        nextSlide.style.visibility = 'visible';
      } else {
        // Свайп влево - уходим вправо
        currentSlide.style.opacity = 1 - progress;
        currentSlide.style.transform = `scale(${1 - progress * 0.1})`;
        
        nextSlide.style.opacity = progress;
        nextSlide.style.transform = `scale(${0.9 + progress * 0.1})`;
        nextSlide.style.visibility = 'visible';
      }
    }
  }
  
  showSlide(index, animate = true) {
    if (this.isAnimating) return;
    if (index < 0) index = 0;
    if (index >= this.totalSlides) index = this.totalSlides - 1;
    
    console.log(`🎯 Показываем слайд ${index + 1} из ${this.totalSlides}`);
    
    this.isAnimating = true;
    this.currentIndex = index;
    
    // Включаем анимацию
    if (animate) {
      this.wrapper.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    } else {
      this.wrapper.style.transition = 'none';
    }
    
    // Смещаем wrapper
    const offset = -index * 100;
    this.wrapper.style.transform = `translateX(${offset}%)`;
    
    // Обновляем видимость слайдов
    this.updateSlidesVisibility();
    
    // Обновляем пагинацию
    this.updatePagination();
    
    // Сбрасываем флаг анимации
    setTimeout(() => {
      this.isAnimating = false;
    }, 400);
  }
  
  updateSlidesVisibility() {
    this.slides.forEach((slide, index) => {
      if (index === this.currentIndex) {
        // Активный слайд
        slide.style.opacity = '1';
        slide.style.transform = 'scale(1)';
        slide.style.visibility = 'visible';
        slide.style.zIndex = '2';
      } else if (index === this.currentIndex - 1 || index === this.currentIndex + 1) {
        // Соседние слайды (для превью)
        slide.style.opacity = '0';
        slide.style.transform = 'scale(0.95)';
        slide.style.visibility = 'hidden';
        slide.style.zIndex = '1';
      } else {
        // Все остальные слайды
        slide.style.opacity = '0';
        slide.style.transform = 'scale(0.9)';
        slide.style.visibility = 'hidden';
        slide.style.zIndex = '0';
      }
    });
  }
  
  goToSlide(index) {
    this.showSlide(index);
  }
  
  next() {
    let nextIndex = this.currentIndex + 1;
    if (nextIndex >= this.totalSlides) {
      nextIndex = 0; // Зацикливаем
    }
    this.showSlide(nextIndex);
  }
  
  prev() {
    let prevIndex = this.currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = this.totalSlides - 1; // Зацикливаем
    }
    this.showSlide(prevIndex);
  }
  
  startAutoplay() {
    // Очищаем предыдущий таймер
    if (this.autoplayTimer) clearInterval(this.autoplayTimer);
    
    // Запускаем новый только если не на мобильном или если явно разрешено
    if (this.isMobile) return; // На мобильных не автопрокручиваем
    
    this.autoplayTimer = setInterval(() => {
      this.next();
    }, 5000);
  }
  
  stopAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM загружен, запускаем мобильный слайдер...');
  
  // Запускаем с небольшой задержкой
  setTimeout(() => {
    window.mobileReviewsSlider = new MobileReviewsSlider();
    
    if (window.mobileReviewsSlider && window.mobileReviewsSlider.slider) {
      console.log('✅ Мобильный слайдер создан!');
      
      // Для тестирования
      console.log('💡 Для управления в консоли:');
      console.log('   mobileReviewsSlider.next() - следующий слайд');
      console.log('   mobileReviewsSlider.prev() - предыдущий слайд');
      console.log('   mobileReviewsSlider.goToSlide(2) - перейти к слайду 3');
    }
  }, 300);
});







  // Tabs

  const tabs = document.querySelectorAll(".steps-section__tabs-item");
  const contents = document.querySelectorAll(".steps-section__content");
  const select = document.querySelector(".steps-section__tabs-select select");
  let currentIndex = 0;
  let interval;

  function activateTab(index) {
    tabs.forEach((tab) =>
      tab.classList.remove("steps-section__tabs-item_active")
    );
    contents.forEach((content) =>
      content.classList.remove("steps-section__content_show")
    );
    if (tabs[index])
      tabs[index].classList.add("steps-section__tabs-item_active");
    if (contents[index])
      contents[index].classList.add("steps-section__content_show");
    currentIndex = index;
  }

  function initHoverTabs() {
    if (window.innerWidth >= 992) {
      tabs.forEach((tab, index) => {
        tab.addEventListener("mouseenter", () => {
          activateTab(index);
          resetInterval();
        });
      });
      resetInterval();
    } else {
      clearInterval(interval);
    }
  }

  function autoSwitch() {
    currentIndex = (currentIndex + 1) % tabs.length;
    activateTab(currentIndex);
  }

  function resetInterval() {
    clearInterval(interval);
    interval = setInterval(autoSwitch, 15000);
  }

  if (select) {
    select.addEventListener("change", () => {
      const index = select.selectedIndex;
      activateTab(index);
    });
  }

  function setEqualHeight() {
    const sections = document.querySelectorAll(".steps-section__content");
    sections.forEach((section) => (section.style.height = "auto"));

    if (window.innerWidth >= 992) {
      let maxHeight = 0;
      sections.forEach((section) => {
        const height = section.offsetHeight;
        if (height > maxHeight) maxHeight = height;
      });
      sections.forEach((section) => (section.style.height = `${maxHeight}px`));
    }
  }

  window.addEventListener("load", () => {
    initHoverTabs();
    setEqualHeight();
  });
  window.addEventListener("resize", () => {
    initHoverTabs();
    setEqualHeight();
  }); // Hero video bugfix

  const heroVideo = document.getElementById("heroVideo");
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.playsInline = true;
    heroVideo.autoplay = true;
    heroVideo.loop = true;
    heroVideo.play().catch(() => {});
  }

  function animateCount(el) {
    const start = 0;
    const end = parseFloat(el.getAttribute("data-count"));
    const diff = Math.abs(end - start);
    const baseDuration = parseFloat(el.getAttribute("data-speed")) || 250;
    const duration = baseDuration * (diff / 1);
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = start + (end - start) * progress;
      el.textContent =
        end % 1 !== 0 ? currentValue.toFixed(1) : Math.floor(currentValue);
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.right > 0
    );
  }

  function checkElements() {
    document.querySelectorAll(".fadeIn").forEach((el) => {
      if (isElementInViewport(el)) {
        el.classList.add("fadeIn_active");
      } else {
        el.classList.remove("fadeIn_active");
      }
    });
    document.querySelectorAll("[data-count]").forEach((el) => {
      if (isElementInViewport(el)) {
        if (!el.classList.contains("counted")) {
          el.classList.add("counted");
          animateCount(el);
        }
      } else {
        el.classList.remove("counted");
        el.textContent = "0";
      }
    });
  }

  window.addEventListener("scroll", checkElements);
  window.addEventListener("resize", checkElements);
  window.addEventListener("DOMContentLoaded", () => {
    setTimeout(checkElements, 200);
  }); // Header Show Bottom

  function toggleHeaderClass() {
    const headerSection = document.querySelector(".header");

    if (window.scrollY > 20) {
      headerSection.classList.add("header_scroll");
    } else {
      headerSection.classList.remove("header_scroll");
    }
  }

  window.addEventListener("DOMContentLoaded", toggleHeaderClass);
  window.addEventListener("scroll", toggleHeaderClass); // Hack Height Mobile

  const setAppHeight = () => {
    document.documentElement.style.setProperty(
      "--vh",
      `${window.innerHeight * 0.01}px`
    );
  };

  window.addEventListener("resize", setAppHeight);
  setAppHeight();



  
});

      /* ---------- Country-phone selector – clean & stable ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initAllCountrySelectors();          // обычные формы
  initModalCountrySelectors();        // модалки
});
console.log('>>> NEW SCRIPT LOADED');

/* --------- 1. Обычные селекторы (вне модалок) --------- */
function initAllCountrySelectors() {
  document.querySelectorAll('.country-select').forEach($root => {
    if ($root.closest('.modal')) return; // их обработает пункт 2
    buildCountrySelector($root);
  });
}

/* --------- 2. Селекторы внутри модалок (появляются динамически) --------- */
function initModalCountrySelectors() {
  const observer = new MutationObserver(list => {
    list.forEach(rec => {
      rec.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        node.querySelectorAll?.('.country-select').forEach($root => {
          if (!$root.classList.contains('ready')) buildCountrySelector($root);
        });
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

/* --------- 3. Один селектор --------- */
function buildCountrySelector($root) {
  if ($root.classList.contains('ready')) return;
  $root.classList.add('ready');

  const $toggle  = $root.querySelector('.country-select-toggle');
  const $drop    = $root.querySelector('.country-dropdown');
  const $options = [...$drop.querySelectorAll('.country-option')];
  const $phone   = $root.closest('.phone-input').querySelector('.phone-number');
  const $hidden  = $root.closest('.phone-input').querySelector('input[name="country_code"]');

  /* открыть / закрыть */
  $toggle.addEventListener('click', e => {
    e.stopPropagation();
    const open = $root.classList.contains('open');
    closeAllDropdowns();
    if (!open) $root.classList.add('open');
  });

  /* выбор страны */
  $options.forEach($opt => {
    $opt.addEventListener('click', e => {
      e.stopPropagation();
      const code = $opt.dataset.code;
      const flag = $opt.querySelector('img').src;
      const name = $opt.querySelector('span').textContent.split(' (')[0];

      $toggle.querySelector('.country-flag').src = flag;
      $toggle.querySelector('.country-flag').alt = name;
      $toggle.querySelector('.country-code').textContent = code;
      if ($hidden) $hidden.value = code;

      closeAllDropdowns();
      $phone.focus();
    });
  });
}

/* --------- 4. Закрытие по клику вне / ESC --------- */
document.addEventListener('click', closeAllDropdowns);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeAllDropdowns();
});

function closeAllDropdowns() {
  document.querySelectorAll('.country-select.open').forEach(r => r.classList.remove('open'));
}


// Steps Slider для мобильных
const stepsSlider = new Swiper(".js--steps-slider", {
  slidesPerView: 1,
  loop: false,
  spaceBetween: 20,
  autoHeight: true,
  
  // Автопрокрутка
  autoplay: {
    delay: 5000, // 5 секунд
    disableOnInteraction: true,
    pauseOnMouseEnter: false,
    waitForTransition: true, // Ждать завершения анимации
  },
  
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true, // Динамические буллеты (опционально)
  },
  
  navigation: {
    nextEl: ".steps-section__slider-arrow_next",
    prevEl: ".steps-section__slider-arrow_prev",
  },
  
  speed: 600,
  
  breakpoints: {
    992: {
      enabled: false,
      autoplay: false,
    }
  },
  
  // Для плавной автоматической прокрутки
  effect: 'slide', // 'fade', 'cube', 'coverflow' - можно экспериментировать
  fadeEffect: {
    crossFade: true
  },
});

// Перезапуск автопрокрутки после ручного взаимодействия
let autoplayTimeout;

function restartAutoplay(swiper, delay = 8000) {
  clearTimeout(autoplayTimeout);
  
  autoplayTimeout = setTimeout(() => {
    if (swiper && !swiper.destroyed && !swiper.autoplay.running) {
      swiper.autoplay.start();
    }
  }, delay);
}

// Обработчики событий для рестарта автопрокрутки
stepsSlider.on('touchStart', function() {
  this.autoplay.stop();
});

stepsSlider.on('slideChange', function () {
  this.updateAutoHeight();
  restartAutoplay(this, 8000); // Перезапустить через 8 секунд
});

// Также перезапускаем при клике на пагинацию
document.querySelectorAll('.js--steps-slider .swiper-pagination-bullet').forEach(bullet => {
  bullet.addEventListener('click', () => {
    restartAutoplay(stepsSlider, 8000);
  });
});

// Перезапускаем при клике на стрелки
document.querySelectorAll('.steps-section__slider-arrow').forEach(arrow => {
  arrow.addEventListener('click', () => {
    restartAutoplay(stepsSlider, 8000);
  });
});

console.log('Window width:', window.innerWidth);
console.log('Slider container width:', document.querySelector('.js--partners-slider')?.offsetWidth);