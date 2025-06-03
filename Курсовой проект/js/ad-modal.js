/**
 * Инициализация модального окна для рекламы
 */
class AdModal {
  constructor() {
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    try {
      // Загружаем HTML шаблон
      const response = await fetch('/templates/ad-modal.html');
      const html = await response.text();

      // Добавляем модальное окно в DOM
      document.body.insertAdjacentHTML('beforeend', html);

      // Инициализируем элементы
      this.modal = document.getElementById('adModal');
      this.adLinks = document.querySelectorAll('.rates__ad-link');
      this.closeButton = this.modal.querySelector('.modal__close');
      this.cancelButton = this.modal.querySelector('.modal__cancel');
      this.form = document.getElementById('adForm');

      // Добавляем обработчики событий
      this.initEventListeners();
      
      this.initialized = true;
    } catch (error) {
      console.error('Ошибка при инициализации модального окна:', error);
    }
  }

  initEventListeners() {
    // Открытие модального окна
    this.adLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal();
      });
    });

    // Закрытие модального окна
    this.closeButton.addEventListener('click', () => this.closeModal());
    this.cancelButton.addEventListener('click', () => this.closeModal());
    
    // Закрытие по клику на оверлей
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal || e.target.classList.contains('modal__overlay')) {
        this.closeModal();
      }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('is-active')) {
        this.closeModal();
      }
    });

    // Обработка отправки формы
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleSubmit(e);
    });
  }

  openModal() {
    this.modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.modal.classList.remove('is-active');
    document.body.style.overflow = '';
    this.form.reset();
  }

  async handleSubmit(e) {
    const submitButton = this.form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.classList.add('button--loading');

    try {
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());
      
      // Здесь будет отправка данных на сервер
      console.log('Отправка данных формы:', data);
      
      // Имитация отправки
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Показываем сообщение об успехе
      alert('Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
      
      // Закрываем модальное окно
      this.closeModal();
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.');
    } finally {
      submitButton.disabled = false;
      submitButton.classList.remove('button--loading');
    }
  }
}

// Создаем и инициализируем модальное окно при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  window.adModal = new AdModal();
  window.adModal.init();
}); 