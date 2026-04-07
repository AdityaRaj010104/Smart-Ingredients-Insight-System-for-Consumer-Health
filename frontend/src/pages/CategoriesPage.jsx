// src/pages/CategoriesPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTranslation } from "react-i18next";
import i18n from "i18next";

const CategoriesPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [translatedCategories, setTranslatedCategories] = useState({});

  const observerRef = useRef(null);

  // ✅ Fetch categories + products (optimized)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const lang = i18n.language.split("-")[0];
        const res = await fetch(`http://127.0.0.1:5000/api/products/categories?lang=${lang}`);
        const data = await res.json();
        setCategories(data);

        // 🔥 Parallel API calls (FAST)
        const promises = data.map(category =>
  fetch(`http://127.0.0.1:5000/api/products/category/${encodeURIComponent(category.name_en)}`)
    .then(async res => {
      const text = await res.text();
      console.log(category.name_en, text); // 👈 check which one fails
      return JSON.parse(text);
    })
);

        const results = await Promise.all(promises);

        const productData = {};
        data.forEach((cat, i) => {
          productData[cat.name_en] = results[i];
        });

        setProducts(productData);

      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [i18n.language]);

  const filteredCategories = categories.filter(
  cat =>
    cat.name_en !== "Not included in a food category" &&
    cat.name_en !== "Formula" &&
    cat.name_en !== "Human milk"
);

  // ✅ Create observer once
//  useEffect(() => {
//   const translateAll = async () => {
//     const lang = i18n.language.split("-")[0];

//     console.log("Lang:", lang);

//     // If English → reset
//     if (lang === "en") {
//       setTranslatedCategories({});
//       return;
//     }

//     if (!filteredCategories.length) return;

//     try {
//       const result = await translateBatch(filteredCategories, lang);

//       console.log("Batch result:", result);

//       setTranslatedCategories(result);

//     } catch (err) {
//       console.error("Batch translation error:", err);
//     }
//   };

//   translateAll();
// }, [filteredCategories, i18n.language]);

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
            className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('backToDashboard')}</span>
          </button>

          <h1 className="text-4xl font-bold text-gray-900">
            {t('allCategories')}
          </h1>
          <p className="text-gray-600">{t('browseByCategory')}</p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {filteredCategories.map((category, index) => (
            <Card
              key={index}
              data-category={category}
              ref={(el) => {
                if (el && observerRef.current) {
                  observerRef.current.observe(el);
                }
              }}
              className="group cursor-pointer p-6 flex flex-col items-start justify-between hover:shadow-lg transition-all duration-300 border-0 bg-white rounded-2xl"
              onClick={() => navigate(`/category/${encodeURIComponent(category.name_en)}`)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-16 h-16 flex items-center justify-center rounded-full text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 text-white">
                  {category.name.charAt(0).toUpperCase()}
                </div>

                <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600">
                {category.name}
              </h3>

              <p className="text-gray-500 text-sm">
                {t('clickToViewProducts')}
              </p>
            </Card>
          ))}

        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;