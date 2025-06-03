// Настройки визуализации
const config = {
  margin: { top: 10, right: 10, bottom: 10, left: 10 },
  padding: 1,
  colors: {
    up: ['#E8F5E9', '#A5D6A7', '#66BB6A', '#43A047', '#2E7D32'],
    down: ['#FFEBEE', '#EF9A9A', '#E57373', '#E53935', '#C62828'],
    neutral: '#DEE4E8'
  },
  sectors: {
    'Technology': '#2196F3',
    'Healthcare': '#4CAF50',
    'Financial': '#9C27B0',
    'Consumer': '#FF9800',
    'Energy': '#F44336',
    'Industrial': '#795548',
    'Materials': '#607D8B',
    'Real Estate': '#3F51B5',
    'Utilities': '#009688',
    'Communication': '#00BCD4'
  }
};

// Статические данные рынка
const staticMarketData = {
  'Technology': [
    { symbol: 'AAPL', price: 175.21, change: 1.25, volume: 55000000 },
    { symbol: 'MSFT', price: 338.11, change: 0.37, volume: 22000000 },
    { symbol: 'GOOGL', price: 125.23, change: -0.45, volume: 18000000 }
  ],
  'Financial': [
    { symbol: 'JPM', price: 146.43, change: -0.78, volume: 12000000 },
    { symbol: 'BAC', price: 28.57, change: -1.12, volume: 35000000 },
    { symbol: 'GS', price: 322.89, change: 0.89, volume: 8000000 }
  ],
  'Healthcare': [
    { symbol: 'JNJ', price: 152.50, change: 0.22, volume: 15000000 },
    { symbol: 'PFE', price: 28.91, change: -2.15, volume: 42000000 },
    { symbol: 'UNH', price: 538.21, change: 1.54, volume: 9000000 }
  ],
  'Consumer': [
    { symbol: 'AMZN', price: 127.12, change: 2.31, volume: 32000000 },
    { symbol: 'WMT', price: 156.89, change: -0.45, volume: 25000000 },
    { symbol: 'PG', price: 145.32, change: 0.67, volume: 18000000 }
  ],
  'Energy': [
    { symbol: 'XOM', price: 98.75, change: -1.85, volume: 28000000 },
    { symbol: 'CVX', price: 145.67, change: -2.12, volume: 22000000 },
    { symbol: 'COP', price: 112.34, change: -1.45, volume: 15000000 }
  ]
};

// API ключ Alpha Vantage (бесплатный)
const ALPHA_VANTAGE_API_KEY = 'demo';

// Основные индексы и их компоненты (уменьшим количество для демо-ключа)
const marketIndices = {
  'sp500': {
    symbols: [
      // Technology
      { symbol: 'AAPL', sector: 'Technology' },
      { symbol: 'MSFT', sector: 'Technology' },
      { symbol: 'GOOGL', sector: 'Technology' },
      // Financial
      { symbol: 'JPM', sector: 'Financial' },
      { symbol: 'BAC', sector: 'Financial' },
      // Healthcare
      { symbol: 'JNJ', sector: 'Healthcare' },
      { symbol: 'PFE', sector: 'Healthcare' },
      // Consumer
      { symbol: 'AMZN', sector: 'Consumer' },
      { symbol: 'WMT', sector: 'Consumer' },
      // Energy
      { symbol: 'XOM', sector: 'Energy' },
      { symbol: 'CVX', sector: 'Energy' }
    ]
  }
};

