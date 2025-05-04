import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

const CreditPage: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(10000);
  const [interestRate, setInterestRate] = useState<number>(15);
  const [loanTerm, setLoanTerm] = useState<number>(12);
  const [isAnnual, setIsAnnual] = useState<boolean>(true);
  
  const calculateMonthlyPayment = () => {
    const monthlyRate = isAnnual ? (interestRate / 12) / 100 : interestRate / 100;
    const numberOfPayments = loanTerm;
    
    const monthlyPayment = 
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    return isNaN(monthlyPayment) ? 0 : monthlyPayment;
  };
  
  const monthlyPayment = calculateMonthlyPayment();
  const totalPayment = monthlyPayment * loanTerm;
  const totalInterest = totalPayment - loanAmount;

  return (
    <div className="py-12">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8 text-center">Кредитный калькулятор</h1>
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Сумма кредита (BYN)
                </label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  min="0"
                  step="100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Процентная ставка
                </label>
                <div className="flex gap-4">
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="flex-1 p-3 border border-gray-300 rounded-md"
                    min="0"
                    step="0.1"
                  />
                  <select
                    value={isAnnual ? "annual" : "monthly"}
                    onChange={(e) => setIsAnnual(e.target.value === "annual")}
                    className="p-3 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="annual">Годовая</option>
                    <option value="monthly">Месячная</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Срок кредита (месяцев)
                </label>
                <input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  min="1"
                  max="360"
                />
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Ежемесячный платеж:</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {monthlyPayment.toFixed(2)} BYN
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Общая сумма:</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {totalPayment.toFixed(2)} BYN
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Сумма переплаты:</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {totalInterest.toFixed(2)} BYN
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6">Популярные кредитные предложения</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Потребительский кредит</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>Ставка: от 15% годовых</li>
                  <li>Срок: до 5 лет</li>
                  <li>Сумма: до 50 000 BYN</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Кредит на жилье</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>Ставка: от 12% годовых</li>
                  <li>Срок: до 20 лет</li>
                  <li>Сумма: до 500 000 BYN</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Автокредит</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>Ставка: от 14% годовых</li>
                  <li>Срок: до 7 лет</li>
                  <li>Сумма: до 100 000 BYN</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Бизнес-кредит</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>Ставка: от 16% годовых</li>
                  <li>Срок: до 10 лет</li>
                  <li>Сумма: до 1 000 000 BYN</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditPage;