/* ----------  scroll-reveal.js  ---------- */
(function () {
  /* 1.  Селекторы, которые будем «оживлять» */
  const selectors = [
    ".hero",
    ".investment",
    ".clients",
    ".benefits",
    ".corporate",
    ".advantages",
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
  ];

  /* 2.  Создаём и вставляем стили один раз */
  const style = document.createElement("style");
  style.textContent = `
    .sr {
      opacity: 0;
      transform: translateY(40px);
      transition: opacity .9s ease-out, transform .9s ease-out;
    }
    .sr.show {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  /* 3.  Добавляем класс .sr всем подходящим элементам */
  const elems = document.querySelectorAll(selectors.join(","));
  elems.forEach((el) => el.classList.add("sr"));

  /* 4.  IntersectionObserver: показываем / прячем */
  const io = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        } else {
          /* когда уходим вверх – убираем, чтобы при новом скролле вниз
           анимация сработала снова */
          entry.target.classList.remove("show");
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  elems.forEach((el) => io.observe(el));
})();