// Функция для получения данных с Alpha Vantage API
async function fetchMarketData(symbol) {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    
    // Проверяем наличие данных
    if (data['Global Quote']) {
      const quote = data['Global Quote'];
      return {
        price: parseFloat(quote['05. price']) || 0,
        change: parseFloat(quote['09. change']) || 0,
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')) || 0,
        volume: parseInt(quote['06. volume']) || 0
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return null;
  }
}

// Функция для подготовки данных для визуализации
async function prepareMarketData(indexType = 'sp500') {
  try {
    const sectorData = {};
    let totalVolume = 0;

    // Преобразуем статические данные в нужный формат
    Object.entries(staticMarketData).forEach(([sector, stocks]) => {
      sectorData[sector] = {
        name: sector,
        children: stocks.map(stock => {
          totalVolume += stock.volume;
          return {
            symbol: stock.symbol,
            value: stock.price * stock.volume,
            price: stock.price,
            change: stock.change,
            volume: stock.volume
          };
        })
      };
    });

    return {
      name: indexType.toUpperCase(),
      children: Object.values(sectorData),
      totalVolume: totalVolume
    };
  } catch (error) {
    console.error('Error preparing market data:', error);
    return generateDemoData();
  }
}

// Функция генерации демо-данных (на случай ошибок)
function generateDemoData() {
  const sectors = Object.keys(config.sectors);
  const totalVolume = Math.floor(Math.random() * 1e9);

  return {
    name: "DEMO DATA",
    children: sectors.slice(0, 6).map(sector => ({
      name: sector,
      children: Array.from({ length: 4 }, (_, i) => ({
        symbol: `${sector.substring(0, 3)}${i + 1}`,
        value: Math.random() * 100 + 20,
        price: Math.random() * 1000 + 10,
        change: (Math.random() * 10 - 5),
        volume: Math.floor(Math.random() * 1e7)
      }))
    })),
    totalVolume: totalVolume
  };
}

// Инициализация
document.addEventListener('DOMContentLoaded', async () => {
  await initializeMarketMap();
});

// Основная функция инициализации карты
async function initializeMarketMap() {
  const container = document.getElementById('marketMap');
  
  try {
    const marketData = await prepareMarketData();
    
    requestAnimationFrame(() => {
      const width = container.clientWidth;
      const height = Math.max(container.clientHeight, 600);

      container.innerHTML = '';

      const svg = d3.select('#marketMap')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height])
        .style('display', 'block');

      const root = d3.hierarchy(marketData)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

      const treemap = d3.treemap()
        .size([width, height])
        .paddingTop(28)
        .paddingRight(3)
        .paddingBottom(3)
        .paddingLeft(3)
        .paddingInner(3)
        .round(true);

      treemap(root);

      // Обновляем статистику
      updateStats(marketData);

      // Создаем группу для всех элементов
      const g = svg.append('g');

      // Добавляем секторы
      const sectors = g.selectAll('g.sector')
        .data(root.children)
        .join('g')
        .attr('class', 'sector')
        .attr('transform', d => `translate(${d.x0},${d.y0})`);

      // Добавляем фон сектора
      sectors.append('rect')
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('fill', 'none')
        .attr('stroke', d => config.sectors[d.data.name])
        .attr('stroke-width', 2)
        .attr('rx', 4)
        .attr('ry', 4);

      // Добавляем заголовок сектора
      sectors.append('text')
        .attr('x', 8)
        .attr('y', 20)
        .attr('fill', '#2C3E50')
        .attr('font-weight', 'bold')
        .attr('font-size', '14px')
        .text(d => d.data.name);

      // Добавляем ячейки
      const cell = sectors.selectAll('g.cell')
        .data(d => d.leaves())
        .join('g')
        .attr('class', 'cell')
        .attr('transform', d => {
          const x = Math.min(d.x0 - d.parent.x0, d.parent.x1 - d.parent.x0 - (d.x1 - d.x0));
          const y = Math.min(d.y0 - d.parent.y0, d.parent.y1 - d.parent.y0 - (d.y1 - d.y0));
          return `translate(${x},${y})`;
        });

      // Создаем группу для каждой ячейки
      const cellContent = cell.append('g')
        .attr('class', 'cell-content');

      // Добавляем прямоугольники
      cellContent.append('rect')
        .attr('width', d => Math.max(0, Math.min(d.x1 - d.x0 - 2, d.parent.x1 - d.x0 - 2)))
        .attr('height', d => Math.max(0, Math.min(d.y1 - d.y0 - 2, d.parent.y1 - d.y0 - 2)))
        .attr('x', 1)
        .attr('y', 1)
        .attr('fill', d => getColor(d.data.change))
        .attr('rx', 2)
        .attr('ry', 2)
        .attr('stroke', 'transparent')
        .attr('stroke-width', '1.5')
        .style('cursor', 'pointer')
        .style('transition', 'all 0.2s ease');

      // Добавляем текст символа для всех ячеек
      cellContent.append('text')
        .attr('x', 4)
        .attr('y', 14)
        .attr('fill', d => {
          const color = getColor(d.data.change);
          const rgb = d3.color(color).rgb();
          const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
          return brightness > 128 ? '#2C3E50' : '#FFFFFF';
        })
        .attr('font-size', d => {
          const width = d.x1 - d.x0;
          const height = d.y1 - d.y0;
          return width < 50 || height < 30 ? '10px' : '12px';
        })
        .attr('font-weight', '500')
        .text(d => d.data.symbol);

      // Добавляем процент изменения только для больших ячеек
      cellContent.filter(d => (d.x1 - d.x0) > 40 && (d.y1 - d.y0) > 30)
        .append('text')
        .attr('x', 4)
        .attr('y', 28)
        .attr('fill', d => {
          const color = getColor(d.data.change);
          const rgb = d3.color(color).rgb();
          const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
          return brightness > 128 ? '#2C3E50' : '#FFFFFF';
        })
        .attr('font-size', '11px')
        .attr('opacity', 0.8)
        .text(d => `${d.data.change > 0 ? '+' : ''}${d.data.change.toFixed(2)}%`);

      // Добавляем эффект при наведении на всю группу
      cell.on('mouseover', function(event, d) {
        const cellGroup = d3.select(this);
        cellGroup.select('rect')
          .attr('stroke', '#1a1a1a')
          .attr('stroke-opacity', 0.9);
        cellGroup.raise();
        showTooltip(event, d);
      })
      .on('mousemove', function(event, d) {
        showTooltip(event, d);
      })
      .on('mouseout', function() {
        const cellGroup = d3.select(this);
        cellGroup.select('rect')
          .attr('stroke', 'transparent');
        d3.select('#tooltip').classed('visible', false);
      });
    });
  } catch (error) {
    console.error('Error initializing market map:', error);
    container.innerHTML = `
      <div class="market-map__error">
        <p>Ошибка загрузки данных. Пожалуйста, попробуйте позже.</p>
      </div>
    `;
  }
}

