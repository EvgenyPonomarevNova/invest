// Простые анимации для элементов без сложной логики
document.addEventListener('DOMContentLoaded', function() {
  // Функция для проверки видимости элемента
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
      rect.bottom >= 0
    );
  }

  // Функция для обработки анимаций
  function handleScrollAnimations() {
    // Анимации для advantage-item
    document.querySelectorAll('.advantage-item').forEach(item => {
      if (isElementInViewport(item) && !item.classList.contains('visible')) {
        item.classList.add('visible');
      }
    });

    // Анимации для team-member
    document.querySelectorAll('.team-member').forEach(member => {
      if (isElementInViewport(member) && !member.classList.contains('visible')) {
        member.classList.add('visible');
      }
    });

    // Анимации для benefits-card и corporate-card
    document.querySelectorAll('.benefits-card, .corporate-card').forEach(card => {
      if (isElementInViewport(card) && !card.classList.contains('visible')) {
        card.classList.add('visible');
      }
    });

    // Анимации для текстов
    document.querySelectorAll('.hero__description-text, .investment__content-left-text, .investment__content-right-text, .clients__description-text, .benefits-card__text, .corporate-card__text, .advantage-item__text, .mission-section__text').forEach(text => {
      if (isElementInViewport(text) && !text.classList.contains('visible')) {
        text.classList.add('visible');
      }
    });

    // Анимации для кнопок
    document.querySelectorAll('.button, .hero__button, .clients-card__button, .benefits__button-link, .corporate__button').forEach(btn => {
      if (isElementInViewport(btn) && !btn.classList.contains('visible')) {
        btn.classList.add('visible');
      }
    });

    // Анимации для сеток
    document.querySelectorAll('.advantages-section__grid, .benefits__cards, .corporate__cards').forEach(grid => {
      if (isElementInViewport(grid) && !grid.classList.contains('visible')) {
        grid.classList.add('visible');
      }
    });
  }

  // Запускаем при загрузке
  handleScrollAnimations();

  // И при скролле
  window.addEventListener('scroll', handleScrollAnimations);
  window.addEventListener('resize', handleScrollAnimations);

  // Также запускаем с задержкой для элементов, которые видны сразу
  setTimeout(handleScrollAnimations, 500);
});