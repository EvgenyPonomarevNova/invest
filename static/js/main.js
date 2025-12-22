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
    heroVideo.play().catch(() => { });
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
document.addEventListener("DOMContentLoaded", () => {
  initAllCountrySelectors(); // обычные формы
  initModalCountrySelectors(); // модалки
});
console.log(">>> NEW SCRIPT LOADED");

/* --------- 1. Обычные селекторы (вне модалок) --------- */
function initAllCountrySelectors() {
  document.querySelectorAll(".country-select").forEach(($root) => {
    if ($root.closest(".modal")) return; // их обработает пункт 2
    buildCountrySelector($root);
  });
}

/* --------- 2. Селекторы внутри модалок (появляются динамически) --------- */
function initModalCountrySelectors() {
  const observer = new MutationObserver((list) => {
    list.forEach((rec) => {
      rec.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        node.querySelectorAll?.(".country-select").forEach(($root) => {
          if (!$root.classList.contains("ready")) buildCountrySelector($root);
        });
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

/* --------- 3. Один селектор --------- */
function buildCountrySelector($root) {
  if ($root.classList.contains("ready")) return;
  $root.classList.add("ready");

  const $toggle = $root.querySelector(".country-select-toggle");
  const $drop = $root.querySelector(".country-dropdown");
  const $options = [...$drop.querySelectorAll(".country-option")];
  const $phone = $root.closest(".phone-input").querySelector(".phone-number");
  const $hidden = $root
    .closest(".phone-input")
    .querySelector('input[name="country_code"]');

  /* открыть / закрыть */
  $toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = $root.classList.contains("open");
    closeAllDropdowns();
    if (!open) $root.classList.add("open");
  });

  /* выбор страны */
  $options.forEach(($opt) => {
    $opt.addEventListener("click", (e) => {
      e.stopPropagation();
      const code = $opt.dataset.code;
      const flag = $opt.querySelector("img").src;
      const name = $opt.querySelector("span").textContent.split(" (")[0];

      $toggle.querySelector(".country-flag").src = flag;
      $toggle.querySelector(".country-flag").alt = name;
      $toggle.querySelector(".country-code").textContent = code;
      if ($hidden) $hidden.value = code;

      closeAllDropdowns();
      $phone.focus();
    });
  });
}

/* --------- 4. Закрытие по клику вне / ESC --------- */
document.addEventListener("click", closeAllDropdowns);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAllDropdowns();
});

function closeAllDropdowns() {
  document
    .querySelectorAll(".country-select.open")
    .forEach((r) => r.classList.remove("open"));
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
    },
  },

  // Для плавной автоматической прокрутки
  effect: "slide", // 'fade', 'cube', 'coverflow' - можно экспериментировать
  fadeEffect: {
    crossFade: true,
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
stepsSlider.on("touchStart", function () {
  this.autoplay.stop();
});

stepsSlider.on("slideChange", function () {
  this.updateAutoHeight();
  restartAutoplay(this, 8000); // Перезапустить через 8 секунд
});

// Также перезапускаем при клике на пагинацию
document
  .querySelectorAll(".js--steps-slider .swiper-pagination-bullet")
  .forEach((bullet) => {
    bullet.addEventListener("click", () => {
      restartAutoplay(stepsSlider, 8000);
    });
  });

// Перезапускаем при клике на стрелки
document.querySelectorAll(".steps-section__slider-arrow").forEach((arrow) => {
  arrow.addEventListener("click", () => {
    restartAutoplay(stepsSlider, 8000);
  });
});

console.log("Window width:", window.innerWidth);
console.log(
  "Slider container width:",
  document.querySelector(".js--partners-slider")?.offsetWidth
);
