import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import NovaBadge from "../src/components/NovaBadge";

// 🖼️ Hardcoded images for known popular products
const PRODUCT_IMAGES = {
  
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

   

// 🌿 Nutrient Insights
const NUTRIENT_INSIGHTS = {
  calories: "Calories indicate the energy value of this food per 100g.",
  protein: "Protein helps in muscle building and repair.",
  fiber: "Fiber supports healthy digestion and metabolism.",
  fat: "Fat is a source of energy and helps absorb vitamins.",
  carbs: "Carbohydrates provide energy for daily activities."
};

const PopularProductDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedNutrient, setSelectedNutrient] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/products/extra/${encodeURIComponent(name)}`
        );
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [name]);

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

  // 🧠 Determine image based on product name
  const imageUrl = PRODUCT_IMAGES[product.name] || PRODUCT_IMAGES.default;

  const nutrients = [
    { key: "calories", label: "Calories", value: product.calories, unit: "kcal" },
    { key: "protein", label: "Protein", value: product.protein, unit: "g" },
    { key: "carbs", label: "Carbs", value: product.carbs, unit: "g" },
    { key: "fat", label: "Fat", value: product.fat, unit: "g" },
    { key: "fiber", label: "Fiber", value: product.fiber, unit: "g" }
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
            <Sparkles className="w-6 h-6 text-emerald-600" />
            <span className="font-bold text-emerald-600 text-lg">Popular Product</span>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-10 items-start">
        {/* Product Image */}
        <div className="lg:col-span-1">
          <Card className="shadow-2xl rounded-xl overflow-hidden border-0">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-72 lg:h-[300px] object-cover transition-transform hover:scale-105"
            />
          </Card>
        </div>

        {/* Product Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Name & Category */}
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-gray-900">{product.name}</h1>
            <p className="text-lg text-gray-600">{product.category}</p>
          </div>

          {/* NOVA Group */}
          {product.nova_group && (
            <div className="flex items-center gap-4">
              <NovaBadge novaGroup={product.nova_group} size="lg" />
              <Badge className="bg-emerald-100 text-emerald-800 font-medium py-2 px-4 rounded-lg">
                Processed Level: {product.nova_group}
              </Badge>
            </div>
          )}

          {/* Nutrition Info */}
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-0 shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Nutritional Information (per 100g)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {nutrients.map((n) => (
                  <div
                    key={n.key}
                    onClick={() =>
                      setSelectedNutrient(selectedNutrient === n.key ? null : n.key)
                    }
                    className="cursor-pointer p-3 rounded-lg hover:bg-emerald-100 transition text-center shadow-sm"
                  >
                    <div className="font-medium text-gray-800">{n.label}</div>
                    <div className="text-emerald-700 font-bold text-lg">
                      {n.value ? `${n.value} ${n.unit}` : "N/A"}
                    </div>
                  </div>
                ))}
              </div>

              {/* Nutrient Insight */}
              {selectedNutrient && (
                <div className="mt-4 p-4 bg-emerald-50 border-l-4 border-emerald-600 rounded-lg shadow">
                  <p className="text-gray-800 font-medium">
                    {NUTRIENT_INSIGHTS[selectedNutrient]}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Insights */}
          <Card className="bg-white shadow-lg rounded-xl border-0 w-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Product Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-700">
              <p>
                This popular product belongs to the{" "}
                <span className="font-medium text-emerald-700">
                  {product.category}
                </span>{" "}
                category and has a NOVA Group rating of{" "}
                <span className="font-semibold">{product.nova_group}</span>.
              </p>
              <p>
                It provides around{" "}
                <span className="font-semibold">{product.calories}</span> kcal per
                100g, making it a good source of energy with{" "}
                {product.protein ? `${product.protein}g protein` : "balanced macros"}.
              </p>
              <p>
                Fiber content of{" "}
                <span className="font-semibold">{product.fiber}g</span> supports
                digestion and overall health.
              </p>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Alert className="border-l-4 border-emerald-600 bg-emerald-50 shadow-md mt-6">
            <AlertCircle className="w-5 h-5 text-emerald-700" />
            <AlertDescription className="text-gray-800 ml-2">
              Nutrition data shown here are estimates based on database values.
              Always verify with product packaging for accurate information.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default PopularProductDetail;
