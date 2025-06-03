/**
 * Функциональность конвертера валют
 */
class CurrencyConverter {
  constructor() {
    this.amountFromInput = document.getElementById('amount-from');
    this.amountToInput = document.getElementById('amount-to');
    this.currencyFromSelect = document.getElementById('currency-from');
    this.currencyToSelect = document.getElementById('currency-to');
    this.swapButton = document.getElementById('swap-button');
    this.convertButton = document.getElementById('convert-button');
    this.lastUpdateDate = document.getElementById('last-update-date');
    
    // Элементы для отображения популярных курсов
    this.usdRate = document.getElementById('usd-rate');
    this.eurRate = document.getElementById('eur-rate');
    this.rubRate = document.getElementById('rub-rate');

    this.init();
  }

  async init() {
    // Инициализация обработчиков событий
    this.swapButton.addEventListener('click', () => this.swapCurrencies());
    this.convertButton.addEventListener('click', () => this.convert());
    this.amountFromInput.addEventListener('input', () => this.convert());
    this.currencyFromSelect.addEventListener('change', () => this.convert());
    this.currencyToSelect.addEventListener('change', () => this.convert());

    // Загружаем начальные данные
    await this.updateRates();
    
    // Обновляем курсы каждый час
    setInterval(() => this.updateRates(), 3600000);
  }

  async updateRates() {
    try {
      // Получаем все курсы
      await currencyAPI.getRates();
      
      // Обновляем дату последнего обновления
      this.lastUpdateDate.textContent = currencyAPI.getLastUpdateDate();

      // Обновляем популярные курсы
      await this.updatePopularRates();
      
      // Выполняем начальную конвертацию
      await this.convert();
    } catch (error) {
      console.error('Error updating rates:', error);
      this.showError('Ошибка при обновлении курсов валют');
    }
  }

  async updatePopularRates() {
    try {
      // Получаем курсы популярных валют
      const usdRate = await currencyAPI.getRate('USD');
      const eurRate = await currencyAPI.getRate('EUR');
      const rubRate = await currencyAPI.getRate('RUB');

      // Обновляем отображение
      this.usdRate.textContent = `${usdRate.rate.toFixed(4)} BYN за ${usdRate.scale} USD`;
      this.eurRate.textContent = `${eurRate.rate.toFixed(4)} BYN за ${eurRate.scale} EUR`;
      this.rubRate.textContent = `${rubRate.rate.toFixed(4)} BYN за ${rubRate.scale} RUB`;
    } catch (error) {
      console.error('Error updating popular rates:', error);
    }
  }

  async convert() {
    try {
      const amount = parseFloat(this.amountFromInput.value);
      if (isNaN(amount) || amount < 0) {
        this.amountToInput.value = '';
        return;
      }

      const fromCurrency = this.currencyFromSelect.value;
      const toCurrency = this.currencyToSelect.value;

      const result = await currencyAPI.convert(amount, fromCurrency, toCurrency);
      this.amountToInput.value = result.toFixed(4);
    } catch (error) {
      console.error('Error converting:', error);
      this.showError('Ошибка при конвертации');
    }
  }

  swapCurrencies() {
    // Меняем местами выбранные валюты
    const tempCurrency = this.currencyFromSelect.value;
    this.currencyFromSelect.value = this.currencyToSelect.value;
    this.currencyToSelect.value = tempCurrency;

    // Выполняем конвертацию с новыми значениями
    this.convert();
  }

  showError(message) {
    // Можно улучшить отображение ошибок, добавив специальный элемент на страницу
    console.error(message);
  }
}

// Инициализируем конвертер при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  new CurrencyConverter();
});