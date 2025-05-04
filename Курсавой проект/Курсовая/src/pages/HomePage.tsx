import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, PieChart, Shield, Users } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Финансовые решения для вашего будущего
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Мы помогаем разобраться в финансовых вопросах и принимать взвешенные решения
              для достижения ваших целей.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/converter" className="btn bg-white text-blue-900 hover:bg-blue-100">
                Конвертер валют
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Наши преимущества</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4 text-blue-800">
                <TrendingUp size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Актуальные курсы</h3>
              <p className="text-gray-600">
                Всегда свежие курсы валют и точные финансовые данные для ваших расчетов.
              </p>
            </div>
            
            <div className="card flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4 text-blue-800">
                <PieChart size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Финансовый анализ</h3>
              <p className="text-gray-600">
                Профессиональный анализ ваших финансов и рекомендации по оптимизации.
              </p>
            </div>
            
            <div className="card flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4 text-blue-800">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Безопасность</h3>
              <p className="text-gray-600">
                Надежная защита ваших данных и конфиденциальность всей информации.
              </p>
            </div>
            
            <div className="card flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4 text-blue-800">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Поддержка</h3>
              <p className="text-gray-600">
                Квалифицированные специалисты готовы ответить на все ваши вопросы.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-gray-100 py-16">
        <div className="container-custom">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">Начните планировать свое финансовое будущее</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Получите персональную консультацию от наших экспертов и разработайте свой финансовый план.
            </p>
            <Link to="/contacts" className="btn btn-primary">
              Связаться с нами
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;