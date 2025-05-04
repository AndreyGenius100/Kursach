import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/save-contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setSubmitted(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      setError('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.');
      console.error('Form submission error:', err);
    }
  };
  
  return (
    <div className="py-12">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8 text-center">Контакты</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Свяжитесь с нами</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full text-blue-800">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Адрес</h3>
                  <address className="not-italic text-gray-600">
                    220137, Республика Беларусь<br />
                    г. Минск, ул. Охотская, 137<br />
                  </address>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full text-blue-800">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Телефон</h3>
                  <p className="text-gray-600">+375 29 596-57-50</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full text-blue-800">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <p className="text-gray-600">latsgoy@gmail.com</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-3">Режим работы</h3>
              <table className="w-full text-gray-600">
                <tbody>
                  <tr>
                    <td className="py-1 pr-4 font-medium">Понедельник - Пятница:</td>
                    <td>9:00 - 19:00</td>
                  </tr>
                  <tr>
                    <td className="py-1 pr-4 font-medium">Суббота:</td>
                    <td>10:00 - 16:00</td>
                  </tr>
                  <tr>
                    <td className="py-1 pr-4 font-medium">Воскресенье:</td>
                    <td>Выходной</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Напишите нам</h2>
            
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-md p-6 text-center">
                <div className="flex justify-center text-green-500 mb-4">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Сообщение отправлено!</h3>
                <p className="text-green-700">Спасибо за обращение. Мы свяжемся с вами в ближайшее время.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
                    {error}
                  </div>
                )}
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Сообщение
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="w-full btn btn-primary flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  <span>Отправить сообщение</span>
                </button>
              </form>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="aspect-w-16 aspect-h-9">
            <img 
              src="https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="Карта расположения офиса" 
              className="w-full h-[400px] object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;