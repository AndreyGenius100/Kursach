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
    // Обновляем слайдер при изменении инпута
    input.addEventListener('input', () => {
      let value = parseFloat(input.value);
      
      // Проверяем границы
      if (value < parseFloat(slider.min)) {
        value = parseFloat(slider.min);
        input.value = value;
      } else if (value > parseFloat(slider.max)) {
        value = parseFloat(slider.max);
        input.value = value;
      }
      
      slider.value = value;
    });
    
    // Обновляем инпут при изменении слайдера
    slider.addEventListener('input', () => {
      input.value = slider.value;
    });
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
    // Месячная процентная ставка
    const monthlyRate = interestRate / 12;
    
    // Коэффициент аннуитета
    const annuityCoeff = (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / 
                         (Math.pow(1 + monthlyRate, loanTerm) - 1);
    
    // Ежемесячный платеж
    const monthlyPayment = loanAmount * annuityCoeff;
    
    // Общая сумма платежей
    const totalPayment = monthlyPayment * loanTerm;
    
    // Переплата по кредиту
    const totalInterest = totalPayment - loanAmount;
    
    // Формируем график платежей
    const schedule = generateAnnuitySchedule(loanAmount, loanTerm, interestRate, monthlyPayment);
    
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
    const principalPayment = loanAmount / loanTerm;
    
    let totalPayment = 0;
    let totalInterest = 0;
    const schedule = [];
    
    // Остаток долга в начале
    let remainingDebt = loanAmount;
    
    // Расчет для каждого месяца
    for (let month = 1; month <= loanTerm; month++) {
      // Проценты в текущем месяце
      const interestPayment = remainingDebt * monthlyRate;
      
      // Общий платеж в текущем месяце
      const payment = principalPayment + interestPayment;
      
      // Обновляем общую сумму платежей
      totalPayment += payment;
      
      // Обновляем переплату по процентам
      totalInterest += interestPayment;
      
      // Обновляем остаток долга
      remainingDebt -= principalPayment;
      
      // Добавляем в график платежей
      const paymentDate = new Date();
      paymentDate.setMonth(paymentDate.getMonth() + month);
      
      schedule.push({
        month,
        date: paymentDate,
        payment,
        principal: principalPayment,
        interest: interestPayment,
        remaining: Math.max(0, remainingDebt)
      });
    }
    
    return {
      firstPayment: schedule[0].payment,
      lastPayment: schedule[schedule.length - 1].payment,
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
    const overpayment = totalPayment - loanAmount;
    const avgLoanBalance = loanAmount / 2; // Упрощенный расчет
    const effectiveRate = (overpayment / avgLoanBalance) * (12 / loanTerm) * 100;
    
    return effectiveRate;
  };
  
  /**
   * Генерация графика аннуитетных платежей
   * @param {number} loanAmount - Сумма кредита
   * @param {number} loanTerm - Срок кредита в месяцах
   * @param {number} annualRate - Годовая процентная ставка (доля)
   * @param {number} monthlyPayment - Ежемесячный платеж
   * @returns {Array} - Массив с данными для графика платежей
   */
  const generateAnnuitySchedule = (loanAmount, loanTerm, annualRate, monthlyPayment) => {
    const monthlyRate = annualRate / 12;
    let remainingDebt = loanAmount;
    const schedule = [];
    
    for (let month = 1; month <= loanTerm; month++) {
      // Расчет процентов в текущем месяце
      const interestPayment = remainingDebt * monthlyRate;
      
      // Расчет суммы, идущей на погашение основного долга
      const principalPayment = monthlyPayment - interestPayment;
      
      // Обновляем остаток долга
      remainingDebt -= principalPayment;
      
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
      monthlyPaymentElement.textContent = `${monthlyPayment.toFixed(2)} BYN`;
    } else {
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