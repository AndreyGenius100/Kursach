class CurrencyChart {
  constructor() {
    this.chart = null;
    this.currency = 'USD';
    this.period = 30;
    this.baseUrl = 'https://api.nbrb.by/exrates';
    this.currencyIds = {
      'USD': 431,
      'EUR': 451,
      'RUB': 456,
      'CNY': 462,
      'GBP': 429,
      'JPY': 508
    };
    this.currencyNames = {
      'USD': 'Доллар США',
      'EUR': 'Евро',
      'RUB': 'Российский рубль',
      'CNY': 'Китайский юань',
      'GBP': 'Фунт стерлингов',
      'JPY': 'Японская иена'
    };
    
    this.init();
  }

  async init() {
    await this.setupChart();
    await this.setupControls();
    await this.updateChartData();
  }

  async setupChart() {
    const ctx = document.getElementById('ratesChart').getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: `${this.currency}/BYN`,
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
    });
  }

  async setupControls() {
    const currencySelect = document.getElementById('chart-currency');
    const periodSelect = document.getElementById('chart-period');

    if (currencySelect) {
      // Очищаем существующие опции
      currencySelect.innerHTML = '';
      
      // Заполняем список валют
      Object.entries(this.currencyIds).forEach(([code]) => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = `${code} - ${this.currencyNames[code]}`;
        if (code === this.currency) {
          option.selected = true;
        }
        currencySelect.appendChild(option);
      });

      currencySelect.addEventListener('change', (e) => {
        console.log('Currency changed to:', e.target.value);
        this.currency = e.target.value;
        this.updateChartData();
      });
    }

    if (periodSelect) {
      // Устанавливаем начальное значение
      periodSelect.value = this.period.toString();
      
      periodSelect.addEventListener('change', (e) => {
        console.log('Period changed to:', e.target.value);
        this.period = parseInt(e.target.value);
        this.updateChartData();
      });
    }
  }

  async updateChartData() {
    const loadingEl = document.getElementById('chartLoading');
    const errorEl = document.getElementById('chartError');
    
    try {
      // Показываем загрузку
      if (loadingEl) loadingEl.style.display = 'flex';
      if (errorEl) errorEl.style.display = 'none';
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - this.period);

      console.log(`Updating chart for ${this.currency} from ${this.formatDate(startDate)} to ${this.formatDate(endDate)}`);
      console.log(`Period: ${this.period} days`);

      const currencyId = this.currencyIds[this.currency];
      if (!currencyId) {
        throw new Error('Invalid currency code');
      }

      const url = `${this.baseUrl}/rates/dynamics/${currencyId}?startdate=${this.formatDate(startDate)}&enddate=${this.formatDate(endDate)}`;
      console.log('Fetching data from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);

      if (!data || data.length === 0) {
        throw new Error('No data received from API');
      }

      const labels = data.map(item => this.formatDateForDisplay(item.Date));
      const rates = data.map(item => item.Cur_OfficialRate);

      // Обновляем данные графика
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = rates;
      this.chart.data.datasets[0].label = `${this.currency}/BYN`;
      
      // Принудительно обновляем график
      this.chart.update('active');
      
      // Скрываем загрузку
      if (loadingEl) loadingEl.style.display = 'none';
    } catch (error) {
      console.error('Error updating chart:', error);
      const errorEl = document.getElementById('chartError');
      if (errorEl) {
        errorEl.style.display = 'flex';
        errorEl.querySelector('p').textContent = error.message;
      }
      // Скрываем загрузку в случае ошибки
      if (loadingEl) loadingEl.style.display = 'none';
    }
  }

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatDateForDisplay(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit'
    });
  }
}

// Initialize chart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CurrencyChart();
}); 