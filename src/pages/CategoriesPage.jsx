// src/pages/CategoriesPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CATEGORIES, getProductsByCategory } from '../lib/productsData';
import { APP_NAME } from '../lib/constants';

const CategoriesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">All Categories</h1>
          <p className="text-gray-600">Browse products by category</p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map(category => {
            const productCount = getProductsByCategory(category.id).length;
            
            return (
              <Card
                key={category.id}
                className="group cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-300 border-0"
                onClick={() => navigate(`/category/${category.id}`)}
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-6xl">{category.icon}</div>
                    <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {category.name}
                  </h3>
                  
                  <p className="text-gray-600">
                    {productCount} {productCount === 1 ? 'product' : 'products'} available
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;