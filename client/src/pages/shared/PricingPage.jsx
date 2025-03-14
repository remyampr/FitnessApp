import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaStar } from 'react-icons/fa';

export const PricingPage = () => {
  const navigate = useNavigate();
  const [duration, setDuration] = useState('3month');
  
  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      description: 'Essential fitness coaching suitable for beginners',
      price: duration === '3month' ? 1999 : 3599,
      popular: false,
      features: [
        '2 sessions per week',
        'Basic workout plans',
        'Email support',
      ]
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      description: 'Comprehensive fitness coaching for serious results',
      price: duration === '3month' ? 4999 : 8999,
      popular: true,
      features: [
        '5 sessions per week',
        'Personalized workout plans',
        '24/7 chat support',
        'Nutrition guidance',
        'Progress tracking',
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Fitness Journey</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Select the plan that fits your goals and commit to your transformation with FitMaster.
          </p>
        </div>

        {/* Duration Toggle */}
        <div className="max-w-xs mx-auto mb-12">
          <div className="bg-gray-800 rounded-lg p-1 flex">
            <button
              className={`flex-1 py-2 rounded-md text-center transition-colors ${
                duration === '3month' ? 'bg-primary text-white' : 'text-gray-300 hover:text-white'
              }`}
              onClick={() => setDuration('3month')}
            >
              3 Months
            </button>
            <button
              className={`flex-1 py-2 rounded-md text-center transition-colors ${
                duration === '6month' ? 'bg-primary text-white' : 'text-gray-300 hover:text-white'
              }`}
              onClick={() => setDuration('6month')}
            >
              6 Months
            </button>
          </div>
          <p className="text-center text-sm text-gray-400 mt-2">
            {duration === '6month' && 'Save up to 10% with 6-month plans'}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative rounded-xl overflow-hidden ${
                plan.popular ? 'border-2 border-primary' : 'border border-gray-700'
              } bg-gray-800/50 backdrop-blur-sm shadow-xl`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 rounded-bl-lg flex items-center">
                  <FaStar className="mr-1" /> Popular
                </div>
              )}
              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-300 mb-4">{plan.description}</p>
                <div className="flex items-end mb-6">
                  <span className="text-4xl font-bold">₹{plan.price}</span>
                  <span className="text-gray-400 ml-2">/ {duration === '3month' ? '3 months' : '6 months'}</span>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <FaCheckCircle className="text-primary mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate('/user/signup')}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    plan.popular 
                      ? 'bg-primary hover:bg-primary-focus text-white' 
                      : 'bg-white text-primary hover:bg-gray-100'
                  }`}
                >
                  Sign Up Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="collapse collapse-arrow bg-gray-800/50 rounded-lg">
              <input type="radio" name="faq-accordion" defaultChecked />
              <div className="collapse-title text-xl font-medium">
                How do I select a trainer?
              </div>
              <div className="collapse-content">
                <p>After signing up, you'll be able to browse our roster of certified trainers and select one based on their specialization, experience, and training style.</p>
              </div>
            </div>
            
            <div className="collapse collapse-arrow bg-gray-800/50 rounded-lg">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-xl font-medium">
                What payment methods do you accept?
              </div>
              <div className="collapse-content">
                <p>We accept all major credit cards, debit cards, UPI, and selected digital wallets. All transactions are secured with industry-standard encryption.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Fitness Journey?</h2>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              className="btn bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              onClick={() => navigate("/user/signup")}
            >
              Sign Up Now
            </button>
            <Link to="/our-trainers" className="btn btn-outline text-white border-white hover:bg-white hover:text-primary px-8 py-3 text-lg font-semibold">
              Meet Our Trainers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
