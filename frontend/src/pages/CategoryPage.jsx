// src/pages/CategoryPage.jsx (Updated with NOVA and API)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import NovaBadge from '../components/NovaBadge';
import NutritionBadge from '../components/NutritionBadge';

const CategoryPage = () => {
  const { categoryName } = useParams(); // get category name from URL
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('popular');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/products/category/${encodeURIComponent(categoryName)}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching category products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    // exclude unwanted categories
    if (categoryName !== "Not included in a food category" && categoryName !== "Formula") {
      fetchProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [categoryName]);

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'nova-best':
        return a.nova_group - b.nova_group;
      case 'nova-worst':
        return b.nova_group - a.nova_group;
      case 'calories-low':
        return a.calories - b.calories;
      case 'calories-high':
        return b.calories - a.calories;
      case 'protein-high':
        return b.protein - a.protein;
      default:
        return 0;
    }
  });

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
              <div className="text-5xl">
                {/* show first letter of category as icon */}
                {categoryName.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
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
  {loading ? (
    <div className="text-center py-12 text-gray-400 text-lg">Loading products...</div>
  ) : sortedProducts.length === 0 ? (
    <div className="text-center py-12">
      <p className="text-gray-400 text-lg">No products found in this category.</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {sortedProducts.map(product => (
    <Card
      key={product.id}
      onClick={() => navigate(`/product/${product.id}`)}
      className="group cursor-pointer transition-all duration-300 border rounded-2xl p-4 hover:shadow-lg hover:-translate-y-1"
    >
      {/* Top Badges */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          {product.category && (
            <p className="text-xs text-gray-500 line-clamp-2">
              {product.category.split(',').slice(1).join(', ')}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <NovaBadge novaGroup={product.nova_group} size="sm" />
         
        </div>
      </div>

      {/* Nutrition Preview */}
      <div className="flex flex-wrap gap-1.5 mt-2">
        <NutritionBadge nutrient="calories" value={product.calories} compact />
        <NutritionBadge nutrient="protein" value={product.protein} compact />
        <NutritionBadge nutrient="fiber" value={product.fiber} compact />
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
