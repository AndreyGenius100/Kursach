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
  const periodButtons = document.querySelectorAll('.rates-chart__period-button');
  
  // Переменные
  let allCurrencies = [];
  let currentPeriod = 7;
  let chart = null;
  
  /**
   * Инициализация страницы курсов валют
   */
  const initialize = async () => {
    try {
      // Устанавливаем текущую дату
      currentDateElement.textContent = API.getCurrentDate();
      lastUpdateTimeElement.textContent = API.getCurrentTime();
      
      // Загружаем курсы валют
      allCurrencies = await API.getAllRates();
      
      // Отображаем таблицу валют
      renderCurrencyTable(allCurrencies);
      
      // Инициализируем график
      await initializeChart();
    } catch (error) {
      showError('Ошибка при загрузке данных: ' + error.message);
    }
  };
  
  /**
   * Отображение таблицы курсов валют
   * @param {Array} currencies - Массив валют для отображения
   */
  const renderCurrencyTable = (currencies) => {
    currencyTableBody.innerHTML = '';
    
    if (currencies.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.className = 'rates__loading';
      emptyRow.innerHTML = '<td colspan="5">Нет данных по курсам валют</td>';
      currencyTableBody.appendChild(emptyRow);
      return;
    }
    
    // Сортируем валюты: популярные сверху, затем по алфавиту
    const sortedCurrencies = [...currencies]
      .filter(curr => curr.code !== 'BYN') // Исключаем BYN из таблицы
      .sort((a, b) => {
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        return a.name.localeCompare(b.name);
      });
    
    // Создаем строки таблицы
    sortedCurrencies.forEach(currency => {
      const row = document.createElement('tr');
      
      // Цвет для изменения курса
      const changeColor = currency.change > 0 ? 'color: #27AE60;' : 
                         currency.change < 0 ? 'color: #E74C3C;' : '';
      
      // Стрелка для направления изменения
      const changeArrow = currency.change > 0 ? '↑' : 
                         currency.change < 0 ? '↓' : '';
      
      row.innerHTML = `
        <td>
          <strong>${currency.name}</strong>
        </td>
        <td>${currency.code}</td>
        <td>${currency.scale}</td>
        <td>${currency.rate.toFixed(4)}</td>
        <td style="${changeColor}">
          ${changeArrow} ${Math.abs(currency.change).toFixed(4)}
        </td>
      `;
      
      currencyTableBody.appendChild(row);
    });
  };
  
  /**
   * Инициализация графика курсов валют
   */
  const initializeChart = async () => {
    const currencyCode = chartCurrencySelect.value;
    await updateChart(currencyCode, currentPeriod);
  };
  
  /**
   * Обновление графика курсов валют
   * @param {string} currencyCode - Код валюты
   * @param {number} days - Количество дней для истории
   */
  const updateChart = async (currencyCode, days) => {
    try {
      // Получаем историю курса для выбранной валюты
      const history = await API.getRateHistory(currencyCode, days);
      
      // Подготавливаем данные для графика
      const labels = history.map(item => item.formattedDate);
      const rates = history.map(item => item.rate);
      
      // Если график уже существует, обновляем его данные
      if (chart) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = rates;
        chart.update();
      } else {
        // Иначе создаем новый график
        const ctx = document.getElementById('currency-chart').getContext('2d');
        
        chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: `Курс ${currencyCode} к BYN`,
              data: rates,
              borderColor: '#27AE60',
              backgroundColor: 'rgba(39, 174, 96, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top'
              },
              tooltip: {
                mode: 'index',
                intersect: false
              }
            },
            scales: {
              x: {
                display: true,
                title: {
                  display: true,
                  text: 'Дата'
                },
                grid: {
                  display: false
                }
              },
              y: {
                display: true,
                title: {
                  display: true,
                  text: 'Курс BYN'
                },
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)'
                }
              }
            }
          }
        });
      }
    } catch (error) {
      showError('Ошибка при обновлении графика: ' + error.message);
    }
  };
  
  /**
   * Фильтрация валют по выбранной категории
   * @param {string} filter - Категория фильтра
   * @param {string} search - Строка поиска
   */
  const filterCurrencies = (filter, search = '') => {
    let filteredCurrencies = [...allCurrencies];
    
    // Применяем фильтр по категории
    if (filter !== 'all') {
      if (filter === 'popular') {
        filteredCurrencies = filteredCurrencies.filter(c => c.popular);
      } else {
        filteredCurrencies = filteredCurrencies.filter(c => c.region === filter);
      }
    }
    
    // Применяем фильтр по поиску
    if (search.trim() !== '') {
      const searchLower = search.toLowerCase();
      filteredCurrencies = filteredCurrencies.filter(c => 
        c.name.toLowerCase().includes(searchLower) ||
        c.code.toLowerCase().includes(searchLower)
      );
    }
    
    // Отображаем отфильтрованный список
    renderCurrencyTable(filteredCurrencies);
  };
  
  /**
   * Отображение сообщения об ошибке
   * @param {string} message - Текст ошибки
   */
  const showError = (message) => {
    console.error(message);
    // Можно добавить отображение ошибки в UI
  };
  
  // Инициализация класса Chart для графиков
  class Chart {
    constructor(ctx, config) {
      this.ctx = ctx;
      this.config = config;
      this.data = config.data;
      
      this.render();
    }
    
    render() {
      // В реальном проекте здесь бы инициализировался настоящий график
      // Для демонстрации создаем простую заглушку
      console.log('График создан:', this.config.data.labels.length, 'точек данных');
    }
    
    update() {
      // Обновление графика
      console.log('График обновлен:', this.data.labels.length, 'точек данных');
    }
  }
  
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
  
  chartCurrencySelect.addEventListener('change', () => {
    const currency = chartCurrencySelect.value;
    updateChart(currency, currentPeriod);
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
      updateChart(chartCurrencySelect.value, period);
    });
  });
  
  // Инициализация
  initialize();
});