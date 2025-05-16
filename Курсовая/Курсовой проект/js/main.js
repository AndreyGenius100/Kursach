/**
 * Общий JavaScript для всех страниц
 */
document.addEventListener('DOMContentLoaded', () => {
  // Элементы DOM
  const burgerMenuButton = document.querySelector('.burger-menu');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuCloseButton = document.querySelector('.mobile-menu__close');
  
  /**
   * Инициализация общих функций
   */
  const initialize = () => {
    // Настройка мобильного меню
    setupMobileMenu();
    
    // Эффекты прокрутки
    setupScrollEffects();
    
    // Настройка активных ссылок в меню
    highlightActiveLinks();
  };
  
  /**
   * Настройка мобильного меню
   */
  const setupMobileMenu = () => {
    // Открытие меню при клике на бургер
    burgerMenuButton?.addEventListener('click', () => {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden'; // Запрещаем прокрутку страницы
    });
    
    // Закрытие меню при клике на крестик
    mobileMenuCloseButton?.addEventListener('click', () => {
      closeMobileMenu();
    });
    
    // Закрытие меню при клике вне меню
    document.addEventListener('click', (e) => {
      if (mobileMenu?.classList.contains('active') && 
          !e.target.closest('.mobile-menu') && 
          !e.target.closest('.burger-menu')) {
        closeMobileMenu();
      }
    });
    
    // Закрытие меню при нажатии Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu?.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  };
  
  /**
   * Закрытие мобильного меню
   */
  const closeMobileMenu = () => {
    mobileMenu?.classList.remove('active');
    document.body.style.overflow = ''; // Разрешаем прокрутку страницы
  };
  
  /**
   * Настройка эффектов прокрутки
   */
  const setupScrollEffects = () => {
    // Элементы с эффектом появления
    const elements = document.querySelectorAll('[data-aos]');
    
    if (elements.length > 0) {
      // Функция для проверки видимости элементов
      const checkVisibility = () => {
        elements.forEach(element => {
          const elementTop = element.getBoundingClientRect().top;
          const windowHeight = window.innerHeight;
          
          if (elementTop < windowHeight * 0.85) {
            element.classList.add('aos-animate');
          }
        });
      };
      
      // Запускаем проверку при прокрутке
      window.addEventListener('scroll', checkVisibility);
      
      // Запускаем проверку сразу после загрузки
      checkVisibility();
    }
  };
  
  /**
   * Подсветка активных ссылок в меню
   */
  const highlightActiveLinks = () => {
    const currentPath = window.location.pathname;
    
    // Находим все ссылки в меню
    const navLinks = document.querySelectorAll('.nav__link, .mobile-menu__link');
    
    navLinks.forEach(link => {
      // Если ссылка соответствует текущему пути
      if (link.getAttribute('href') === currentPath || 
          (currentPath === '/' && link.getAttribute('href') === 'index.html')) {
        link.classList.add('nav__link--active');
        link.classList.add('mobile-menu__link--active');
      }
    });
  };
  
  // Инициализация
  initialize();
});