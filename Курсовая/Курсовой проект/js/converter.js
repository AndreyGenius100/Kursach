/**
 * Функциональность конвертера валют
 */
document.addEventListener('DOMContentLoaded', () => {
  // Элементы DOM
  const amountFromInput = document.getElementById('amount-from');
  const amountToInput = document.getElementById('amount-to');
  const currencyFromSelect = document.getElementById('currency-from');
  const currencyToSelect = document.getElementById('currency-to');
  const swapButton = document.getElementById('swap-button');
  const convertButton = document.getElementById('convert-button');
  const conversionRateInfo = document.getElementById('conversion-rate');
  const conversionRateInfoBlock = document.getElementById('conversion-rate-info');
  const lastUpdateDate = document.getElementById('last-update-date');
  
  // Элементы с популярными валютами
  const usdRateElement = document.getElementById('usd-rate');
  const eurRateElement = document.getElementById('eur-rate');
  const rubRateElement = document.getElementById('rub-rate');
  
  /**
   * Инициализация конвертера
   */
  const initialize = async () => {
    try {
      // Загружаем курсы валют
      const rates = await API.getAllRates();
      
      // Обновляем дату обновления курсов
      const updateDate = await API.getLastUpdateDate();
      lastUpdateDate.textContent = updateDate;
      
      // Заполняем селекты валют
      populateCurrencySelects(rates);
      
      // Обновляем информацию о курсе
      updateConversionRate();
      
      // Обновляем информацию о популярных валютах
      updatePopularRates(rates);
      
      // Автоматически выполняем первую конвертацию
      await convertCurrency();
    } catch (error) {
      showError('Ошибка при загрузке данных: ' + error.message);
    }
  };
  
  /**
   * Заполнение селектов валют
   * @param {Array} rates - Массив с данными о валютах
   */
  const populateCurrencySelects = (rates) => {
    // Очищаем селекты
    currencyFromSelect.innerHTML = '';
    currencyToSelect.innerHTML = '';
    
    // Сортируем валюты
    const sortedRates = [...rates].sort((a, b) => {
      // BYN в начало списка
      if (a.code === 'BYN') return -1;
      if (b.code === 'BYN') return 1;
      // Популярные валюты следующие
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      // Остальные по алфавиту
      return a.code.localeCompare(b.code);
    });
    
    // Заполняем селекты
    sortedRates.forEach(currency => {
      const option = document.createElement('option');
      option.value = currency.code;
      option.textContent = `${currency.code} - ${currency.name}`;
      
      const optionClone = option.cloneNode(true);
      
      currencyFromSelect.appendChild(option);
      currencyToSelect.appendChild(optionClone);
    });
    
    // Устанавливаем начальные значения
    currencyFromSelect.value = 'BYN';
    currencyToSelect.value = 'USD';
  };
  
  /**
   * Обновление информации о курсе между выбранными валютами
   */
  const updateConversionRate = async () => {
    try {
      const fromCurrency = currencyFromSelect.value;
      const toCurrency = currencyToSelect.value;
      
      // Получаем курс для 1 единицы выбранной валюты
      const convertedAmount = await API.convertCurrency(1, fromCurrency, toCurrency);
      
      // Отображаем информацию о курсе
      conversionRateInfoBlock.textContent = `1 ${fromCurrency} = `;
      conversionRateInfo.textContent = `${convertedAmount.toFixed(4)} ${toCurrency}`;
    } catch (error) {
      showError('Ошибка при обновлении информации о курсе');
      console.error(error);
    }
  };
  
  /**
   * Обновление информации о популярных валютах
   * @param {Array} rates - Массив с данными о валютах
   */
  const updatePopularRates = (rates) => {
    const usd = rates.find(r => r.code === 'USD');
    const eur = rates.find(r => r.code === 'EUR');
    const rub = rates.find(r => r.code === 'RUB');
    
    if (usd) {
      usdRateElement.textContent = `${usd.rate.toFixed(4)} BYN`;
    }
    
    if (eur) {
      eurRateElement.textContent = `${eur.rate.toFixed(4)} BYN`;
    }
    
    if (rub) {
      rubRateElement.textContent = `${(rub.rate / rub.scale).toFixed(4)} BYN`;
    }
  };
  
  /**
   * Конвертация валюты
   */
  const convertCurrency = async () => {
    try {
      const amount = parseFloat(amountFromInput.value);
      const fromCurrency = currencyFromSelect.value;
      const toCurrency = currencyToSelect.value;
      
      if (isNaN(amount) || amount <= 0) {
        amountToInput.value = '';
        return;
      }
      
      // Выполняем конвертацию
      const convertedAmount = await API.convertCurrency(amount, fromCurrency, toCurrency);
      
      // Отображаем результат
      amountToInput.value = convertedAmount.toFixed(2);
    } catch (error) {
      showError('Ошибка при конвертации: ' + error.message);
    }
  };
  
  /**
   * Обмен местами выбранных валют
   */
  const swapCurrencies = () => {
    // Сохраняем текущие значения
    const tempCurrency = currencyFromSelect.value;
    const tempAmount = amountFromInput.value;
    
    // Меняем местами валюты
    currencyFromSelect.value = currencyToSelect.value;
    currencyToSelect.value = tempCurrency;
    
    // Меняем местами суммы
    amountFromInput.value = amountToInput.value;
    amountToInput.value = tempAmount;
    
    // Обновляем информацию о курсе
    updateConversionRate();
  };
  
  /**
   * Отображение сообщения об ошибке
   * @param {string} message - Текст сообщения
   */
  const showError = (message) => {
    console.error(message);
    // Здесь можно добавить отображение ошибки в UI
  };
  
  // Обработчики событий
  convertButton.addEventListener('click', convertCurrency);
  
  swapButton.addEventListener('click', swapCurrencies);
  
  currencyFromSelect.addEventListener('change', () => {
    updateConversionRate();
    convertCurrency();
  });
  
  currencyToSelect.addEventListener('change', () => {
    updateConversionRate();
    convertCurrency();
  });
  
  amountFromInput.addEventListener('input', () => {
    // Автоконвертация при вводе
    convertCurrency();
  });
  
  // Инициализация конвертера
  initialize();
});