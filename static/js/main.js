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
  }); // Modals

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
  } // Input Mask Phone

  const inputsPhonePhone = document.querySelectorAll(".js--phone-mask");

  function mask(event) {
    const keyCode = event.keyCode;
    const pos = this.selectionStart;
    if (pos < 3) event.preventDefault();
    let matrix = "+7 (___) ___-__-__",
      i = 0,
      def = matrix.replace(/\D/g, ""),
      val = this.value.replace(/\D/g, ""),
      newValue = matrix.replace(/[_\d]/g, function (a) {
        return i < val.length ? val.charAt(i++) : a;
      });
    i = newValue.indexOf("_");

    if (i !== -1) {
      newValue = newValue.slice(0, i);
    }

    let reg = new RegExp(
      "^" +
        matrix
          .substr(0, this.value.length)
          .replace(/_+/g, function (a) {
            return "\\d{1," + a.length + "}";
          })
          .replace(/[+()]/g, "\\$&") +
        "$"
    );

    if (
      !reg.test(this.value) ||
      this.value.length < 5 ||
      (keyCode > 47 && keyCode < 58)
    ) {
      this.value = newValue;
    }

    if (event.type === "blur" && this.value.length < 18) {
      this.value = "";
    }
  }

  inputsPhonePhone.forEach((input) => {
    input.addEventListener("input", mask, false);
    input.addEventListener("focus", mask, false);
    input.addEventListener("blur", mask, false);
    input.addEventListener("keydown", mask, false);
  }); // Swiper

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
    initialSlide: 0,
    spaceBetween: 24,
    loop: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: true,
    },
    navigation: {
      nextEl: ".reviews-section__arrow_next",
      prevEl: ".reviews-section__arrow_prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      992: {
        slidesPerView: 2,
        spaceBetween: 48,
      },
      1280: {
        centeredSlides: true,
        slidesPerView: 3,
        spaceBetween: 64,
      },
    },
  });
  reviewsSlider.on("autoplay", () => {
    reviewsSlider.autoplay.stop();
    reviewsSlider.slideTo(1);
  }); // Tabs

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
