// src/lib/nutritionInfo.js

export const NOVA_GROUPS = {
  1: {
    label: "NOVA 1 - Unprocessed/Minimally Processed",
    shortLabel: "Group 1",
    title: "Unprocessed and Minimally Processed Foods",
    description: "Unprocessed (or natural) foods are edible parts of plants (fruits, leaves, stems, seeds, roots) or from animals (muscle, offal, eggs, milk), and also fungi, algae and water. Minimally processed foods are natural foods altered by methods including removal of inedible parts, drying, crushing, grinding, powdering, filtering, roasting, boiling, pasteurization, chilling, freezing, and vacuum packaging.",
    examples: "Fresh fruits, vegetables, grains, eggs, milk, meat, fish, nuts, and seeds",
    healthImpact: "Best for health! These foods are nutrient-dense and should form the basis of a healthy diet.",
    color: "bg-emerald-600",
    textColor: "text-emerald-600",
    bgLight: "bg-emerald-50",
    borderColor: "border-emerald-600",
    hoverBg: "hover:bg-emerald-100"
  },
  2: {
    label: "NOVA 2 - Processed Culinary Ingredients",
    shortLabel: "Group 2",
    title: "Processed Culinary Ingredients",
    description: "Substances derived from Group 1 foods or from nature by processes such as pressing, refining, grinding, milling, and drying. These are industrial products designed to make durable products suitable for use in kitchens to prepare, season and cook dishes and meals.",
    examples: "Oils, butter, lard, sugar, salt, vinegar, and starches",
    healthImpact: "Use in small amounts to prepare and season food. In isolation, these ingredients are unbalanced and energy-dense (400-900 kcal per 100g).",
    color: "bg-lime-500",
    textColor: "text-lime-600",
    bgLight: "bg-lime-50",
    borderColor: "border-lime-500",
    hoverBg: "hover:bg-lime-100"
  },
  3: {
    label: "NOVA 3 - Processed Foods",
    shortLabel: "Group 3",
    title: "Processed Foods",
    description: "Made by adding salt, oil, sugar or other Group 2 substances to Group 1 foods. Processes include various preservation or cooking methods, and with breads and cheeses, non-alcoholic fermentation. Most have 2-3 ingredients and are recognizable as modified versions of Group 1 foods.",
    examples: "Canned vegetables in brine, fruits in syrup, tinned fish in oil, ham, bacon, smoked fish, freshly baked bread, and simple cheeses",
    healthImpact: "Consume in moderation. These foods increase durability and enhance sensory qualities but add extra salt, sugar, or oil.",
    color: "bg-amber-500",
    textColor: "text-amber-600",
    bgLight: "bg-amber-50",
    borderColor: "border-amber-500",
    hoverBg: "hover:bg-amber-100"
  },
  4: {
    label: "NOVA 4 - Ultra-Processed Foods",
    shortLabel: "Group 4",
    title: "Ultra-Processed Foods",
    description: "Formulations of ingredients, mostly of exclusive industrial use, created by series of industrial techniques and processes. Made from substances derived from foods and additives, with little if any whole food. Processes include hydrogenation, hydrolysis, extrusion, molding, and pre-frying.",
    examples: "Soft drinks, packaged snacks, candies, mass-produced breads/buns, cookies, pastries, margarine, sweetened cereals, instant noodles, chicken nuggets, sausages, reconstituted meat products",
    healthImpact: "Limit consumption! These products are typically high in sugar, unhealthy fats, and sodium, while low in fiber and nutrients. Associated with various health risks.",
    color: "bg-red-600",
    textColor: "text-red-600",
    bgLight: "bg-red-50",
    borderColor: "border-red-600",
    hoverBg: "hover:bg-red-100"
  }
};

