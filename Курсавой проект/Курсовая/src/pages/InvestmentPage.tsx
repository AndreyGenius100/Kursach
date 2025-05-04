import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Coins, BoldIcon as GoldIcon, Building } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CryptoData {
  [key: string]: {
    current_price: number;
    price_history: { date: string; price: number }[];
  };
}

interface MetalData {
  [key: string]: {
    current_price: number;
    price_history: { date: string; price: number }[];
  };
}

const InvestmentPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'halfYear' | 'year'>('month');
  const [cryptoData, setCryptoData] = useState<CryptoData>({});
  const [metalData, setMetalData] = useState<MetalData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price',
          {
            params: {
              ids: 'bitcoin,ethereum,binancecoin',
              vs_currencies: 'usd',
              include_24hr_change: true,
            },
          }
        );

        const historicalData = await Promise.all(
          ['bitcoin', 'ethereum', 'binancecoin'].map(async (coin) => {
            const history = await axios.get(
              `https://api.coingecko.com/api/v3/coins/${coin}/market_chart`,
              {
                params: {
                  vs_currency: 'usd',
                  days: timeframe === 'week' ? 7 :
                        timeframe === 'month' ? 30 :
                        timeframe === 'halfYear' ? 180 : 365,
                  interval: 'daily',
                },
              }
            );
            return { coin, history: history.data.prices };
          })
        );

        const newCryptoData: CryptoData = {};
        historicalData.forEach(({ coin, history }) => {
          newCryptoData[coin] = {
            current_price: response.data[coin].usd,
            price_history: history.map(([timestamp, price]: [number, number]) => ({
              date: new Date(timestamp).toLocaleDateString('ru-RU'),
              price,
            })),
          };
        });

        setCryptoData(newCryptoData);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      }
    };

    const fetchMetalData = async () => {
      try {
        // For demonstration, using mock data as real precious metals API requires paid subscription
        const mockMetalData: MetalData = {
          gold: {
            current_price: 2000,
            price_history: generateMockPriceHistory(2000),
          },
          silver: {
            current_price: 25,
            price_history: generateMockPriceHistory(25),
          },
          platinum: {
            current_price: 1000,
            price_history: generateMockPriceHistory(1000),
          },
        };
        setMetalData(mockMetalData);
      } catch (error) {
        console.error('Error fetching metal data:', error);
      }
    };

    Promise.all([fetchCryptoData(), fetchMetalData()]).then(() => setLoading(false));
  }, [timeframe]);

  const generateMockPriceHistory = (basePrice: number) => {
    const days = timeframe === 'week' ? 7 :
                timeframe === 'month' ? 30 :
                timeframe === 'halfYear' ? 180 : 365;
    
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      const randomChange = (Math.random() - 0.5) * 0.02;
      return {
        date: date.toLocaleDateString('ru-RU'),
        price: basePrice * (1 + randomChange),
      };
    });
  };

  const createChartData = (data: { date: string; price: number }[], label: string) => ({
    labels: data.map(item => item.date),
    datasets: [{
      label,
      data: data.map(item => item.price),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    }],
  });

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="container-custom text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto"></div>
          <p className="mt-4">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8 text-center">Инвестиции</h1>
        
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setTimeframe('week')}
            className={`px-4 py-2 rounded-md ${
              timeframe === 'week' 
                ? 'bg-blue-800 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Неделя
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-4 py-2 rounded-md ${
              timeframe === 'month'
                ? 'bg-blue-800 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Месяц
          </button>
          <button
            onClick={() => setTimeframe('halfYear')}
            className={`px-4 py-2 rounded-md ${
              timeframe === 'halfYear'
                ? 'bg-blue-800 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Полгода
          </button>
          <button
            onClick={() => setTimeframe('year')}
            className={`px-4 py-2 rounded-md ${
              timeframe === 'year'
                ? 'bg-blue-800 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Год
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Bitcoin (BTC)</h2>
            <Line 
              data={createChartData(cryptoData.bitcoin?.price_history || [], 'Bitcoin')} 
              options={chartOptions} 
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Ethereum (ETH)</h2>
            <Line 
              data={createChartData(cryptoData.ethereum?.price_history || [], 'Ethereum')} 
              options={chartOptions} 
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Золото</h2>
            <Line 
              data={createChartData(metalData.gold?.price_history || [], 'Золото')} 
              options={chartOptions} 
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Серебро</h2>
            <Line 
              data={createChartData(metalData.silver?.price_history || [], 'Серебро')} 
              options={chartOptions} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full text-blue-800 mr-4">
                <Coins size={24} />
              </div>
              <h2 className="text-xl font-bold">Криптовалюты</h2>
            </div>
            <ul className="space-y-4">
              {Object.entries(cryptoData).map(([coin, data]) => (
                <li key={coin} className="flex justify-between items-center">
                  <span>{coin === 'bitcoin' ? 'Bitcoin (BTC)' : 
                         coin === 'ethereum' ? 'Ethereum (ETH)' : 
                         'Binance Coin (BNB)'}</span>
                  <span className="font-semibold">${data.current_price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full text-blue-800 mr-4">
                <GoldIcon size={24} />
              </div>
              <h2 className="text-xl font-bold">Драгоценные металлы</h2>
            </div>
            <ul className="space-y-4">
              {Object.entries(metalData).map(([metal, data]) => (
                <li key={metal} className="flex justify-between items-center">
                  <span>{metal.charAt(0).toUpperCase() + metal.slice(1)}</span>
                  <span className="font-semibold">${data.current_price.toFixed(2)}/унция</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full text-blue-800 mr-4">
                <Building size={24} />
              </div>
              <h2 className="text-xl font-bold">Облигации</h2>
            </div>
            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <span>Государственные</span>
                <span className="font-semibold">8.5% годовых</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Корпоративные</span>
                <span className="font-semibold">12% годовых</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Еврооблигации</span>
                <span className="font-semibold">6% годовых</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentPage;