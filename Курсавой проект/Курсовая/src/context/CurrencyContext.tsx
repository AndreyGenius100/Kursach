import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

/**
 * Интерфейс для хранения курсов валют
 * Ключ - код валюты (например, 'USD')
 * Значение - курс относительно базовой валюты (BYN)
 */
interface CurrencyRates {
  [key: string]: number;
}

/**
 * Интерфейс контекста валют
 * Определяет все данные и методы, доступные через контекст
 */
interface CurrencyContextType {
  rates: CurrencyRates; // Текущие курсы валют
  loading: boolean; // Флаг загрузки данных
  error: string | null; // Сообщение об ошибке
  refreshRates: () => Promise<void>; // Функция обновления курсов
  historicalData: { // Исторические данные по валютам
    [key: string]: { date: string; rate: number }[]; // Массив исторических значений для каждой валюты
  };
}

// Создание контекста с начальным значением undefined
const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

/**
 * Интерфейс для пропсов провайдера
 * Принимает дочерние компоненты для оборачивания контекстом
 */
interface CurrencyProviderProps {
  children: ReactNode;
}

/**
 * Провайдер контекста валют
 * Предоставляет доступ к курсам валют и методам работы с ними
 * во всех дочерних компонентах
 */
export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  // Состояния для хранения данных
  const [rates, setRates] = useState<CurrencyRates>({}); // Текущие курсы
  const [loading, setLoading] = useState<boolean>(true); // Статус загрузки
  const [error, setError] = useState<string | null>(null); // Ошибки
  const [historicalData, setHistoricalData] = useState<{
    [key: string]: { date: string; rate: number }[];
  }>({});

  /**
   * Получение исторических данных по конкретной валюте
   * @param currency - ID валюты в API Нацбанка
   * @returns Массив исторических значений курса
   */
  const fetchHistoricalRates = async (currency: string) => {
    try {
      // Расчет дат для запроса (за последний год)
      const today = new Date();
      const startDate = new Date();
      startDate.setFullYear(today.getFullYear() - 1);

      // Запрос к API Нацбанка РБ
      const response = await axios.get(
        `https://api.nbrb.by/exrates/rates/dynamics/${currency}`,
        {
          params: {
            startdate: startDate.toISOString().split('T')[0],
            enddate: today.toISOString().split('T')[0],
          },
        }
      );

      // Преобразование ответа в нужный формат
      return response.data.map((item: any) => ({
        date: new Date(item.Date).toLocaleDateString('ru-RU'),
        rate: item.Cur_OfficialRate,
      }));
    } catch (error) {
      console.error(`Ошибка при получении исторических данных для ${currency}:`, error);
      return [];
    }
  };

  /**
   * Обновление курсов валют
   * Получает актуальные курсы и исторические данные
   */
  const refreshRates = async () => {
    setLoading(true);
    setError(null);

    try {
      // Получение текущих курсов
      const response = await axios.get('https://api.nbrb.by/exrates/rates?periodicity=0');
      const newRates: CurrencyRates = {};
      const newHistoricalData: { [key: string]: { date: string; rate: number }[] } = {};

      // Обработка полученных данных
      for (const rate of response.data) {
        // Расчет курса с учетом масштаба
        newRates[rate.Cur_Abbreviation] = rate.Cur_OfficialRate / rate.Cur_Scale;
        
        // Получение исторических данных для основных валют
        if (['USD', 'EUR', 'RUB'].includes(rate.Cur_Abbreviation)) {
          const historical = await fetchHistoricalRates(rate.Cur_ID);
          newHistoricalData[rate.Cur_Abbreviation] = historical;
        }
      }

      // Обновление состояний
      setRates(newRates);
      setHistoricalData(newHistoricalData);
      setLoading(false);
    } catch (err) {
      setError('Ошибка при обновлении курсов валют');
      setLoading(false);
      console.error('Ошибка обновления курсов:', err);
    }
  };

  // Эффект для первоначальной загрузки и периодического обновления курсов
  useEffect(() => {
    refreshRates(); // Первоначальная загрузка
    const interval = setInterval(refreshRates, 60 * 60 * 1000); // Обновление каждый час
    return () => clearInterval(interval); // Очистка интервала при размонтировании
  }, []);

  // Предоставление данных через контекст
  return (
    <CurrencyContext.Provider value={{ rates, loading, error, refreshRates, historicalData }}>
      {children}
    </CurrencyContext.Provider>
  );
};

/**
 * Хук для использования контекста валют
 * Предоставляет доступ к курсам валют в компонентах
 */
export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency должен использоваться внутри CurrencyProvider');
  }
  return context;
};