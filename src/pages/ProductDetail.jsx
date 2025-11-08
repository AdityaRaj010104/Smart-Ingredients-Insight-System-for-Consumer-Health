// src/pages/ProductDetail.jsx (Updated with NOVA)
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Scan } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import NovaBadge from '../components/NovaBadge';
import NutritionBadge from '../components/NutritionBadge';
import IngredientBadge from '../components/IngredientBadge';
import { getProductById } from '../lib/productsData';
import { useUser } from '../context/UserContext';
import { APP_NAME } from '../lib/constants';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const product = getProductById(id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Check allergen compatibility
  const hasAllergenConflict = user?.allergens?.some(allergen => 
    product.allergens.includes(allergen)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            
            <div className="flex items-center gap-2">
              <Scan className="w-6 h-6 text-emerald-600" />
              <span className="font-bold text-emerald-600">{APP_NAME}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div>
            <Card className="overflow-hidden border-0 shadow-xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover"
              />
            </Card>
            
            {/* Allergen Alert */}
            {hasAllergenConflict && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  ⚠️ This product contains allergens from your profile: {
                    product.allergens
                      .filter(a => user.allergens.includes(a))
                      .join(', ')
                  }
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-4">
              <Badge variant="secondary" className="mb-2">{product.brand}</Badge>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600">{product.weight}</p>
            </div>

            {/* NOVA Group & Diet Type */}
            <div className="flex items-center gap-3 mb-6">
              <NovaBadge novaGroup={product.novaGroup} size="lg" />
              <Badge className="text-sm py-2 px-4">{product.dietType}</Badge>
            </div>

            {/* Description */}
            <Card className="mb-6 border-0 bg-gray-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">About this product</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </CardContent>
            </Card>

            {/* Nutrition Info */}
            <Card className="mb-6 border-0 bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>Nutritional Information</span>
                  <span className="text-sm font-normal text-gray-600">(per 100g)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <NutritionBadge nutrient="calories" value={product.nutrition.calories} />
                  <NutritionBadge nutrient="protein" value={product.nutrition.protein} />
                  <NutritionBadge nutrient="carbs" value={product.nutrition.carbs} />
                  <NutritionBadge nutrient="fat" value={product.nutrition.fat} />
                  <NutritionBadge nutrient="fiber" value={product.nutrition.fiber} />
                  <NutritionBadge nutrient="sugar" value={product.nutrition.sugar} />
                  <NutritionBadge nutrient="sodium" value={product.nutrition.sodium} />
                </div>
              </CardContent>
            </Card>

            {/* Ingredients
            <Card className="mb-6 border-0 bg-white shadow-lg">
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Hover over each ingredient to learn more about its health impact
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient, index) => (
                    <IngredientBadge key={index} ingredient={ingredient} />
                  ))}
                </div>
              </CardContent>
            </Card> */}

            {/* Allergens
            {product.allergens.length > 0 && (
              <Card className="mb-6 border-0 bg-rose-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-rose-600" />
                    Allergen Information
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.allergens.map((allergen, index) => (
                      <Badge
                        key={index}
                        variant={user?.allergens?.includes(allergen) ? "destructive" : "secondary"}
                        className="text-sm py-1 px-3"
                      >
                        {allergen}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;