// Улучшенная функция получения цвета
function getColor(change) {
  const absChange = Math.abs(change);
  const colors = change >= 0 ? config.colors.up : config.colors.down;
  
  if (change === 0) return config.colors.neutral;
  if (absChange < 0.1) return config.colors.neutral;
  if (absChange < 1) return colors[0];
  if (absChange < 2) return colors[1];
  if (absChange < 5) return colors[2];
  if (absChange < 10) return colors[3];
  return colors[4];
}

function showTooltip(event, d) {
  const tooltip = d3.select('#tooltip');
  const mouseX = event.clientX || event.touches?.[0]?.clientX;
  const mouseY = event.clientY || event.touches?.[0]?.clientY;
  
  tooltip
    .html(`
      <strong>${d.data.symbol}</strong><br>
      Цена: $${d.data.price.toFixed(2)}<br>
      Изменение: ${d.data.change > 0 ? '+' : ''}${d.data.change.toFixed(2)}%
    `)
    .style('position', 'fixed')
    .style('left', `${mouseX}px`)
    .style('top', `${mouseY}px`)
    .classed('visible', true);
}

function updateStats(data) {
  const stats = calculateStats(data);
  
  document.querySelector('.market-map__stat-value--up').textContent = stats.up;
  document.querySelector('.market-map__stat-value--down').textContent = stats.down;
  document.querySelector('.market-map__stat-value').textContent = formatVolume(stats.volume);
}

function calculateStats(data) {
  let up = 0, down = 0, volume = 0;
  
  // Если есть прямой доступ к общему объему, используем его
  if (data.totalVolume) {
    volume = data.totalVolume;
  }
  
  // Подсчитываем количество растущих и падающих акций
  if (data.children) {
    data.children.forEach(sector => {
      if (sector.children) {
        sector.children.forEach(stock => {
          if (stock.change > 0) up++;
          else if (stock.change < 0) down++;
          // Если нет общего объема, суммируем из отдельных акций
          if (!data.totalVolume) {
            volume += stock.volume || 0;
          }
        });
      }
    });
  }
  
  return { up, down, volume };
}

function formatVolume(volume) {
  // Преобразуем в число если это строка
  volume = parseInt(volume) || 0;
  
  if (volume === 0) return '0';
  if (volume >= 1e9) return (volume / 1e9).toFixed(2) + 'B';
  if (volume >= 1e6) return (volume / 1e6).toFixed(2) + 'M';
  if (volume >= 1e3) return (volume / 1e3).toFixed(2) + 'K';
  return volume.toString();
}

// Добавляем обработчик изменения размера окна
window.addEventListener('resize', debounce(() => {
  initializeMarketMap();
}, 250));

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Функция для определения мобильного устройства
function isMobileDevice() {
  return window.innerWidth <= 991;
} 