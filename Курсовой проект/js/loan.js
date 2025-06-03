/**
 * Функциональность калькулятора кредитов
 */
document.addEventListener('DOMContentLoaded', () => {
  // Элементы DOM
  const loanAmountInput = document.getElementById('loan-amount');
  const loanAmountSlider = document.getElementById('loan-amount-slider');
  const loanTermInput = document.getElementById('loan-term');
  const loanTermSlider = document.getElementById('loan-term-slider');
  const interestRateInput = document.getElementById('interest-rate');
  const interestRateSlider = document.getElementById('interest-rate-slider');
  const calculateButton = document.getElementById('calculate-loan');
  const monthlyPaymentElement = document.getElementById('monthly-payment');
  const totalPaymentElement = document.getElementById('total-payment');
  const totalInterestElement = document.getElementById('total-interest');
  const effectiveRateElement = document.getElementById('effective-rate');
  const showScheduleButton = document.getElementById('show-schedule');
  const paymentScheduleSection = document.getElementById('payment-schedule');
  const paymentScheduleBody = document.getElementById('payment-schedule-body');
  
  // Переменные для графика
  let loanChart = null;
  
  /**
   * Инициализация калькулятора
   */
  const initialize = () => {
    // Связываем инпуты и слайдеры
    setupSliderBinding(loanAmountInput, loanAmountSlider, 1000);
    setupSliderBinding(loanTermInput, loanTermSlider, 1);
    setupSliderBinding(interestRateInput, interestRateSlider, 0.1);
    
    // Инициализируем график
    initializeChart();
    
    // Выполняем первый расчет
    calculateLoan();
  };
  
  /**
   * Настройка связи между текстовым полем и слайдером
   * @param {HTMLElement} input - Текстовое поле ввода
   * @param {HTMLElement} slider - Слайдер
   * @param {number} step - Шаг изменения
   */
  const setupSliderBinding = (input, slider, step) => {
    const updateSliderProgress = (value) => {
      const percent = ((value - slider.min) / (slider.max - slider.min)) * 100;
      slider.style.background = `linear-gradient(to right, #27AE60 0%, #27AE60 ${percent}%, #E9ECEF ${percent}%, #E9ECEF 100%)`;
      
      // Обновляем отображаемые значения
      const valuesContainer = slider.nextElementSibling;
      if (valuesContainer && valuesContainer.classList.contains('loan-calculator__slider-values')) {
        const [minSpan, maxSpan] = valuesContainer.getElementsByTagName('span');
        const formatValue = (val, inputType) => {
          if (inputType === 'loan-amount') {
            return new Intl.NumberFormat('ru-RU').format(val);
          } else if (inputType === 'interest-rate') {
            return val + '%';
          }
          return val;
        };
        
        minSpan.textContent = formatValue(slider.min, input.id);
        maxSpan.textContent = formatValue(slider.max, input.id);
      }
    };

    // Определяем тип поля и его ограничения
    const inputType = input.id;
    let minValue, maxValue;

    switch(inputType) {
      case 'loan-amount':
        minValue = 100;
        maxValue = 500000;
        step = 100;
        break;
      case 'loan-term':
        minValue = 1;
        maxValue = 240;
        step = 1;
        break;
      case 'interest-rate':
        minValue = 0.1;
        maxValue = 50;
        step = 0.1;
        break;
      default:
        minValue = parseFloat(slider.min);
        maxValue = parseFloat(slider.max);
    }

    // Обновляем атрибуты min/max для слайдера и инпута
    slider.min = minValue;
    slider.max = maxValue;
    slider.step = step;
    input.min = minValue;
    input.max = maxValue;
    input.step = step;

    // Форматирование значения в зависимости от типа поля
    const formatInputValue = (value, type) => {
      if (type === 'loan-amount') {
        return Math.round(value / step) * step; // Округляем до ближайшего шага
      } else if (type === 'interest-rate') {
        return parseFloat(value).toFixed(1);
      }
      return Math.round(value);
    };

    // Обработчик ввода
    input.addEventListener('input', (e) => {
      let value = e.target.value;
      if (value === '' || isNaN(value)) {
        e.target.value = '';
        return;
      }
      value = formatInputValue(value, inputType);
      slider.value = value;
      updateSliderProgress(value);
      updateLoanCalculation();
    });

    // Обработчик потери фокуса
    input.addEventListener('blur', (e) => {
      let value = parseFloat(e.target.value);
      
      if (isNaN(value)) {
        value = minValue;
      } else {
        if (value < minValue) {
          value = minValue;
        } else if (value > maxValue) {
          value = maxValue;
        }
        value = formatInputValue(value, inputType);
      }
      
      e.target.value = value;
      slider.value = value;
      updateSliderProgress(value);
      updateLoanCalculation();
    });

    // Обработчик изменения слайдера
    slider.addEventListener('input', () => {
      let value = parseFloat(slider.value);
      value = formatInputValue(value, inputType);
      input.value = value;
      updateSliderProgress(value);
      calculateLoan();
    });

    // Инициализация начального состояния
    updateSliderProgress(parseFloat(slider.value));
  };
  
  /**
   * Инициализация графика распределения платежей
   */
  const initializeChart = () => {
    const ctx = document.getElementById('loan-chart').getContext('2d');
    
    loanChart = new LoanChart(ctx, {
      data: {
        labels: ['Основной долг', 'Проценты'],
        datasets: [{
          data: [0, 0],
          backgroundColor: ['#27AE60', '#3498DB']
        }]
      }
    });
  };
  
  /**
   * Расчет кредита
   */
  const calculateLoan = () => {
    try {
      // Получаем значения из формы
      const loanAmount = parseFloat(loanAmountInput.value);
      const loanTerm = parseInt(loanTermInput.value);
      const interestRate = parseFloat(interestRateInput.value) / 100; // Переводим в долю
      const paymentType = document.querySelector('input[name="payment-type"]:checked').value;
      
      // Проверяем корректность введенных данных
      if (isNaN(loanAmount) || isNaN(loanTerm) || isNaN(interestRate) ||
          loanAmount <= 0 || loanTerm <= 0 || interestRate <= 0) {
        showError('Пожалуйста, введите корректные данные');
        return;
      }
      
      let monthlyPayment, totalPayment, totalInterest, schedule;
      
      // Расчет в зависимости от типа платежа
      if (paymentType === 'annuity') {
        const result = calculateAnnuityLoan(loanAmount, loanTerm, interestRate);
        monthlyPayment = result.monthlyPayment;
        totalPayment = result.totalPayment;
        totalInterest = result.totalInterest;
        schedule = result.schedule;
      } else { // differential
        const result = calculateDifferentialLoan(loanAmount, loanTerm, interestRate);
        monthlyPayment = `${result.firstPayment.toFixed(2)} - ${result.lastPayment.toFixed(2)}`;
        totalPayment = result.totalPayment;
        totalInterest = result.totalInterest;
        schedule = result.schedule;
      }
      
      // Вычисляем эффективную ставку
      const effectiveRate = calculateEffectiveRate(loanAmount, totalPayment, loanTerm);
      
      // Обновляем результаты
      updateResults(monthlyPayment, totalPayment, totalInterest, effectiveRate);
      
      // Обновляем график
      updateChart(loanAmount, totalInterest);
      
      // Обновляем график платежей
      updatePaymentSchedule(schedule);
    } catch (error) {
      showError('Ошибка при расчете: ' + error.message);
    }
  };
  
  /**
   * Расчет аннуитетного платежа
   * @param {number} loanAmount - Сумма кредита
   * @param {number} loanTerm - Срок кредита в месяцах
   * @param {number} interestRate - Годовая процентная ставка (доля)
   * @returns {Object} - Объект с результатами расчета
   */
  const calculateAnnuityLoan = (loanAmount, loanTerm, interestRate) => {
    // Месячная процентная ставка (из годовой)
    const monthlyRate = interestRate / 12;
    
    // Коэффициент аннуитета
    const annuityCoeff = monthlyRate * Math.pow(1 + monthlyRate, loanTerm) / 
                        (Math.pow(1 + monthlyRate, loanTerm) - 1);
    
    // Ежемесячный платеж (округляем до 2 знаков)
    const monthlyPayment = Math.round(loanAmount * annuityCoeff * 100) / 100;
    
    // Общая сумма платежей
    const totalPayment = Math.round(monthlyPayment * loanTerm * 100) / 100;
    
    // Переплата по кредиту
    const totalInterest = Math.round((totalPayment - loanAmount) * 100) / 100;
    
    // Формируем график платежей
    const schedule = generateAnnuitySchedule(loanAmount, loanTerm, monthlyRate, monthlyPayment);
    
    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
      schedule
    };
  };
  
  /**
   * Расчет дифференцированного платежа
   * @param {number} loanAmount - Сумма кредита
   * @param {number} loanTerm - Срок кредита в месяцах
   * @param {number} interestRate - Годовая процентная ставка (доля)
   * @returns {Object} - Объект с результатами расчета
   */
  const calculateDifferentialLoan = (loanAmount, loanTerm, interestRate) => {
    // Месячная процентная ставка
    const monthlyRate = interestRate / 12;
    
    // Основной платеж (одинаковый каждый месяц)
    const principalPayment = Math.round((loanAmount / loanTerm) * 100) / 100;
    
    let totalPayment = 0;
    let totalInterest = 0;
    const schedule = [];
    
    // Остаток долга в начале
    let remainingDebt = loanAmount;
    
    // Расчет для каждого месяца
    for (let month = 1; month <= loanTerm; month++) {
      // Проценты в текущем месяце (на остаток долга)
      const interestPayment = Math.round(remainingDebt * monthlyRate * 100) / 100;
      
      // Общий платеж в текущем месяце (основной долг + проценты)
      const payment = Math.round((principalPayment + interestPayment) * 100) / 100;
      
      // Обновляем общую сумму платежей
      totalPayment = Math.round((totalPayment + payment) * 100) / 100;
      
      // Обновляем переплату по процентам
      totalInterest = Math.round((totalInterest + interestPayment) * 100) / 100;
      
      // Обновляем остаток долга
      remainingDebt = Math.round((remainingDebt - principalPayment) * 100) / 100;
      
      // Для последнего месяца корректируем остаток до нуля
      if (month === loanTerm) {
        remainingDebt = 0;
      }
      
      // Добавляем в график платежей
      const paymentDate = new Date();
      paymentDate.setMonth(paymentDate.getMonth() + month);
      
      schedule.push({
        month,
        date: paymentDate,
        payment: payment,
        principal: principalPayment,
        interest: interestPayment,
        remaining: remainingDebt
      });
    }
    
    // Сохраняем первый и последний платежи для отображения диапазона
    const firstPayment = schedule[0].payment;
    const lastPayment = schedule[schedule.length - 1].payment;
    
    return {
      firstPayment,
      lastPayment,
      totalPayment,
      totalInterest,
      schedule
    };
  };
  
  /**
   * Расчет эффективной процентной ставки
   * @param {number} loanAmount - Сумма кредита
   * @param {number} totalPayment - Общая сумма выплат
   * @param {number} loanTerm - Срок кредита в месяцах
   * @returns {number} - Эффективная годовая процентная ставка
   */
  const calculateEffectiveRate = (loanAmount, totalPayment, loanTerm) => {
    // Расчет эффективной годовой процентной ставки
    const monthlyOverpayment = (totalPayment - loanAmount) / loanTerm;
    const effectiveRate = (monthlyOverpayment * 12 / loanAmount) * 100;
    
    return Math.round(effectiveRate * 100) / 100;
  };
  
  /**
   * Генерация графика аннуитетных платежей
   * @param {number} loanAmount - Сумма кредита
   * @param {number} loanTerm - Срок кредита в месяцах
   * @param {number} monthlyRate - Месячная процентная ставка (доля)
   * @param {number} monthlyPayment - Ежемесячный платеж
   * @returns {Array} - Массив с данными для графика платежей
   */
  const generateAnnuitySchedule = (loanAmount, loanTerm, monthlyRate, monthlyPayment) => {
    let remainingDebt = loanAmount;
    const schedule = [];
    
    for (let month = 1; month <= loanTerm; month++) {
      // Расчет процентов в текущем месяце
      const interestPayment = Math.round(remainingDebt * monthlyRate * 100) / 100;
      
      // Расчет суммы, идущей на погашение основного долга
      const principalPayment = Math.round((monthlyPayment - interestPayment) * 100) / 100;
      
      // Обновляем остаток долга
      remainingDebt = Math.round((remainingDebt - principalPayment) * 100) / 100;
      
      // Для предотвращения ошибок округления в последнем месяце
      if (month === loanTerm) {
        remainingDebt = 0;
      }
      
      // Добавляем в график платежей
      const paymentDate = new Date();
      paymentDate.setMonth(paymentDate.getMonth() + month);
      
      schedule.push({
        month,
        date: paymentDate,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        remaining: Math.max(0, remainingDebt)
      });
    }
    
    return schedule;
  };
  
  /**
   * Обновление результатов расчета
   * @param {number|string} monthlyPayment - Ежемесячный платеж
   * @param {number} totalPayment - Общая сумма платежей
   * @param {number} totalInterest - Сумма процентов
   * @param {number} effectiveRate - Эффективная ставка
   */
  const updateResults = (monthlyPayment, totalPayment, totalInterest, effectiveRate) => {
    if (typeof monthlyPayment === 'number') {
      // Для аннуитетного платежа
      monthlyPaymentElement.textContent = `${monthlyPayment.toFixed(2)} BYN`;
    } else if (typeof monthlyPayment === 'string' && monthlyPayment.includes('-')) {
      // Для дифференцированного платежа (диапазон)
      monthlyPaymentElement.textContent = `${monthlyPayment} BYN`;
    }
    
    totalPaymentElement.textContent = `${totalPayment.toFixed(2)} BYN`;
    totalInterestElement.textContent = `${totalInterest.toFixed(2)} BYN`;
    effectiveRateElement.textContent = `${effectiveRate.toFixed(2)}%`;
  };
  
  /**
   * Обновление графика
   * @param {number} principal - Основной долг
   * @param {number} interest - Сумма процентов
   */
  const updateChart = (principal, interest) => {
    if (loanChart) {
      loanChart.updateData([principal, interest]);
    }
  };
  
  /**
   * Обновление графика платежей
   * @param {Array} schedule - Массив с данными платежей
   */
  const updatePaymentSchedule = (schedule) => {
    paymentScheduleBody.innerHTML = '';
    
    if (!schedule || schedule.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = '<td colspan="6" class="loan-calculator__empty">Нет данных по графику платежей</td>';
      paymentScheduleBody.appendChild(emptyRow);
      return;
    }
    
    // Заполняем таблицу
    schedule.forEach((payment) => {
      const row = document.createElement('tr');
      
      const formattedDate = formatDate(payment.date);
      
      row.innerHTML = `
        <td>${payment.month}</td>
        <td>${formattedDate}</td>
        <td>${payment.payment.toFixed(2)} BYN</td>
        <td>${payment.principal.toFixed(2)} BYN</td>
        <td>${payment.interest.toFixed(2)} BYN</td>
        <td>${payment.remaining.toFixed(2)} BYN</td>
      `;
      
      paymentScheduleBody.appendChild(row);
    });
  };
  
  /**
   * Форматирование даты
   * @param {Date} date - Объект даты
   * @returns {string} - Форматированная дата
   */
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}.${month}.${year}`;
  };
  
  /**
   * Отображение ошибки
   * @param {string} message - Текст ошибки
   */
  const showError = (message) => {
    console.error(message);
    // Можно добавить отображение ошибки в UI
  };
  
  // Класс для работы с графиком
  class LoanChart {
    constructor(ctx, config) {
      this.ctx = ctx;
      this.config = config;
      this.data = config.data;
      
      this.render();
    }
    
    render() {
      // В реальном проекте здесь бы инициализировался настоящий график
      // Для демонстрации создаем простую заглушку
      console.log('График распределения кредита создан');
    }
    
    updateData(newData) {
      this.data.datasets[0].data = newData;
      // Обновление графика
      console.log('График распределения кредита обновлен:', newData);
    }
  }

  // В файле loan.js добавьте:
function initSliders() {
  const sliders = document.querySelectorAll('.loan-calculator__slider');
  
  sliders.forEach(slider => {
    const input = document.getElementById(slider.id.replace('-slider', ''));
    
    // Синхронизация слайдера и поля ввода
    slider.addEventListener('input', () => {
      input.value = slider.value;
      calculateLoan();
    });
    
    input.addEventListener('input', () => {
      slider.value = input.value;
      calculateLoan();
    });
    
    // Обновление фона заполненной части
    slider.addEventListener('input', updateSliderProgress);
    updateSliderProgress.call(slider);
  });
}

function updateSliderProgress() {
  const value = (this.value - this.min) / (this.max - this.min) * 100;
  this.style.background = `linear-gradient(to right, #27AE60 0%, #27AE60 ${value}%, #E9ECEF ${value}%, #E9ECEF 100%)`;
}

// Вызовите инициализацию в конце скрипта
document.addEventListener('DOMContentLoaded', () => {
  initSliders();
  calculateLoan();
});
  
  // Обработчики событий
  calculateButton.addEventListener('click', calculateLoan);
  
  showScheduleButton.addEventListener('click', () => {
    if (paymentScheduleSection.style.display === 'none') {
      paymentScheduleSection.style.display = 'block';
      showScheduleButton.textContent = 'Скрыть график платежей';
    } else {
      paymentScheduleSection.style.display = 'none';
      showScheduleButton.textContent = 'Показать график платежей';
    }
  });
  
  // Инициализация
  initialize();
});