export const NUTRITION_INFO = {
  calories: {
    name: "Calories",
    unit: "kcal",
    description: "Energy provided by food. Adults typically need 2000-2500 calories per day depending on age, gender, and activity level.",
    healthTip: "Balance calorie intake with physical activity to maintain healthy weight.",
    getLevelInfo: (value) => {
      if (value < 100) return { 
        level: "low", 
        color: "emerald", 
        label: "Low Calorie",
        bgColor: "bg-emerald-100",
        textColor: "text-emerald-700",
        borderColor: "border-emerald-300"
      };
      if (value < 300) return { 
        level: "medium", 
        color: "gray", 
        label: "Moderate",
        bgColor: "bg-gray-100",
        textColor: "text-gray-700",
        borderColor: "border-gray-300"
      };
      return { 
        level: "high", 
        color: "red", 
        label: "High Calorie",
        bgColor: "bg-red-100",
        textColor: "text-red-700",
        borderColor: "border-red-300"
      };
    }
  },
  protein: {
    name: "Protein",
    unit: "g",
    description: "Essential macronutrient for building and repairing tissues, making enzymes and hormones. Adults need about 50-60g per day.",
    healthTip: "Good protein sources support muscle health, immune function, and satiety.",
    getLevelInfo: (value) => {
      if (value >= 10) return { 
        level: "high", 
        color: "emerald", 
        label: "High Protein",
        bgColor: "bg-emerald-100",
        textColor: "text-emerald-700",
        borderColor: "border-emerald-300"
      };
      if (value >= 5) return { 
        level: "medium", 
        color: "gray", 
        label: "Moderate",
        bgColor: "bg-gray-100",
        textColor: "text-gray-700",
        borderColor: "border-gray-300"
      };
      return { 
        level: "low", 
        color: "red", 
        label: "Low Protein",
        bgColor: "bg-red-100",
        textColor: "text-red-700",
        borderColor: "border-red-300"
      };
    }
  },
  carbs: {
    name: "Carbohydrates",
    unit: "g",
    description: "Primary energy source for the body and brain. Focus on complex carbs from whole grains, fruits, and vegetables.",
    healthTip: "Choose complex carbs over simple sugars for sustained energy and better health.",
    getLevelInfo: (value) => {
      if (value < 20) return { 
        level: "low", 
        color: "emerald", 
        label: "Low Carb",
        bgColor: "bg-emerald-100",
        textColor: "text-emerald-700",
        borderColor: "border-emerald-300"
      };
      if (value < 50) return { 
        level: "medium", 
        color: "gray", 
        label: "Moderate",
        bgColor: "bg-gray-100",
        textColor: "text-gray-700",
        borderColor: "border-gray-300"
      };
      return { 
        level: "high", 
        color: "red", 
        label: "High Carb",
        bgColor: "bg-red-100",
        textColor: "text-red-700",
        borderColor: "border-red-300"
      };
    }
  },
  fat: {
    name: "Fat",
    unit: "g",
    description: "Essential for hormone production, nutrient absorption, and cell health. Focus on healthy unsaturated fats.",
    healthTip: "Choose sources like nuts, avocados, and fish. Limit saturated and trans fats.",
    getLevelInfo: (value) => {
      if (value < 10) return { 
        level: "low", 
        color: "emerald", 
        label: "Low Fat",
        bgColor: "bg-emerald-100",
        textColor: "text-emerald-700",
        borderColor: "border-emerald-300"
      };
      if (value < 20) return { 
        level: "medium", 
        color: "gray", 
        label: "Moderate",
        bgColor: "bg-gray-100",
        textColor: "text-gray-700",
        borderColor: "border-gray-300"
      };
      return { 
        level: "high", 
        color: "red", 
        label: "High Fat",
        bgColor: "bg-red-100",
        textColor: "text-red-700",
        borderColor: "border-red-300"
      };
    }
  },
  fiber: {
    name: "Fiber",
    unit: "g",
    description: "Important for digestive health, blood sugar control, and heart health. Adults need 25-30g per day.",
    healthTip: "High fiber foods promote satiety and support healthy gut bacteria.",
    getLevelInfo: (value) => {
      if (value >= 5) return { 
        level: "high", 
        color: "emerald", 
        label: "High Fiber",
        bgColor: "bg-emerald-100",
        textColor: "text-emerald-700",
        borderColor: "border-emerald-300"
      };
      if (value >= 2) return { 
        level: "medium", 
        color: "gray", 
        label: "Moderate",
        bgColor: "bg-gray-100",
        textColor: "text-gray-700",
        borderColor: "border-gray-300"
      };
      return { 
        level: "low", 
        color: "red", 
        label: "Low Fiber",
        bgColor: "bg-red-100",
        textColor: "text-red-700",
        borderColor: "border-red-300"
      };
    }
  },
  sugar: {
    name: "Sugar",
    unit: "g",
    description: "Added sugars should be limited. WHO recommends less than 25g (6 teaspoons) of added sugar per day.",
    healthTip: "High sugar intake linked to obesity, diabetes, and heart disease. Choose naturally sweet foods.",
    getLevelInfo: (value) => {
      if (value < 5) return { 
        level: "low", 
        color: "emerald", 
        label: "Low Sugar",
        bgColor: "bg-emerald-100",
        textColor: "text-emerald-700",
        borderColor: "border-emerald-300"
      };
      if (value < 15) return { 
        level: "medium", 
        color: "gray", 
        label: "Moderate",
        bgColor: "bg-gray-100",
        textColor: "text-gray-700",
        borderColor: "border-gray-300"
      };
      return { 
        level: "high", 
        color: "red", 
        label: "High Sugar",
        bgColor: "bg-red-100",
        textColor: "text-red-700",
        borderColor: "border-red-300"
      };
    }
  },
  sodium: {
    name: "Sodium",
    unit: "mg",
    description: "Essential mineral but excess intake raises blood pressure. Limit to 2000mg per day.",
    healthTip: "Most sodium comes from processed foods. Choose fresh, whole foods when possible.",
    getLevelInfo: (value) => {
      if (value < 200) return { 
        level: "low", 
        color: "emerald", 
        label: "Low Sodium",
        bgColor: "bg-emerald-100",
        textColor: "text-emerald-700",
        borderColor: "border-emerald-300"
      };
      if (value < 400) return { 
        level: "medium", 
        color: "gray", 
        label: "Moderate",
        bgColor: "bg-gray-100",
        textColor: "text-gray-700",
        borderColor: "border-gray-300"
      };
      return { 
        level: "high", 
        color: "red", 
        label: "High Sodium",
        bgColor: "bg-red-100",
        textColor: "text-red-700",
        borderColor: "border-red-300"
      };
    }
  }
};

