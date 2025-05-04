import React from 'react';
import { Award, Shield, Clock, Users } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="py-12">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8 text-center">О нас</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-4">ФинПомощник – ваш надежный финансовый советник</h2>
              <p className="text-gray-700 mb-4">
                Наша компания была основана в 2020 году с целью помочь людям разобраться в сложном мире финансов 
                и принимать взвешенные финансовые решения.
              </p>
              <p className="text-gray-700 mb-4">
                Мы предоставляем актуальную информацию о курсах валют, финансовых инструментах и помогаем 
                нашим клиентам эффективно управлять своими финансами.
              </p>
              <p className="text-gray-700">
                Наши эксперты имеют многолетний опыт работы в финансовой сфере и готовы делиться своими 
                знаниями, чтобы помочь вам достичь финансовой стабильности и благополучия.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <img 
                src="https://images.pexels.com/photos/7681374/pexels-photo-7681374.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Наша команда финансовых экспертов" 
                className="rounded-lg shadow-lg max-h-96 object-cover"
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex justify-center mb-4 text-blue-800">
              <Award size={48} />
            </div>
            <h3 className="text-xl font-bold mb-2">Экспертность</h3>
            <p className="text-gray-600">
              Наши специалисты имеют высокую квалификацию и постоянно повышают свои знания в финансовой сфере.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex justify-center mb-4 text-blue-800">
              <Shield size={48} />
            </div>
            <h3 className="text-xl font-bold mb-2">Надежность</h3>
            <p className="text-gray-600">
              Мы заботимся о безопасности ваших данных и предоставляем только проверенную информацию.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex justify-center mb-4 text-blue-800">
              <Clock size={48} />
            </div>
            <h3 className="text-xl font-bold mb-2">Оперативность</h3>
            <p className="text-gray-600">
              Предоставляем актуальные данные и своевременно обновляем информацию о курсах валют.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex justify-center mb-4 text-blue-800">
              <Users size={48} />
            </div>
            <h3 className="text-xl font-bold mb-2">Клиентоориентированность</h3>
            <p className="text-gray-600">
              Индивидуальный подход к каждому клиенту и решение его финансовых задач.
            </p>
          </div>
        </div>
        
        <div className="bg-blue-800 text-white rounded-lg shadow-md p-8 mb-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Наша миссия</h2>
            <p className="text-xl">
              Помогать людям принимать обоснованные финансовые решения, чтобы они могли достичь
              своих финансовых целей и обеспечить себе стабильное будущее.
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Наша команда</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <img 
                src="https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Алексей Иванов" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-bold">Алексей Иванов</h3>
              <p className="text-blue-800 mb-2">Генеральный директор</p>
              <p className="text-gray-600">
                15+ лет опыта в финансовом консультировании и управлении.
              </p>
            </div>
            
            <div className="text-center">
              <img 
                src="https://images.pexels.com/photos/5397723/pexels-photo-5397723.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Елена Петрова" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-bold">Елена Петрова</h3>
              <p className="text-blue-800 mb-2">Финансовый аналитик</p>
              <p className="text-gray-600">
                Эксперт в области валютных рынков и финансового анализа.
              </p>
            </div>
            
            <div className="text-center">
              <img 
                src="https://images.pexels.com/photos/5384445/pexels-photo-5384445.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Михаил Сидоров" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-bold">Михаил Сидоров</h3>
              <p className="text-blue-800 mb-2">Консультант</p>
              <p className="text-gray-600">
                Специалист по персональным финансам и инвестициям.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;