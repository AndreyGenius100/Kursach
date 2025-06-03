/**
 * API для работы с курсами валют Национального банка Республики Беларусь (НБРБ)
 */

class CurrencyAPI {
  constructor() {
    this.baseUrl = 'https://api.nbrb.by/exrates';
    this.currencyIds = {
      'USD': 431, 'EUR': 451, 'RUB': 456, 'CNY': 462, 'GBP': 429,
      'JPY': 508, 'AED': 421, 'AMD': 424, 'AUD': 426, 'BGN': 428,
      'BRL': 430, 'CAD': 433, 'DKK': 434, 'INR': 437, 'IRR': 438,
      'ISK': 439, 'KGS': 440, 'KWD': 441, 'KZT': 442, 'MDL': 443,
      'NOK': 444, 'NZD': 445, 'SEK': 446, 'SGD': 447, 'TRY': 449,
      'VND': 450, 'XDR': 452
    };
    this.rates = new Map();
    this.previousRates = new Map();
    this.lastUpdate = null;
  }

  async fetchAllRates() {
    try {
      // Сохраняем предыдущие курсы
      this.previousRates = new Map(this.rates);

      // Получаем текущие курсы
      const response = await fetch(`${this.baseUrl}/rates?periodicity=0`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      // Если это первая загрузка, получаем вчерашние курсы
      if (this.previousRates.size === 0) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        for (const code of Object.keys(this.currencyIds)) {
          try {
            const prevResponse = await fetch(
              `${this.baseUrl}/rates/${this.currencyIds[code]}?ondate=${this.formatDate(yesterday)}`
            );
            if (prevResponse.ok) {
              const prevData = await prevResponse.json();
              this.previousRates.set(code, {
                rate: prevData.Cur_OfficialRate,
                scale: prevData.Cur_Scale
              });
            }
          } catch (error) {
            console.error(`Error fetching previous rate for ${code}:`, error);
          }
        }
      }

      // Обновляем текущие курсы
      this.rates.clear();
      data.forEach(rate => {
        const prevRate = this.previousRates.get(rate.Cur_Abbreviation);
        const change = prevRate ? 
          (rate.Cur_OfficialRate / rate.Cur_Scale) - (prevRate.rate / prevRate.scale) : 
          0;

        this.rates.set(rate.Cur_Abbreviation, {
          rate: rate.Cur_OfficialRate,
          scale: rate.Cur_Scale,
          change: change
        });
      });
      
      this.lastUpdate = new Date();
      return this.rates;
    } catch (error) {
      console.error('Error fetching rates:', error);
      throw error;
    }
  }

  async getRates() {
    // Если данные ещё не загружены или прошло больше часа с последнего обновления
    if (!this.lastUpdate || new Date() - this.lastUpdate > 3600000) {
      await this.fetchAllRates();
    }
    return this.rates;
  }

  // Конвертация из одной валюты в другую
  async convert(amount, fromCurrency, toCurrency) {
    try {
      const rates = await this.getRates();
      
      // Конвертация в BYN
      let amountInBYN;
      if (fromCurrency === 'BYN') {
        amountInBYN = amount;
      } else {
        const fromRate = rates.get(fromCurrency);
        if (!fromRate) throw new Error(`Rate not found for ${fromCurrency}`);
        amountInBYN = (amount * fromRate.rate) / fromRate.scale;
      }

      // Конвертация из BYN в целевую валюту
      if (toCurrency === 'BYN') {
        return amountInBYN;
      } else {
        const toRate = rates.get(toCurrency);
        if (!toRate) throw new Error(`Rate not found for ${toCurrency}`);
        return (amountInBYN * toRate.scale) / toRate.rate;
      }
    } catch (error) {
      console.error('Error converting currency:', error);
      throw error;
    }
  }

  // Получение форматированной даты последнего обновления
  getLastUpdateDate() {
    if (!this.lastUpdate) return 'Нет данных';
    return this.lastUpdate.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Получение курса конкретной валюты
  async getRate(currency) {
    const rates = await this.getRates();
    const rate = rates.get(currency);
    if (!rate) throw new Error(`Rate not found for ${currency}`);
    return rate;
  }

  // Форматирование даты для API
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

// Создаем глобальный экземпляр API
const currencyAPI = new CurrencyAPI();