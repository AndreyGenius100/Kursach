import React from 'react';
import Header from './Header';
import Footer from './Footer';

/**
 * Интерфейс для пропсов компонента Layout
 * @property children - дочерние элементы, которые будут отображаться между шапкой и подвалом
 */
interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Компонент Layout - общий макет для всех страниц
 * Отвечает за:
 * 1. Структурирование страницы (шапка, основной контент, подвал)
 * 2. Обеспечение единообразного внешнего вида всех страниц
 * 3. Правильное распределение пространства на странице
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    // flex-col для вертикального расположения элементов
    // min-h-screen чтобы footer всегда был внизу страницы
    <div className="flex flex-col min-h-screen">
      <Header /> {/* Шапка сайта */}
      <main className="flex-grow">{/* Основной контент */}
        {children}
      </main>
      <Footer /> {/* Подвал сайта */}
    </div>
  );
};

export default Layout;