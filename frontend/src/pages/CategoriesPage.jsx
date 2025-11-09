// src/pages/CategoriesPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { APP_NAME } from '../lib/constants';

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/products/categories');
        const data = await res.json();
        setCategories(data);

        // Fetch products count for each category
        const productData = {};
        for (let category of data) {
          const resCat = await fetch(
            `http://127.0.0.1:5000/api/products/category/${encodeURIComponent(category)}`
          );
          const catProducts = await resCat.json();
          productData[category] = catProducts;
        }
        setProducts(productData);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories
    .filter(cat => cat !== "Not included in a food category" && cat !== "Formula" && cat !== "Human milk")


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading categories...
      </div>
    );
  }

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
  {filteredCategories.map((category, index) => (
    <Card
      key={index}
      className="group cursor-pointer p-6 flex flex-col items-start justify-between hover:shadow-lg transition-all duration-300 border-0 bg-white rounded-2xl"
      onClick={() => navigate(`/category/${encodeURIComponent(category)}`)}
    >
      <div className="flex items-center justify-between w-full">
        <div className={`w-16 h-16 flex items-center justify-center rounded-full text-xl font-bold 
                         bg-gradient-to-r from-emerald-400 to-teal-500 text-white`}>
          {category.charAt(0).toUpperCase()}
        </div>
        <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
        {category}
      </h3>
      <p className="text-gray-500 text-sm ">
        Click to view products in this category
      </p>
    </Card>
  ))}
</div>

      </div>
    </div>
  );
};

export default CategoriesPage;