export const INGREDIENT_INFO = {
  // Positive ingredients
  "whole wheat": {
    type: "positive",
    description: "Rich in fiber, vitamins, and minerals. Better than refined wheat for blood sugar control and digestive health.",
    color: "emerald"
  },
  "oats": {
    type: "positive",
    description: "High in fiber and protein. Supports heart health and helps lower cholesterol.",
    color: "emerald"
  },
  "fruits": {
    type: "positive",
    description: "Natural source of vitamins, minerals, fiber, and antioxidants. Essential for overall health.",
    color: "emerald"
  },
  "vegetables": {
    type: "positive",
    description: "Nutrient-dense and low in calories. Provide essential vitamins, minerals, and phytonutrients.",
    color: "emerald"
  },
  "nuts": {
    type: "positive",
    description: "Rich in healthy fats, protein, and fiber. Support heart and brain health.",
    color: "emerald"
  },
  
  // Neutral ingredients
  "wheat flour": {
    type: "neutral",
    description: "Common ingredient in breads and baked goods. Refined flour lacks some nutrients found in whole wheat.",
    color: "gray"
  },
  "milk": {
    type: "neutral",
    description: "Good source of calcium and protein. Choose based on dietary needs and lactose tolerance.",
    color: "gray"
  },
  "salt": {
    type: "neutral",
    description: "Essential mineral in moderation. Excess intake can raise blood pressure.",
    color: "gray"
  },
  
  // Negative ingredients
  "palm oil": {
    type: "negative",
    description: "High in saturated fat. Linked to increased cholesterol levels when consumed in excess.",
    color: "red"
  },
  "hydrogenated oil": {
    type: "negative",
    description: "Contains trans fats which raise bad cholesterol and lower good cholesterol. Avoid when possible.",
    color: "red"
  },
  "high fructose corn syrup": {
    type: "negative",
    description: "Highly processed sweetener linked to obesity, diabetes, and metabolic issues.",
    color: "red"
  },
  "artificial colors": {
    type: "negative",
    description: "Synthetic dyes with no nutritional value. Some linked to hyperactivity in sensitive children.",
    color: "red"
  },
  "preservatives": {
    type: "negative",
    description: "Chemicals added to extend shelf life. Some may have health concerns with long-term consumption.",
    color: "red"
  },
  "msg": {
    type: "negative",
    description: "Flavor enhancer that may cause reactions in sensitive individuals. Often found in ultra-processed foods.",
    color: "red"
  },
  "artificial flavors": {
    type: "negative",
    description: "Lab-created flavors with no nutritional benefit. Indicate highly processed foods.",
    color: "red"
  }
};

// Helper function to get ingredient info
export const getIngredientInfo = (ingredient) => {
  const lowerIngredient = ingredient.toLowerCase();
  
  // Check for exact matches
  for (const [key, value] of Object.entries(INGREDIENT_INFO)) {
    if (lowerIngredient.includes(key)) {
      return value;
    }
  }
  
  // Default neutral for unknown ingredients
  return {
    type: "neutral",
    description: "Common food ingredient. Check overall product quality and processing level.",
    color: "gray"
  };
};