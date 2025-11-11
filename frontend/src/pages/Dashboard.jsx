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
import { Loader2 } from 'lucide-react';


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

  const [uploading, setUploading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [manualMode, setManualMode] = useState(false);



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

    //navigate(`/search?q=${encodeURIComponent(query)}`);
  };


  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };
  // handleProductClick now uses name for popular products (extra_products)
  const handlePopularProductClick = (product) => {
    // If the product came from extra_products (popular ones), open new page
    if (product.name) {
      navigate(`/popular/${encodeURIComponent(product.name)}`);
    } else {
      // fallback for old dataset (with id)
      navigate(`/product/${product.id}`);
    }
  };


  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`);
  };


  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setUploading(true);
    setPredictionResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/extract_and_predict", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setPredictionResult(data);
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to process image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const formatFeatureName = (key) => {
    const customNames = {
      energy_kcal: "Calories (kcal)",
      FATTY_ACIDS_TOTAL_SATURATED_G: "Total Saturated Fats (g)",
    };

    if (customNames[key]) return customNames[key];

    return key
      .replace(/_/g, " ") // replace underscores with spaces
      .toLowerCase()      // make lowercase
      .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize first letter of each word
  };

  const getPlaceholderImage = (category) => {
    const categoryImages = {
      "Bourbon Creams": "https://www.bigbasket.com/media/uploads/p/xl/100012354_30-britannia-bourbon-chocolate-cream-biscuits.jpg",
      "Bournville Dark Chocolate bar": "https://tse4.mm.bing.net/th/id/OIP.jl5HHko54qJfRYT7u36ABAHaHa?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
      "Cream Crackers": "https://tse4.mm.bing.net/th/id/OIP.GSouOL8kyzwNUbMLC2sjDwHaFq?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
      "Ferrero Rocher": "https://www.rakhiz.com/catalog/rakhi/CHOAC001.jpg",
      "Heinz tomato ketchup": "https://tse4.mm.bing.net/th/id/OIP.Gjxlry6hX2bO0A16PbXh1gHaHa?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
      "Kurkure": "https://tse3.mm.bing.net/th/id/OIP.c0WiMC0DEy7PUjku8-BZoAHaHa?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
      "Lays": "https://m.media-amazon.com/images/I/71kOsITKSkL.jpg",
      "Oreo": "https://th.bing.com/th/id/R.4870bcda87407c7b3eea0bf599809f86?rik=rSFG%2bJJgP4MVpw&riu=http%3a%2f%2fimages5.fanpop.com%2fimage%2fphotos%2f31900000%2fOreo-oreo-31905998-2000-1317.jpg&ehk=UJuj4Krp91jPCFOVSHOAAsQCg0NnGNJWU1eFpJIzL50%3d&risl=&pid=ImgRaw&r=0",
      "Sunflower Oil": "https://tse1.mm.bing.net/th/id/OIP.ex03LxcKKqW0juoLsiUyrAHaHa?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
      "Walnuts": "https://th.bing.com/th/id/R.ff3456d6fe93659b2762447ba0ca6dc9?rik=ogOmV03YhpG0Bg&riu=http%3a%2f%2fs3-us-west-2.amazonaws.com%2fdrann%2fwp-content%2fuploads%2f2017%2f09%2f26200539%2fwalnuts-on-wooden-table.jpeg&ehk=s%2fRRTT%2bQOVe6DuGrh1NFXd%2faFTk%2bPkwd4oXAUZR9Qig%3d&risl=1&pid=ImgRaw&r=0",
      "Aashirvaad Whole Wheat Atta": "https://tse3.mm.bing.net/th/id/OIP.Ym1fEI1UN53t_mMmWEdm3QHaHa?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
      "India Gate Brown Rice": "https://kiasumart.com/wp-content/uploads/2020/08/INDIA-GATE-BROWN-BASMATHI-RICE-5KG-F.jpg",
      "Tata Sampann Toor Dal": "https://5.imimg.com/data5/ECOM/Default/2023/6/313587974/UK/LB/FI/73577670/tata-sanpann-toor-arhar-dal-30kg-1675247435622-sku-0153-0-1000x1000.jpg",
      "24 Mantra Organic Brown Rice": "https://th.bing.com/th/id/R.0920ca76c9ffe2470560b1aeb64f34df?rik=ju1HI5U3HrcopQ&riu=http%3a%2f%2fwww.chennaigrocers.com%2fcdn%2fshop%2ffiles%2f24MantraOrganicSonamasuriBrownRice1kg_1.png%3fcrop%3dcenter%26height%3d1200%26v%3d1734690872%26width%3d1200&ehk=ZqtQVclGW1CgdPwtkjMdhPSrR8Rk9qkCmzoR3i34kMk%3d&risl=&pid=ImgRaw&r=0",
      "Fortune Soya Chunks": "https://www.fortunefoods.com/wp-content/uploads/2022/12/Soya-Chunks-44g.png",

    };

    // return a category-specific image or a general fallback
    return (
      categoryImages[category] ||
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c" // general food placeholder
    );
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
      {/* Search Bar & Action Buttons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative max-w-5xl mx-auto">

          {/* Search Bar with Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
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

              {/* Suggestions Dropdown */}
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

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Upload Button */}
              <label
                htmlFor="nutrition-upload"
                className={`p-4 rounded-xl font-medium flex items-center gap-2 shadow-md transition-all cursor-pointer
            ${uploading || manualMode
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"}
          `}
                title="Upload nutrition label"
              >
                {uploading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Scan className="w-6 h-6" />
                )}
              </label>
              <input
                id="nutrition-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading || manualMode}
              />

              {/* Manual Input Button */}
              <button
                onClick={() => {
                  setManualMode(!manualMode);
                  setPredictionResult(null);
                }}
                disabled={uploading}
                className={`p-4 rounded-xl font-medium shadow-md transition-all
            ${manualMode
                    ? "bg-teal-600 text-white"
                    : uploading
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"}
          `}
                title="Enter nutrients manually"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Manual Input Form */}
          {manualMode && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setUploading(true);
                const formData = Object.fromEntries(new FormData(e.target).entries());

                try {
                  const res = await fetch("http://127.0.0.1:8000/predict", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(
                      Object.fromEntries(
                        Object.entries(formData).map(([k, v]) => [k, parseFloat(v) || 0])
                      )
                    ),
                  });
                  if (!res.ok) throw new Error("Prediction failed");
                  const data = await res.json();
                  setPredictionResult(data);
                } catch (err) {
                  console.error(err);
                  alert("Failed to predict. Please check input values.");
                } finally {
                  setUploading(false);
                }
              }}
              className="mt-6 bg-white shadow-lg border border-gray-200 p-6 rounded-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Enter Nutrition Information</h3>
                <button
                  type="button"
                  onClick={() => setManualMode(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  "ENERGY_KCAL",
                  "PROTEIN_G",
                  "CARBOHYDRATE_G",
                  "SUGARS_TOTALG",
                  "FIBER_TOTAL_DIETARY_G",
                  "TOTAL_FAT_G",
                  "FATTY_ACIDS_TOTAL_SATURATED_G",
                  "CHOLESTEROL_MG",
                  "VITAMIN_C_MG",
                  "CALCIUM_MG",
                  "IRONMG",
                  "SODIUM_MG",
                  "TOTAL_VITAMIN_A_MCG",
                ].map((field) => (
                  <div key={field} className="flex flex-col">
                    <label className="text-xs font-medium text-gray-700 mb-1">
                      {formatFeatureName(field)}
                    </label>
                    <input
                      name={field}
                      type="number"
                      step="any"
                      placeholder="0"
                      className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  type="submit"
                  disabled={uploading}
                  className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 shadow-md transition-all ${uploading
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Predicting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Predict NOVA
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Prediction Result Box */}
          {predictionResult && (
            <Card className="relative mt-6 bg-white p-6 rounded-2xl shadow-2xl border border-gray-200">
              <button
                onClick={() => setPredictionResult(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-semibold text-emerald-700 mb-4">
                Nutrition Analysis Results
              </h3>

              <div className="overflow-x-auto mb-6">
                <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-700 font-semibold">Nutrient</th>
                      <th className="px-4 py-2 text-left text-gray-700 font-semibold">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(predictionResult.extracted_features || {})
                      .filter(([_, value]) => value !== 0 && value !== "" && value !== null)
                      .map(([key, value]) => (
                        <tr key={key} className="border-t">
                          <td className="px-4 py-2 font-medium text-gray-800">
                            {formatFeatureName(key)}
                          </td>
                          <td className="px-4 py-2 text-gray-600">{value}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-emerald-50 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <NovaBadge novaGroup={predictionResult.nova_class} size="lg" />
                  <div>
                    <p className="text-sm text-gray-600">Predicted NOVA Class</p>
                    <p className="text-2xl font-bold text-emerald-700">{predictionResult.nova_class}</p>
                  </div>
                </div>

                <Badge className="text-lg bg-white text-emerald-800 px-6 py-3 rounded-xl shadow-sm border border-emerald-200">
                  FPro Score: <span className="font-bold">{predictionResult.fpro_score}</span>
                </Badge>
              </div>
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
              onClick={() => handlePopularProductClick(product)}

              className="group cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-300 border-0"
            >
              <div className="relative overflow-hidden">
                <img
                  src={

                    getPlaceholderImage(product.name)
                  }
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