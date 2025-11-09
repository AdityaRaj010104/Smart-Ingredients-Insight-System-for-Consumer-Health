// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle, Scan } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import NovaBadge from "../components/NovaBadge";

const NUTRIENT_INSIGHTS = {
  calories: "Calories indicate the energy value of this food per 100g.",
  protein: "Protein helps in muscle building and repair.",
  carbs: "Carbohydrates provide energy for daily activities.",
  fat: "Fat is a source of energy and helps absorb vitamins.",
  fiber: "Fiber aids digestion and promotes gut health.",
  sugar: "Sugar content affects energy spikes and sweetness.",
  water: "Water content shows freshness and hydration potential."
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedNutrient, setSelectedNutrient] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading product details...
      </div>
    );
  }

  if (!product || product.error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const nutrients = [
    { key: "calories", label: "Calories", value: product.calories, unit: "kcal" },
    { key: "protein", label: "Protein", value: product.protein, unit: "g" },
    { key: "carbs", label: "Carbs", value: product.carbs, unit: "g" },
    { key: "sugar", label: "Sugar", value: product.sugar, unit: "g" },
    { key: "fiber", label: "Fiber", value: product.fiber, unit: "g" },
    { key: "fat", label: "Fat", value: product.fat, unit: "g" },
    { key: "water", label: "Water", value: product.water, unit: "g" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-blue-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Scan className="w-6 h-6 text-emerald-600" />
            <span className="font-bold text-emerald-600 text-lg">NutriScan</span>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-10 items-start">
        {/* Product Image */}
        <div className="lg:col-span-1">
          <Card className="shadow-2xl rounded-xl overflow-hidden border-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-72 lg:h-[300px] object-cover transition-transform hover:scale-105"
            />
          </Card>
        </div>

        {/* Product Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Name and Category */}
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-gray-900">{product.name}</h1>
            <p className="text-lg text-gray-600">{product.category}</p>
          </div>

          {/* NOVA Group */}
          <div className="flex items-center gap-4">
            <NovaBadge novaGroup={product.nova_group} size="lg" />
            <Badge className="bg-emerald-100 text-emerald-800 font-medium py-2 px-4 rounded-lg">
              Processed Level: {product.nova_group}
            </Badge>
          </div>

          {/* Nutrition Info */}
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-0 shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Nutritional Information (per 100g)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {nutrients.map(n => (
                  <div
                    key={n.key}
                    onClick={() =>
                      setSelectedNutrient(selectedNutrient === n.key ? null : n.key)
                    }
                    className="cursor-pointer p-3 rounded-lg hover:bg-emerald-100 transition text-center shadow-sm"
                  >
                    <div className="font-medium text-gray-800">{n.label}</div>
                    <div className="text-emerald-700 font-bold text-lg">{n.value} {n.unit}</div>
                  </div>
                ))}
              </div>

              {/* Nutrient Insight */}
              {selectedNutrient && (
                <div className="mt-4 p-4 bg-emerald-50 border-l-4 border-emerald-600 rounded-lg shadow">
                  <p className="text-gray-800 font-medium">{NUTRIENT_INSIGHTS[selectedNutrient]}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Insights */}
          <Card className="bg-white shadow-lg rounded-xl border-0 w-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Product Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-700">
              <p>
                This product belongs to the{" "}
                <span className="font-medium text-emerald-700">{product.category}</span>{" "}
                category and has a NOVA Group rating of{" "}
                <span className="font-semibold">{product.nova_group}</span>, which indicates
                its level of food processing.
              </p>
              <p>
                It provides around <span className="font-semibold">{product.calories}</span> kcal
                per 100g and contains a balanced mix of macronutrients.
              </p>
              <p>
                Water content of <span className="font-semibold">{product.water} g</span> indicates
                freshness and lighter energy density.
              </p>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Alert className="border-l-4 border-emerald-600 bg-emerald-50 shadow-md mt-6">
            <AlertCircle className="w-5 h-5 text-emerald-700" />
            <AlertDescription className="text-gray-800 ml-2">
              These nutrition facts are approximate and based on standard database
              values per 100 grams. Always check packaging for updated nutrition and allergen info.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
