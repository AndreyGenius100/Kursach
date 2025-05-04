// Импорт необходимых зависимостей
import React from 'react';
// Router - для маршрутизации, Routes и Route - для определения маршрутов
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Импорт компонентов
import Layout from './components/Layout'; // Общий макет приложения
import HomePage from './pages/HomePage'; // Главная страница
import ConverterPage from './pages/ConverterPage'; // Страница конвертера валют
import ContactsPage from './pages/ContactsPage'; // Страница контактов
import CreditPage from './pages/CreditPage'; // Страница кредитного калькулятора
import InvestmentPage from './pages/InvestmentPage'; // Страница инвестиций
// Импорт провайдера для работы с валютами
import { CurrencyProvider } from './context/CurrencyContext';

/**
 * Главный компонент приложения
 * Отвечает за:
 * 1. Предоставление доступа к курсам валют через CurrencyProvider
 * 2. Настройку маршрутизации через Router
 * 3. Организацию общей структуры приложения через Layout
 */
function App() {
  return (
    // CurrencyProvider делает доступными курсы валют во всем приложении
    <CurrencyProvider>
      {/* Router обеспечивает навигацию между страницами */}
      <Router>
        {/* Layout задает общую структуру страниц (шапка, подвал) */}
        <Layout>
          {/* Routes определяет доступные маршруты в приложении */}
          <Routes>
            {/* Каждый Route связывает URL с конкретным компонентом */}
            <Route path="/" element={<HomePage />} /> {/* Главная страница */}
            <Route path="/converter" element={<ConverterPage />} /> {/* Конвертер валют */}
            <Route path="/credits" element={<CreditPage />} /> {/* Калькулятор кредитов */}
            <Route path="/investments" element={<InvestmentPage />} /> {/* Инвестиции */}
            <Route path="/contacts" element={<ContactsPage />} /> {/* Контактная информация */}
          </Routes>
        </Layout>
      </Router>
    </CurrencyProvider>
  );
}

export default App;