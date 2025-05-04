import React from 'react';
import { Link } from 'react-router-dom';
import { PieChart, DollarSign, Briefcase, TrendingUp, Shield, FileText } from 'lucide-react';

const ServicesPage: React.FC = () => {
  const services = [
    {
      id: 1,
      title: "Финансовое планирование",
      description: "Разработка персонального финансового плана с учетом ваших целей и возможностей.",
      icon: <PieChart size={48} />,
      features: [
        "Анализ текущего финансового положения",
        "Определение финансовых целей",
        "Создание пошагового плана достижения целей",
        "Регулярный мониторинг и корректировка плана"
      ]
    },
    {
      id: 2,
      title: "Инвестиционный консалтинг",
      description: "Консультации по инвестированию средств с учетом вашего риск-профиля.",
      icon: <TrendingUp size={48} />,
      features: [
        "Определение инвестиционного профиля",
        "Подбор оптимальных инвестиционных инструментов",
        "Расчет потенциальной доходности",
        "Управление рисками инвестиционного портфеля"
      ]
    },
    {
      id: 3,
      title: "Налоговое планирование",
      description: "Оптимизация налоговых платежей в рамках действующего законодательства.",
      icon: <DollarSign size={48} />,
      features: [
        "Анализ налоговой нагрузки",
        "Разработка стратегии оптимизации налогов",
        "Консультации по изменениям в налоговом законодательстве",
        "Подготовка документов для налоговых вычетов"
      ]
    },
    {
      id: 4,
      title: "Управление долгами",
      description: "Помощь в эффективном управлении и снижении долговой нагрузки.",
      icon: <Shield size={48} />,
      features: [
        "Анализ текущих долговых обязательств",
        "Разработка стратегии погашения задолженностей",
        "Консолидация долгов",
        "Консультации по банкротству физических лиц"
      ]
    },
    {
      id: 5,
      title: "Бизнес-консультирование",
      description: "Консультации по финансовым вопросам для малого и среднего бизнеса.",
      icon: <Briefcase size={48} />,
      features: [
        "Оценка финансового состояния компании",
        "Бизнес-планирование",
        "Оптимизация денежных потоков",
        "Финансовое моделирование"
      ]
    },
    {
      id: 6,
      title: "Страховая защита",
      description: "Подбор оптимальных страховых продуктов для защиты вас и вашей семьи.",
      icon: <FileText size={48} />,
      features: [
        "Анализ страховых потребностей",
        "Подбор страховых продуктов",
        "Сравнение предложений от разных страховых компаний",
        "Сопровождение при наступлении страхового случая"
      ]
    }
  ];
  
  return (
    <div className="py-12">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8 text-center">Наши услуги</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:-translate-y-2">
              <div className="p-6">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 text-blue-800 mx-auto mb-4">
                  {service.icon}
                </div>
                
                <h3 className="text-xl font-bold text-center mb-4">{service.title}</h3>
                <p className="text-gray-600 text-center mb-6">{service.description}</p>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Что включает:</h4>
                  <ul className="space-y-1 text-gray-600">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-blue-800 mr-2">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="bg-gray-100 px-6 py-4">
                <Link 
                  to="/contacts" 
                  className="block text-center text-blue-800 font-medium hover:text-blue-900 transition-colors"
                >
                  Узнать подробнее →
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-blue-800 text-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Нужна консультация?</h2>
          <p className="text-xl mb-6">
            Наши эксперты готовы ответить на все ваши вопросы и помочь выбрать подходящую услугу.
          </p>
          <Link to="/contacts" className="btn bg-white text-blue-800 hover:bg-blue-100 inline-block">
            Связаться с нами
          </Link>
        </div>
        
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-8 text-center">Часто задаваемые вопросы</h2>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer font-semibold text-lg">
                  <span>Как проходит первая консультация?</span>
                  <span className="transition-transform group-open:rotate-180">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-gray-600">
                  <p>
                    Первая консультация включает знакомство с вашей текущей финансовой ситуацией и целями. 
                    Мы проводим интервью, анализируем предоставленные документы и определяем основные 
                    финансовые проблемы и возможности. По итогам консультации вы получаете предварительные 
                    рекомендации и план дальнейших действий.
                  </p>
                </div>
              </details>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer font-semibold text-lg">
                  <span>Сколько стоят ваши услуги?</span>
                  <span className="transition-transform group-open:rotate-180">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-gray-600">
                  <p>
                    Стоимость услуг зависит от их типа и объема работы. Мы предлагаем как разовые 
                    консультации, так и комплексное сопровождение. Точную стоимость мы определяем после 
                    первичной консультации, когда понимаем объем работы. Для получения предварительной 
                    оценки стоимости, пожалуйста, свяжитесь с нами.
                  </p>
                </div>
              </details>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer font-semibold text-lg">
                  <span>Как часто нужно обновлять финансовый план?</span>
                  <span className="transition-transform group-open:rotate-180">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-gray-600">
                  <p>
                    Рекомендуется пересматривать финансовый план раз в год или при значительных изменениях 
                    в вашей жизни (смена работы, рождение ребенка, покупка недвижимости и т.д.). Регулярный 
                    пересмотр позволяет адаптировать план к меняющимся условиям и вашим целям.
                  </p>
                </div>
              </details>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer font-semibold text-lg">
                  <span>Работаете ли вы с клиентами из других городов?</span>
                  <span className="transition-transform group-open:rotate-180">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-gray-600">
                  <p>
                    Да, мы работаем с клиентами по всей Беларуси и за ее пределами. Консультации могут 
                    проводиться в онлайн-формате через видеосвязь. Для наших клиентов также доступна 
                    возможность получать консультации по телефону или электронной почте.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ServicesPage;