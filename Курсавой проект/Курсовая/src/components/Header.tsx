// Импорт необходимых зависимостей
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Иконки для мобильного меню

/**
 * Компонент Header - шапка сайта
 * Отвечает за:
 * 1. Отображение логотипа
 * 2. Навигационное меню
 * 3. Мобильное меню для маленьких экранов
 */
const Header: React.FC = () => {
  // Состояние для управления мобильным меню
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Получение текущего маршрута для подсветки активного пункта меню
  const location = useLocation();

  // Пункты навигационного меню
  const navItems = [
    { name: 'Главная', path: '/' },
    { name: 'Конвертер валют', path: '/converter' },
    { name: 'Кредиты', path: '/credits' },
    { name: 'Инвестиции', path: '/investments' },
    { name: 'Контакты', path: '/contacts' },
  ];

  // Функция определения активного пункта меню
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Логотип и название сайта */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-blue-800">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span className="text-xl font-bold text-blue-900">ФинПомощник</span>
          </Link>

          {/* Десктопное навигационное меню */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-blue-800 border-b-2 border-blue-800' // Стили для активного пункта
                    : 'text-gray-600 hover:text-blue-800' // Стили для неактивного пункта
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Кнопка мобильного меню */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Мобильное меню */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 pb-6 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 font-medium rounded-md transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-800' // Стили для активного пункта в мобильном меню
                      : 'text-gray-600 hover:bg-gray-100' // Стили для неактивного пункта
                  }`}
                  onClick={() => setMobileMenuOpen(false)} // Закрываем меню при клике
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;