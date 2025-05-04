import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Компонент Footer - подвал сайта
 * Отвечает за:
 * 1. Отображение информации о компании
 * 2. Быстрые ссылки для навигации
 * 3. Контактную информацию
 * 4. Копирайт
 */
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container-custom py-8">
        {/* Основной контент подвала */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Информация о компании */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">ФинПомощник</h3>
            <p className="text-gray-300">
              Ваш надежный финансовый консультант. Мы помогаем принимать разумные финансовые решения.
            </p>
          </div>
          
          {/* Быстрые ссылки */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Быстрые ссылки</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/converter" className="text-gray-300 hover:text-white transition-colors">
                  Конвертер валют
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  О нас
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Контактная информация */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Контакты</h4>
            <address className="not-italic text-gray-300">
              <p>г. Минск, ул. Свердлова 13</p>
              <p>Телефон: +375 29 596 57 50</p>
              <p>Email: latsgoy@gmail.com</p>
            </address>
          </div>
        </div>
        
        {/* Копирайт */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} ФинПомощник. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;