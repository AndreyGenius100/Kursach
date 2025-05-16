/**
 * Упрощенный класс Chart для отображения графиков
 * (в реальном проекте здесь был бы использован Chart.js или другая библиотека для визуализации)
 */
class Chart {
  /**
   * Конструктор
   * @param {CanvasRenderingContext2D} ctx - контекст canvas
   * @param {Object} config - настройки графика
   */
  constructor(ctx, config) {
    this.ctx = ctx;
    this.config = config;
    this.data = config.data || {};
    this.options = config.options || {};
    
    this.width = ctx.canvas.width;
    this.height = ctx.canvas.height;
    
    this.render();
  }
  
  /**
   * Отрисовка графика
   */
  render() {
    if (!this.ctx) return;
    
    this.clear();
    
    // Подготовка данных для графика
    const { labels, datasets } = this.data;
    
    if (!datasets || datasets.length === 0) return;
    
    // Применяем тип графика
    if (this.config.type === 'line') {
      this.drawLineChart(labels, datasets);
    } else {
      // По умолчанию рисуем круговую диаграмму
      this.drawPieChart(labels, datasets[0]);
    }
  }
  
  /**
   * Очистка canvas
   */
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  
  /**
   * Отрисовка линейного графика
   * @param {Array} labels - метки данных
   * @param {Array} datasets - наборы данных
   */
  drawLineChart(labels, datasets) {
    if (!labels || !datasets || labels.length === 0) return;
    
    const dataset = datasets[0];
    const data = dataset.data;
    const borderColor = dataset.borderColor || '#27AE60';
    const fillColor = dataset.backgroundColor || 'rgba(39, 174, 96, 0.1)';
    
    // Находим минимальные и максимальные значения
    const min = Math.min(...data);
    const max = Math.max(...data);
    
    // Настраиваем отступы и размеры
    const padding = 40;
    const chartWidth = this.width - padding * 2;
    const chartHeight = this.height - padding * 2;
    
    // Шаг по X
    const xStep = chartWidth / (labels.length - 1);
    
    // Масштаб по Y
    const yScale = chartHeight / (max - min || 1);
    
    this.ctx.beginPath();
    
    // Рисуем линию графика
    for (let i = 0; i < data.length; i++) {
      const x = padding + i * xStep;
      const y = this.height - padding - (data[i] - min) * yScale;
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    
    this.ctx.strokeStyle = borderColor;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    
    // Рисуем заливку под линией
    this.ctx.lineTo(padding + (data.length - 1) * xStep, this.height - padding);
    this.ctx.lineTo(padding, this.height - padding);
    this.ctx.fillStyle = fillColor;
    this.ctx.fill();
    
    // Рисуем точки данных
    for (let i = 0; i < data.length; i++) {
      const x = padding + i * xStep;
      const y = this.height - padding - (data[i] - min) * yScale;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, 4, 0, Math.PI * 2);
      this.ctx.fillStyle = borderColor;
      this.ctx.fill();
    }
    
    // Рисуем оси
    this.ctx.beginPath();
    this.ctx.moveTo(padding, padding);
    this.ctx.lineTo(padding, this.height - padding);
    this.ctx.lineTo(this.width - padding, this.height - padding);
    this.ctx.strokeStyle = '#DFE2E5';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    
    // Рисуем метки по X
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'top';
    this.ctx.fillStyle = '#666666';
    this.ctx.font = '10px Arial';
    
    for (let i = 0; i < labels.length; i += Math.ceil(labels.length / 10)) {
      const x = padding + i * xStep;
      this.ctx.fillText(labels[i], x, this.height - padding + 10);
    }
    
    // Рисуем метки по Y
    this.ctx.textAlign = 'right';
    this.ctx.textBaseline = 'middle';
    
    const yStep = (max - min) / 5;
    for (let i = 0; i <= 5; i++) {
      const value = min + i * yStep;
      const y = this.height - padding - i * (chartHeight / 5);
      
      this.ctx.fillText(value.toFixed(4), padding - 10, y);
      
      // Горизонтальные линии сетки
      this.ctx.beginPath();
      this.ctx.moveTo(padding, y);
      this.ctx.lineTo(this.width - padding, y);
      this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
      this.ctx.stroke();
    }
    
    // Рисуем заголовок
    this.ctx.textAlign = 'center';
    this.ctx.font = 'bold 14px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.fillText(dataset.label, this.width / 2, 20);
  }
  
  /**
   * Отрисовка круговой диаграммы
   * @param {Array} labels - метки данных
   * @param {Object} dataset - набор данных
   */
  drawPieChart(labels, dataset) {
    if (!dataset || !dataset.data) return;
    
    const data = dataset.data;
    const colors = dataset.backgroundColor || ['#27AE60', '#3498DB'];
    
    const total = data.reduce((sum, value) => sum + value, 0);
    if (total <= 0) return;
    
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    
    let startAngle = 0;
    
    // Рисуем секторы
    for (let i = 0; i < data.length; i++) {
      const value = data[i];
      const sliceAngle = (value / total) * 2 * Math.PI;
      
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, centerY);
      this.ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      this.ctx.closePath();
      
      this.ctx.fillStyle = colors[i % colors.length];
      this.ctx.fill();
      
      // Рисуем текст с процентами
      if (value > 0) {
        const percent = Math.round((value / total) * 100);
        const textAngle = startAngle + sliceAngle / 2;
        const textX = centerX + Math.cos(textAngle) * (radius / 1.5);
        const textY = centerY + Math.sin(textAngle) * (radius / 1.5);
        
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        if (percent > 5) {
          this.ctx.fillText(`${percent}%`, textX, textY);
        }
      }
      
      startAngle += sliceAngle;
    }
    
    // Рисуем легенду
    this.drawLegend(labels, data, colors);
  }
  
  /**
   * Отрисовка легенды
   * @param {Array} labels - метки данных
   * @param {Array} data - значения
   * @param {Array} colors - цвета
   */
  drawLegend(labels, data, colors) {
    const total = data.reduce((sum, value) => sum + value, 0);
    const legendY = this.height - 30;
    const itemWidth = this.width / labels.length;
    
    for (let i = 0; i < labels.length; i++) {
      const x = (i + 0.5) * itemWidth;
      
      // Рисуем цветной прямоугольник
      this.ctx.fillStyle = colors[i % colors.length];
      this.ctx.fillRect(x - 40, legendY, 12, 12);
      
      // Рисуем текст
      this.ctx.fillStyle = '#666666';
      this.ctx.font = '12px Arial';
      this.ctx.textAlign = 'left';
      this.ctx.textBaseline = 'middle';
      
      const value = data[i];
      const percent = Math.round((value / total) * 100);
      this.ctx.fillText(`${labels[i]} (${percent}%)`, x - 24, legendY + 6);
    }
  }
  
  /**
   * Обновление данных графика
   */
  update() {
    this.render();
  }
}

// Экспортируем класс Chart для использования в других файлах
window.Chart = Chart;