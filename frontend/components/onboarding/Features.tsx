'use client'
import React from 'react'
import { CreditCard, Calculator, Shield, Zap } from 'lucide-react'

// Card component for feature items
const FeatureCard = ({ title, description, icon: Icon }: { title: string; description: string; icon: React.ElementType }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out h-full">
      <div className="mb-4">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700">
          <Icon size={24} />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-green-800 mb-3">{title}</h3>
      <p className="text-gray-600 text-lg">{description}</p>
    </div>
  )
}

const Features = () => {
  const features = [
    {
      title: "Expense Tracking",
      description: "Monitor all your expenses in real-time with our intuitive tracking system.",
      icon: CreditCard
    },
    {
      title: "Financial Simulations",
      description: "Run financial simulations to predict outcomes and make informed decisions.",
      icon: Calculator
    },
    {
      title: "Secure Management",
      description: "Bank-level security to keep your financial data safe and private.",
      icon: Shield
    },
    {
      title: "AI Guidance",
      description: "Get personalized financial advice powered by advanced AI technology.",
      icon: Zap
    }
  ]

  return (
    <div className='w-full px-16 py-10'>
      <div className='text-4xl text-green-800 font-bold text-center mb-12'>Why Choose Us?</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
          />
        ))}
      </div>
    </div>
  )
}

export default Features


