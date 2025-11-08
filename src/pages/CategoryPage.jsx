// src/pages/CategoryPage.jsx (Updated with NOVA)
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import NovaBadge from '../components/NovaBadge';
import NutritionBadge from '../components/NutritionBadge';
import { CATEGORIES, getProductsByCategory } from '../lib/productsData';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('popular');
  
  const category = CATEGORIES.find(c => c.id === categoryId);
  const products = getProductsByCategory(categoryId);

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'nova-best':
        return a.novaGroup - b.novaGroup;
      case 'nova-worst':
        return b.novaGroup - a.novaGroup;
      case 'calories-low':
        return a.nutrition.calories - b.nutrition.calories;
      case 'calories-high':
        return b.nutrition.calories - a.nutrition.calories;
      case 'protein-high':
        return b.nutrition.protein - a.nutrition.protein;
      default:
        return 0;
    }
  });

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h2>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{category.icon}</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
                <p className="text-gray-600">{products.length} products available</p>
              </div>
            </div>
            
            {/* Sort Options */}
            <div className="hidden md:flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-gray-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="popular">Most Popular</option>
                <option value="nova-best">NOVA Score: Best First</option>
                <option value="nova-worst">NOVA Score: Worst First</option>
                <option value="calories-low">Calories: Low to High</option>
                <option value="calories-high">Calories: High to Low</option>
                <option value="protein-high">Protein: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map(product => (
              <Card
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="group cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-300 border-0"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 flex flex-col gap-2">
                    <NovaBadge novaGroup={product.novaGroup} size="sm" />
                    <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm border-gray-200">
                      {product.dietType}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">{product.brand} • {product.weight}</p>
                    </div>
                  </div>
                  
                  {/* Nutrition Preview */}
                  <div className="flex flex-wrap gap-1.5">
                    <NutritionBadge nutrient="calories" value={product.nutrition.calories} compact />
                    <NutritionBadge nutrient="protein" value={product.nutrition.protein} compact />
                    <NutritionBadge nutrient="fiber" value={product.nutrition.fiber} compact />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;