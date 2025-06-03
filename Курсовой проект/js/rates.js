/**
 * Функциональность страницы курсов валют
 */
document.addEventListener('DOMContentLoaded', () => {
  // Элементы DOM
  const currencyTableBody = document.getElementById('currency-table-body');
  const currentDateElement = document.getElementById('current-date');
  const lastUpdateTimeElement = document.getElementById('last-update-time');
  const currencyFilterSelect = document.getElementById('currency-filter');
  const currencySearchInput = document.getElementById('currency-search');
  const chartCurrencySelect = document.getElementById('chart-currency');
  const chartPeriodSelect = document.getElementById('chart-period');
  const periodButtons = document.querySelectorAll('.rates-chart__period-button');
  
  // Переменные
  let allCurrencies = [];
  let currentPeriod = 7;
  let chart = null;

  // Конфигурация графика
  const chartConfig = {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'USD/BYN',
        data: [],
        borderColor: '#27AE60',
        backgroundColor: 'rgba(39, 174, 96, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              return `Курс: ${context.parsed.y.toFixed(4)} BYN`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: false,
          ticks: {
            callback: function(value) {
              return value.toFixed(4);
            }
          }
        }
      }
    }
  };

  /**
   * Форматирование текущей даты
   */
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  /**
   * Форматирование текущего времени
   */
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Преобразование данных из API в нужный формат
   */
  const transformCurrencyData = (rates) => {
    const currencies = [];
    rates.forEach((rate, code) => {
      currencies.push({
        code: code,
        name: getCurrencyName(code),
        rate: rate.rate,
        scale: rate.scale,
        change: rate.change,
        popular: ['USD', 'EUR', 'RUB', 'CNY', 'GBP'].includes(code),
        region: getCurrencyRegion(code)
      });
    });
    return currencies;
  };

  /**
   * Получение названия валюты по коду
   */
  const getCurrencyName = (code) => {
    const names = {
      'USD': 'Доллар США',
      'EUR': 'Евро',
      'RUB': 'Российский рубль',
      'CNY': 'Китайский юань',
      'GBP': 'Фунт стерлингов',
      'JPY': 'Японская иена',
      'CHF': 'Швейцарский франк',
      'PLN': 'Польский злотый',
      'UAH': 'Украинская гривна',
      'CZK': 'Чешская крона',
      'AED': 'Дирхам ОАЭ',
      'AMD': 'Армянский драм',
      'AUD': 'Австралийский доллар',
      'BGN': 'Болгарский лев',
      'BRL': 'Бразильский реал',
      'CAD': 'Канадский доллар',
      'DKK': 'Датская крона',
      'INR': 'Индийская рупия',
      'IRR': 'Иранский риал',
      'ISK': 'Исландская крона',
      'KGS': 'Киргизский сом',
      'KWD': 'Кувейтский динар',
      'KZT': 'Казахстанский тенге',
      'MDL': 'Молдавский лей',
      'NOK': 'Норвежская крона',
      'NZD': 'Новозеландский доллар',
      'SEK': 'Шведская крона',
      'SGD': 'Сингапурский доллар',
      'TRY': 'Турецкая лира',
      'VND': 'Вьетнамский донг',
      'XDR': 'Специальные права заимствования'
    };
    return names[code] || code;
  };

  /**
   * Получение региона валюты по коду
   */
  const getCurrencyRegion = (code) => {
    const regions = {
      'USD': 'america',
      'EUR': 'europe',
      'RUB': 'europe',
      'CNY': 'asia',
      'GBP': 'europe',
      'JPY': 'asia',
      'CHF': 'europe',
      'PLN': 'europe',
      'UAH': 'europe',
      'CZK': 'europe'
    };
    return regions[code] || 'other';
  };
  
  /**
   * Инициализация страницы курсов валют
   */
  const initialize = async () => {
    try {
      // Получаем текущую дату
      const currentDate = new Date();
      
      // Устанавливаем текущую дату в заголовке
      if (currentDateElement) {
        currentDateElement.textContent = currentDate.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }

      // Получаем курсы валют
      const rates = await currencyAPI.getRates();
      
      // Обновляем время последнего обновления
      if (lastUpdateTimeElement) {
        lastUpdateTimeElement.textContent = currencyAPI.getLastUpdateDate();
      }

      // Заполняем таблицу курсов валют
      if (currencyTableBody) {
        currencyTableBody.innerHTML = ''; // Очищаем таблицу

        // Создаем строки таблицы для каждой валюты
        for (const [code, data] of rates) {
          const row = createCurrencyRow(code, data);
          currencyTableBody.appendChild(row);
        }
      }

      // Инициализируем фильтры и поиск
      initializeFilters();
      initializeSearch();

    } catch (error) {
      console.error('Error initializing page:', error);
      showError('Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.');
    }
  };
  
  /**
   * Создание строки таблицы для валюты
   */
  const createCurrencyRow = (code, data) => {
    const row = document.createElement('tr');
    row.className = 'rates__tr';
    row.dataset.currency = code;

    const change = data.change || 0;
    const changeClass = change > 0 ? 'positive' : change < 0 ? 'negative' : '';
    const changeSign = change > 0 ? '+' : '';

    row.innerHTML = `
      <td class="rates__td">
        <div class="currency-name">
          <span class="currency-fullname">${getCurrencyName(code)}</span>
        </div>
      </td>
      <td class="rates__td">${code}</td>
      <td class="rates__td">${data.scale}</td>
      <td class="rates__td">${data.rate.toFixed(4)}</td>
      <td class="rates__td ${changeClass}">
        <span class="change-value">${changeSign}${change.toFixed(4)}</span>
        ${getChangeIcon(change)}
      </td>
    `;

    return row;
  };

  /**
   * Получение иконки изменения курса
   */
  const getChangeIcon = (change) => {
    if (change > 0) {
      return `<svg class="change-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 4L12 8L4 8L8 4Z" fill="currentColor"/>
      </svg>`;
    } else if (change < 0) {
      return `<svg class="change-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 12L4 8L12 8L8 12Z" fill="currentColor"/>
      </svg>`;
    }
    return '';
  };

  /**
   * Инициализация фильтров
   */
  const initializeFilters = () => {
    const filterSelect = document.getElementById('currency-filter');
    if (!filterSelect) return;

    filterSelect.addEventListener('change', function() {
      const value = this.value;
      const rows = document.querySelectorAll('#currency-table-body tr');

      rows.forEach(row => {
        const code = row.dataset.currency;
        let show = true;

        switch (value) {
          case 'popular':
            show = ['USD', 'EUR', 'RUB', 'CNY', 'GBP'].includes(code);
            break;
          case 'europe':
            show = ['EUR', 'GBP', 'BGN', 'DKK', 'ISK', 'NOK', 'SEK'].includes(code);
            break;
          case 'asia':
            show = ['CNY', 'JPY', 'KRW', 'SGD', 'VND'].includes(code);
            break;
          case 'america':
            show = ['USD', 'CAD', 'BRL'].includes(code);
            break;
        }

        row.style.display = show || value === 'all' ? '' : 'none';
      });
    });
  };

  /**
   * Инициализация поиска
   */
  const initializeSearch = () => {
    const searchInput = document.getElementById('currency-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
      const searchText = this.value.toLowerCase();
      const rows = document.querySelectorAll('#currency-table-body tr');

      rows.forEach(row => {
        const code = row.dataset.currency;
        const name = getCurrencyName(code).toLowerCase();
        const show = code.toLowerCase().includes(searchText) || 
                    name.includes(searchText);
        
        row.style.display = show ? '' : 'none';
      });
    });
  };
  
  /**
   * Отображение сообщения об ошибке
   * @param {string} message - Текст ошибки
   */
  const showError = (message) => {
    console.error(message);
    // Можно добавить отображение ошибки в UI
  };
  
  /**
   * Инициализация графика
   */
  const initializeChart = async () => {
    try {
      const ctx = document.getElementById('ratesChart').getContext('2d');
      
      // Создаем график
      chart = new Chart(ctx, chartConfig);

      // Добавляем обработчики событий для селектов
      if (chartCurrencySelect) {
        // Очищаем существующие опции
        chartCurrencySelect.innerHTML = '';
        
        // Добавляем опции валют
        const popularCurrencies = ['USD', 'EUR', 'RUB', 'CNY', 'GBP', 'JPY'];
        popularCurrencies.forEach(code => {
          const option = document.createElement('option');
          option.value = code;
          option.textContent = `${code} - ${getCurrencyName(code)}`;
          chartCurrencySelect.appendChild(option);
        });

        chartCurrencySelect.addEventListener('change', (e) => {
          updateChartData();
        });
      }

      if (chartPeriodSelect) {
        chartPeriodSelect.addEventListener('change', (e) => {
          updateChartData();
        });
      }

      // Загружаем начальные данные
      await updateChartData();
    } catch (error) {
      console.error('Error initializing chart:', error);
      showChartError('Ошибка при инициализации графика');
    }
  };

  /**
   * Обновление данных графика
   */
  const updateChartData = async () => {
    const loadingEl = document.getElementById('chartLoading');
    const errorEl = document.getElementById('chartError');
    
    try {
      if (!chart) {
        throw new Error('График не инициализирован');
      }

      // Показываем загрузку
      if (loadingEl) loadingEl.style.display = 'flex';
      if (errorEl) errorEl.style.display = 'none';

      const currency = chartCurrencySelect.value;
      const period = parseInt(chartPeriodSelect.value);

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - period);

      console.log(`Fetching chart data for ${currency} from ${formatDate(startDate)} to ${formatDate(endDate)}`);

      const currencyId = currencyAPI.currencyIds[currency];
      if (!currencyId) {
        throw new Error('Неверный код валюты');
      }

      const url = `https://api.nbrb.by/exrates/rates/dynamics/${currencyId}?startdate=${formatDate(startDate)}&enddate=${formatDate(endDate)}`;
      console.log('Fetching from URL:', url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);

      if (!data || data.length === 0) {
        throw new Error('Нет данных для отображения');
      }

      // Обновляем данные графика
      chart.data.labels = data.map(item => formatDateForDisplay(item.Date));
      chart.data.datasets[0].data = data.map(item => item.Cur_OfficialRate);
      chart.data.datasets[0].label = `${currency}/BYN`;
      
      // Обновляем график
      chart.update('active');

      // Скрываем загрузку
      if (loadingEl) loadingEl.style.display = 'none';
    } catch (error) {
      console.error('Error updating chart:', error);
      showChartError(error.message);
      if (loadingEl) loadingEl.style.display = 'none';
    }
  };

  /**
   * Отображение ошибки графика
   */
  const showChartError = (message) => {
    const errorEl = document.getElementById('chartError');
    if (errorEl) {
      errorEl.style.display = 'flex';
      errorEl.querySelector('p').textContent = message;
    }
  };

  /**
   * Форматирование даты для API
   */
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  /**
   * Форматирование даты для отображения
   */
  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  // Обработчики событий
  currencyFilterSelect.addEventListener('change', () => {
    const filter = currencyFilterSelect.value;
    const search = currencySearchInput.value;
    filterCurrencies(filter, search);
  });
  
  currencySearchInput.addEventListener('input', () => {
    const filter = currencyFilterSelect.value;
    const search = currencySearchInput.value;
    filterCurrencies(filter, search);
  });
  
  // Обработчики для кнопок периода
  periodButtons.forEach(button => {
    button.addEventListener('click', () => {
      const period = parseInt(button.dataset.period, 10);
      
      // Обновляем активную кнопку
      periodButtons.forEach(btn => btn.classList.remove('rates-chart__period-button--active'));
      button.classList.add('rates-chart__period-button--active');
      
      // Обновляем период и график
      currentPeriod = period;
      updateChartData();
    });
  });
  
  // Инициализация модального окна для рекламы
  const initializeAdModal = () => {
    const modal = document.getElementById('adModal');
    const adLinks = document.querySelectorAll('.rates__ad-link');
    const closeButton = modal.querySelector('.modal__close');
    const cancelButton = modal.querySelector('.modal__cancel');
    const form = document.getElementById('adForm');

    // Открытие модального окна
    adLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('is-active');
        document.body.style.overflow = 'hidden';
      });
    });

    // Закрытие модального окна
    const closeModal = () => {
      modal.classList.remove('is-active');
      document.body.style.overflow = '';
      form.reset();
    };

    closeButton.addEventListener('click', closeModal);
    cancelButton.addEventListener('click', closeModal);
    
    // Закрытие по клику на оверлей
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('modal__overlay')) {
        closeModal();
      }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-active')) {
        closeModal();
      }
    });

    // Обработка отправки формы
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      try {
        // Здесь будет отправка данных на сервер
        console.log('Отправка данных формы:', data);
        
        // Имитация отправки
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Показываем сообщение об успехе
        alert('Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
        
        // Закрываем модальное окно
        closeModal();
      } catch (error) {
        console.error('Ошибка при отправке формы:', error);
        alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.');
      }
    });
  };

  // Инициализация
  initialize();
  initializeChart();
  initializeAdModal();
});