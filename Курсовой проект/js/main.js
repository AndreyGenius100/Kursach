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
    console.log('Инициализация мобильного меню');
    console.log('Бургер кнопка:', burgerMenuButton);
    console.log('Мобильное меню:', mobileMenu);
    console.log('Кнопка закрытия:', mobileMenuCloseButton);

    if (!burgerMenuButton || !mobileMenu) {
      console.warn('Элементы мобильного меню не найдены');
      return;
    }

    // Единый обработчик для клика по бургер-меню
    burgerMenuButton.addEventListener('click', (e) => {
      console.log('Клик по бургер-меню');
      e.preventDefault();
      e.stopPropagation();
      
      burgerMenuButton.classList.toggle('burger-menu--active');
      mobileMenu.classList.toggle('active');
      
      const isMenuActive = mobileMenu.classList.contains('active');
      console.log('Состояние меню:', isMenuActive ? 'открыто' : 'закрыто');
      
      // Блокируем/разблокируем прокрутку страницы
      document.body.style.overflow = isMenuActive ? 'hidden' : '';
    });
    
    // Обработчик для кнопки закрытия мобильного меню
    if (mobileMenuCloseButton) {
      mobileMenuCloseButton.addEventListener('click', () => {
        console.log('Клик по кнопке закрытия');
        closeMobileMenu();
      });
    }
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.burger-menu') && 
          !e.target.closest('.mobile-menu') && 
          mobileMenu.classList.contains('active')) {
        console.log('Клик вне меню');
        closeMobileMenu();
      }
    });
    
    // Закрытие меню при нажатии Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        console.log('Нажата клавиша Escape');
        closeMobileMenu();
      }
    });
  };
  
  /**
   * Закрытие мобильного меню
   */
  const closeMobileMenu = () => {
    console.log('Закрытие мобильного меню');
    if (mobileMenu && burgerMenuButton) {
      mobileMenu.classList.remove('active');
      burgerMenuButton.classList.remove('burger-menu--active');
      document.body.style.overflow = '';
      console.log('Меню закрыто');
    }
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
        link.classList.add(link.classList.contains('nav__link') ? 'nav__link--active' : 'mobile-menu__link--active');
      }
    });
  };
  
  // Инициализация
  initialize();
});