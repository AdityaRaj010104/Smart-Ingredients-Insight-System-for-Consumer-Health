// src/pages/Dashboard.jsx (Updated with NOVA)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scan, Search, User, Home, Grid3x3, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import NovaBadge from '../components/NovaBadge';
import NutritionBadge from '../components/NutritionBadge';
import { APP_NAME } from '../lib/constants';
import { CATEGORIES, PRODUCTS, searchProducts } from '../lib/productsData';
import { useUser } from '../context/UserContext';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';


const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [categories, setCategories] = useState([]);



  useEffect(() => {
    const stored = localStorage.getItem('recent_searches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // useEffect(() => {
  //   const fetchSearchResults = async () => {
  //     if (!searchQuery.trim()) {
  //       setSearchResults([]);
  //       setShowSuggestions(false);
  //       return;
  //     }

  //     try {
  //       const res = await fetch(`http://127.0.0.1:5000/api/products/search?q=${encodeURIComponent(searchQuery)}`);
  //       const data = await res.json();
  //       setSearchResults(data.slice(0, 5)); // limit suggestions to 5
  //       setShowSuggestions(true);
  //     } catch (err) {
  //       console.error("Error fetching search results:", err);
  //     }
  //   };

  //   fetchSearchResults();
  // }, [searchQuery]);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/products/categories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
  if (searchQuery.trim().length > 0) {
    const fetchResults = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:5000/api/products/search?q=${encodeURIComponent(searchQuery)}`
        );
        const data = await res.json();
        setSearchResults(data.slice(0, 15)); // top 5 suggestions
        setShowSuggestions(true);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setSearchResults([]);
        setShowSuggestions(false);
      }
    };
    fetchResults();
  } else {
    setSearchResults([]);
    setShowSuggestions(false);
  }
}, [searchQuery]);


  const categoryColors = [
    'bg-emerald-100 text-emerald-700',
    'bg-teal-100 text-teal-700',
    'bg-cyan-100 text-cyan-700',
    'bg-violet-100 text-violet-700',
    'bg-pink-100 text-pink-700',
    'bg-orange-100 text-orange-700',
    'bg-yellow-100 text-yellow-800',
    'bg-red-100 text-red-700',
  ];

  const handleSearch = (query) => {
    if (!query.trim()) return;

    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recent_searches", JSON.stringify(updated));

    navigate(`/search?q=${encodeURIComponent(query)}`);
  };


  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`);
  };




  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/products/popular');
        const data = await res.json();
        setPopularProducts(data);
      } catch (error) {
        console.error('Error fetching popular products:', error);
      }
    };
    fetchPopular();
  }, []);

  const displayProducts = selectedCategory
    ? PRODUCTS.filter(p => p.category === selectedCategory)
    : popularProducts;

  const filteredCategories = categories
    .filter(cat => cat !== "Not included in a food category" && cat !== "Formula" && cat !== "Human milk")
    .slice(0, 20); // limit to 20

  return (
    <div className="min-h-screen bg-linear-to-b from-emerald-50 via-white to-blue-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                <Scan className="w-8 h-8 text-emerald-600" />
                <span className="text-2xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {APP_NAME}
                </span>
              </div>

              <div className="hidden md:flex items-center gap-6">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    navigate('/dashboard');
                  }}
                  className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                >
                  <Home className="w-5 h-5" />
                  Home
                </button>
                <button
                  onClick={() => navigate('/categories')}
                  className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                >
                  <Grid3x3 className="w-5 h-5" />
                  Categories
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Hi, {user.name || 'User'}!</span>
                  </div>
                  <Button
                    onClick={async () => {
                      try {
                        await fetch('http://127.0.0.1:5000/auth/logout', {
                          method: 'POST',
                          credentials: 'include'
                        });
                        localStorage.removeItem('user');
                        navigate('/login');
                      } catch (err) {
                        console.error('Logout failed:', err);
                      }
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <User className="w-6 h-6 text-gray-700" />
                </button>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="relative max-w-2xl mx-auto">
  <div className="relative">
    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
    
    <Input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
      placeholder="Search for products, brands, categories..."
      className="pl-12 pr-10 h-14 text-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 shadow-lg"
    />

    {/* Clear button */}
    {searchQuery && (
      <button
        onClick={() => {
          setSearchQuery('');
          setShowSuggestions(false);
        }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <X className="w-5 h-5" />
      </button>
    )}
  </div>

  {/* Suggestions */}
  {showSuggestions && searchResults.length > 0 && (
    <Card className="absolute w-full mt-2 p-2 shadow-xl z-50 max-h-96 overflow-y-auto">
      {searchResults.map(product => (
        <button
          key={product.id}
          onClick={() => handleProductClick(product.id)}
          className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
        >
          <div className="flex-1">
            <p className="font-medium text-gray-900">{product.name}</p>
            <p className="text-sm text-gray-500">{product.category}</p>
          </div>
          <NovaBadge novaGroup={product.nova_group} size="sm" />
        </button>
      ))}
    </Card>
  )}
</div>

      </div>

      {/* Top Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Top Categories</h2>
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredCategories.slice(0, 18).map((category, index) => (
            <button
              key={index}
              onClick={() => handleCategoryClick(category)}
              className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all hover:shadow-lg hover:-translate-y-1 ${selectedCategory === category
                  ? 'border-emerald-600 bg-emerald-50'
                  : 'border-gray-200 bg-white hover:border-emerald-300'
                }`}
            >
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full text-lg font-bold mb-2 ${categoryColors[index % categoryColors.length]
                  }`}
              >
                {category.charAt(0)}
              </div>
              <p className="text-sm font-medium text-gray-900 text-center">{category}</p>
            </button>
          ))}


        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {selectedCategory ? 'Category Products' : 'Popular Products'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayProducts.map(product => (
            <Card
              key={product.id}
              onClick={() => handleProductClick(product.id)}
              className="group cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-300 border-0"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                  <NovaBadge novaGroup={product.nova_group} size="sm" />
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
                    {/* <p className="text-sm text-gray-500">{product.brand} • {product.weight}</p> */}
                  </div>
                </div>

                {/* Nutrition Preview */}
                <div className="flex flex-wrap gap-1.5">
                  <NutritionBadge nutrient="calories" value={product.calories} compact />
                  <NutritionBadge nutrient="protein" value={product.protein} compact />
                  <NutritionBadge nutrient="fiber" value={product.fiber} compact />

                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;