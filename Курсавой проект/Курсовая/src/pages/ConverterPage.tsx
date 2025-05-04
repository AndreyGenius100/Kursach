import React, { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { ArrowRight, RefreshCw } from 'lucide-react';

const ConverterPage: React.FC = () => {
  const { rates, loading, error, refreshRates } = useCurrency();
  
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>('BYN');
  const [toCurrency, setToCurrency] = useState<string>('USD');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  
  useEffect(() => {
    if (rates) {
      convertCurrency();
    }
  }, [rates, amount, fromCurrency, toCurrency]);
  
  const convertCurrency = () => {
    if (!rates || !amount) return;
    
    let result: number;
    
    if (fromCurrency === 'BYN' && toCurrency === 'BYN') {
      result = amount;
    } else if (fromCurrency === 'BYN') {
      result = amount / rates[toCurrency];
    } else if (toCurrency === 'BYN') {
      result = amount * rates[fromCurrency];
    } else {
      const amountInBYN = amount * rates[fromCurrency];
      result = amountInBYN / rates[toCurrency];
    }
    
    setConvertedAmount(result);
  };
  
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };
  
  return (
    <div className="py-12 px-4">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8 text-center">Конвертер валют</h1>
        
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin text-blue-800 mb-4">
                <RefreshCw size={32} />
              </div>
              <p>Загрузка курсов валют...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">
              <p>Ошибка загрузки курсов валют. Пожалуйста, попробуйте позже.</p>
              <button 
                onClick={refreshRates}
                className="mt-4 btn btn-primary"
              >
                Попробовать снова
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <p className="text-gray-600 mb-2">
                  Курсы валют обновлены: {new Date().toLocaleDateString('ru-RU')}
                </p>
                <button 
                  onClick={refreshRates}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw size={16} />
                  <span>Обновить курсы</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div className="md:col-span-2">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Сумма
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div className="md:col-span-1">
                  <label htmlFor="fromCurrency" className="block text-sm font-medium text-gray-700 mb-1">
                    Из
                  </label>
                  <select
                    id="fromCurrency"
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="BYN">BYN - Белорусский рубль</option>
                    {Object.keys(rates).map((currency) => (
                      <option key={currency} value={currency}>
                        {currency} - {getCurrencyName(currency)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex justify-center">
                  <button 
                    onClick={handleSwapCurrencies}
                    className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
                    aria-label="Поменять валюты местами"
                  >
                    <ArrowRight size={24} />
                  </button>
                </div>
                
                <div className="md:col-span-1">
                  <label htmlFor="toCurrency" className="block text-sm font-medium text-gray-700 mb-1">
                    В
                  </label>
                  <select
                    id="toCurrency"
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="BYN">BYN - Белорусский рубль</option>
                    {Object.keys(rates).map((currency) => (
                      <option key={currency} value={currency}>
                        {currency} - {getCurrencyName(currency)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Результат конвертации:</p>
                    <div className="mt-2">
                      <span className="text-xl font-semibold">{amount.toFixed(2)}</span>
                      <span className="text-gray-600"> {fromCurrency}</span>
                      <span className="mx-2">=</span>
                      <span className="text-2xl font-bold text-blue-800">
                        {convertedAmount ? convertedAmount.toFixed(2) : '0.00'}
                      </span>
                      <span className="text-gray-600"> {toCurrency}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3">Текущие курсы к BYN</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {Object.entries(rates).map(([currency, rate]) => (
                    <div key={currency} className="p-3 border rounded-md bg-gray-50">
                      <p className="font-medium">{currency}</p>
                      <p className="text-lg">{rate.toFixed(4)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const getCurrencyName = (currency: string): string => {
  const names: { [key: string]: string } = {
    USD: 'Доллар США',
    EUR: 'Евро',
    RUB: 'Российский рубль',
    PLN: 'Польский злотый',
    UAH: 'Украинская гривна',
    GBP: 'Британский фунт',
    CNY: 'Китайский юань',
    JPY: 'Японская иена'
  };
  return names[currency] || currency;
};

export default ConverterPage;