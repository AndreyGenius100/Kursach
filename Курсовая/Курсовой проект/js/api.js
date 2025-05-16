/**
 * API для работы с курсами валют Национального банка Республики Беларусь (НБРБ)
 */

const API = {
  // Базовый URL API НБРБ
  baseUrl: 'https://api.nbrb.by/exrates',
  
  // Кеш данных
  cache: {
    rates: null,
    history: {},
    lastUpdate: null
  },
  
  /**
   * Получение данных в формате XML и преобразование их в XML DOM
   * @param {string} url - URL запроса
   * @returns {Promise<Document>} - XML документ
   */
  async fetchXML(url) {
    try {
      // В реальном проекте здесь был бы запрос к API НБРБ
      // Для демонстрации используем локальный файл данных
      const response = await fetch('/data/currencies.xml');
      const xmlText = await response.text();
      const parser = new DOMParser();
      return parser.parseFromString(xmlText, 'text/xml');
    } catch (error) {
      console.error('Ошибка при загрузке XML:', error);
      throw new Error('Не удалось загрузить данные о курсах валют');
    }
  },
  
  /**
   * Получение актуальных курсов всех валют
   * @returns {Promise<Array>} - Массив объектов с данными о валютах
   */
  async getAllRates() {
    // Проверяем, есть ли актуальные данные в кеше
    if (this.cache.rates && this.cache.lastUpdate && 
        (new Date() - this.cache.lastUpdate) < 3600000) { // 1 час
      return this.cache.rates;
    }
    
    try {
      const xml = await this.fetchXML(`${this.baseUrl}/currencies`);
      const currencies = xml.getElementsByTagName('currency');
      const result = [];
      
      for (let i = 0; i < currencies.length; i++) {
        const curr = currencies[i];
        result.push({
          code: this.getNodeValue(curr, 'code'),
          name: this.getNodeValue(curr, 'name'),
          rate: parseFloat(this.getNodeValue(curr, 'rate')),
          scale: parseInt(this.getNodeValue(curr, 'scale')),
          change: parseFloat(this.getNodeValue(curr, 'change')),
          region: this.getNodeValue(curr, 'region'),
          popular: this.getNodeValue(curr, 'popular') === 'true'
        });
      }
      
      // Добавляем BYN
      result.push({
        code: 'BYN',
        name: 'Белорусский рубль',
        rate: 1,
        scale: 1,
        change: 0,
        region: 'europe',
        popular: true
      });
      
      // Сохраняем в кеш
      this.cache.rates = result;
      this.cache.lastUpdate = new Date();
      
      return result;
    } catch (error) {
      console.error('Ошибка при получении курсов валют:', error);
      throw error;
    }
  },
  
  /**
   * Получение истории курса для указанной валюты
   * @param {string} currencyCode - Код валюты
   * @param {number} days - Количество дней для истории
   * @returns {Promise<Array>} - Массив с историей курса
   */
  async getRateHistory(currencyCode, days = 30) {
    // В реальном API здесь был бы запрос к истории курсов
    // Для демонстрации генерируем случайные данные
    
    const cacheKey = `${currencyCode}_${days}`;
    
    // Проверяем кеш
    if (this.cache.history[cacheKey]) {
      return this.cache.history[cacheKey];
    }
    
    try {
      const rates = await this.getAllRates();
      const currency = rates.find(c => c.code === currencyCode);
      
      if (!currency) {
        throw new Error(`Валюта ${currencyCode} не найдена`);
      }
      
      const today = new Date();
      const result = [];
      
      // Генерируем историю курсов на основе текущего курса
      // с небольшими случайными отклонениями
      let rate = currency.rate;
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        // Для демонстрации добавляем случайные колебания курса
        const fluctuation = Math.random() * 0.04 - 0.02; // +/- 2%
        rate = rate * (1 + fluctuation);
        
        result.push({
          date: date.toISOString().split('T')[0],
          rate: parseFloat(rate.toFixed(4)),
          formattedDate: this.formatDate(date)
        });
      }
      
      this.cache.history[cacheKey] = result;
      
      return result;
    } catch (error) {
      console.error(`Ошибка при получении истории курса для ${currencyCode}:`, error);
      throw error;
    }
  },
  
  /**
   * Конвертация валюты
   * @param {number} amount - Сумма
   * @param {string} fromCurrency - Код исходной валюты
   * @param {string} toCurrency - Код целевой валюты
   * @returns {Promise<number>} - Конвертированная сумма
   */
  async convertCurrency(amount, fromCurrency, toCurrency) {
    try {
      const rates = await this.getAllRates();
      
      const fromCurr = rates.find(c => c.code === fromCurrency);
      const toCurr = rates.find(c => c.code === toCurrency);
      
      if (!fromCurr || !toCurr) {
        throw new Error('Валюта не найдена');
      }
      
      // Приводим к базовой валюте (BYN)
      const amountInBYN = (amount * fromCurr.rate) / fromCurr.scale;
      
      // Конвертируем из базовой валюты в целевую
      const convertedAmount = (amountInBYN / toCurr.rate) * toCurr.scale;
      
      return convertedAmount;
    } catch (error) {
      console.error('Ошибка при конвертации валюты:', error);
      throw error;
    }
  },
  
  /**
   * Получение актуальной информации о дате обновления курсов
   * @returns {Promise<string>} - Дата обновления
   */
  async getLastUpdateDate() {
    try {
      const xml = await this.fetchXML(`${this.baseUrl}/currencies`);
      const lastUpdateNode = xml.getElementsByTagName('lastUpdate')[0];
      
      if (lastUpdateNode) {
        const dateStr = lastUpdateNode.textContent;
        const date = new Date(dateStr);
        return this.formatDate(date);
      }
      
      return this.formatDate(new Date());
    } catch (error) {
      console.error('Ошибка при получении даты обновления:', error);
      return this.formatDate(new Date());
    }
  },
  
  /**
   * Получение текстового содержимого узла XML
   * @param {Element} parent - Родительский элемент
   * @param {string} tagName - Имя тега
   * @returns {string} - Текстовое содержимое
   */
  getNodeValue(parent, tagName) {
    const node = parent.getElementsByTagName(tagName)[0];
    return node ? node.textContent : '';
  },
  
  /**
   * Форматирование даты
   * @param {Date} date - Объект даты
   * @returns {string} - Форматированная дата
   */
  formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}.${month}.${year}`;
  },
  
  /**
   * Получение текущей даты в формате ДД.ММ.ГГГГ
   * @returns {string} - Форматированная текущая дата
   */
  getCurrentDate() {
    return this.formatDate(new Date());
  },
  
  /**
   * Получение текущего времени в формате ЧЧ:ММ
   * @returns {string} - Форматированное текущее время
   */
  getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
  }
};

// Экспортируем API для использования в других файлах
window.API = API;