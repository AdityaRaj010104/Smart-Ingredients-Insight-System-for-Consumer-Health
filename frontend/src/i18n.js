import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      // General
      home: "Home",
      categories: "Categories",
      hi: "Hi",
      viewAll: "View All",
      logout: "Logout",
      back: "Back",
      backToDashboard: "Back to Dashboard",
      filters: {
  popular: "Most Popular",
  novaBest: "NOVA Score: Best First",
  novaWorst: "NOVA Score: Worst First",
  calLow: "Calories: Low to High",
  calHigh: "Calories: High to Low",
  proteinHigh: "Protein: High to Low"
},
nutrients: {
        calories: "Calories",
        protein: "Protein",
        fiber: "Fiber"
      },

      nutrientDescriptions: {
        calories:
          "Energy provided by food. Adults typically need 2000-2500 calories per day depending on age, gender, and activity level.",
        protein:
          "Essential macronutrient for building and repairing tissues, making enzymes and hormones.",
        fiber:
          "Important for digestive health, blood sugar control, and heart health."
      },

      nutrientTips: {
        calories:
          "Balance calorie intake with physical activity to maintain healthy weight.",
        protein:
          "Good protein sources support muscle health and immunity.",
        fiber:
          "High fiber foods improve digestion and gut health."
      },

      levels: {
        lowCalorie: "Low Calorie",
        highCalorie: "High Calorie",
        highProtein: "High Protein",
        lowProtein: "Low Protein",
        highFiber: "High Fiber",
        lowFiber: "Low Fiber",
        moderate: "Moderate"
      },

      healthTipTitle: "💡 Health Tip",

      // Sections
      topCategories: "Top Categories",
      popularProducts: "Popular Products",
      categoryProducts: "Category Products",
      popularProduct: "Popular Product",

      // Product Page
      loadingProduct: "Loading product details...",
      productNotFound: "Product Not Found",
      nutritionalInfo: "Nutritional Information",
      per100g: "per 100g",
      productInsights: "Product Insights",
      processedLevel: "Processed Level",

      // Nutrients
      calories: "Calories",
      protein: "Protein",
      carbs: "Carbohydrates",
      sugar: "Sugar",
      fiber: "Fiber",
      fat: "Fat",
      water: "Water",

      // Nutrient Insights
      nutrientInsights: {
        calories: "Calories indicate the energy value of this food per 100g.",
        protein: "Protein helps in muscle building and repair.",
        carbs: "Carbohydrates provide energy for daily activities.",
        fat: "Fat is a source of energy and helps absorb vitamins.",
        fiber: "Fiber aids digestion and promotes gut health."
      },

      // Product Description
      productDescription1_part1: "This product belongs to the",
productDescription1_part2: "category and has a NOVA Group rating of",

productDescription2_part1: "It provides around",
productDescription2_part2: "kcal per 100g, making it a good source of energy with",

productDescription3_part1: "Fiber content of",
productDescription3_part2: "supports digestion and overall health.",
productDescriptionWater_part1: "Water content of",
productDescriptionWater_part2: "indicates freshness and lighter energy density.",
healthTipTitle: "💡 Health Tip",

healthTips: {
  calories: "Maintain balanced calorie intake.",
  protein: "Include protein for muscle health.",
  fiber: "Eat fiber for digestion.",
  fat: "Choose healthy fats.",
  carbs: "Carbs give energy."
},

low: "Low",
medium: "Medium",
high: "High",

balancedMacros: "balanced macros",

      // Disclaimer
      disclaimer:
        "Nutrition data shown here are estimates. Always verify with product packaging.",
        nutritionFactsDisclaimer: "These nutrition facts are approximate and based on standard database values per 100 grams. Always check packaging for updated nutrition and allergen information."
    },
    
  },

  hi: {
    translation: {
      // General
      home: "होम",
      categories: "श्रेणियाँ",
      hi: "नमस्ते",
      viewAll: "सभी देखें",
      logout: "लॉग आउट",
      back: "वापस",
      backToDashboard: "डैशबोर्ड पर वापस जाएं",
      filters: {
  popular: "सबसे लोकप्रिय",
  novaBest: "NOVA स्कोर: सबसे अच्छा पहले",
  novaWorst: "NOVA स्कोर: सबसे खराब पहले",
  calLow: "कैलोरी: कम से ज्यादा",
  calHigh: "कैलोरी: ज्यादा से कम",
  proteinHigh: "प्रोटीन: ज्यादा से कम"
},
      nutrients: {
        calories: "कैलोरी",
        protein: "प्रोटीन",
        fiber: "फाइबर"
      },

      nutrientDescriptions: {
        calories:
          "यह भोजन से मिलने वाली ऊर्जा है। एक व्यक्ति को प्रतिदिन लगभग 2000-2500 कैलोरी की आवश्यकता होती है।",
        protein:
          "प्रोटीन शरीर के निर्माण और मरम्मत के लिए आवश्यक होता है।",
        fiber:
          "फाइबर पाचन और दिल के स्वास्थ्य के लिए महत्वपूर्ण है।"
      },

      nutrientTips: {
        calories:
          "संतुलित कैलोरी लें और नियमित व्यायाम करें।",
        protein:
          "मांसपेशियों और इम्यून सिस्टम के लिए प्रोटीन जरूरी है।",
        fiber:
          "फाइबर पाचन सुधारता है और आंतों को स्वस्थ रखता है।"
      },

      levels: {
        lowCalorie: "कम कैलोरी",
        highCalorie: "ज्यादा कैलोरी",
        highProtein: "उच्च प्रोटीन",
        lowProtein: "कम प्रोटीन",
        highFiber: "उच्च फाइबर",
        lowFiber: "कम फाइबर",
        moderate: "मध्यम"
      },

      healthTipTitle: "💡 स्वास्थ्य सुझाव",
      // Sections
      topCategories: "शीर्ष श्रेणियां",
      popularProducts: "लोकप्रिय उत्पाद",
      categoryProducts: "श्रेणी उत्पाद",
      popularProduct: "लोकप्रिय उत्पाद",

      // Product Page
      loadingProduct: "उत्पाद विवरण लोड हो रहा है...",
      productNotFound: "उत्पाद नहीं मिला",
      nutritionalInfo: "पोषण संबंधी जानकारी",
      per100g: "प्रति 100 ग्राम",
      productInsights: "उत्पाद जानकारी",
      processedLevel: "प्रसंस्करण स्तर",

      // Nutrients
      calories: "कैलोरी",
      protein: "प्रोटीन",
      carbs: "कार्बोहाइड्रेट",
      sugar: "शुगर",
      fiber: "फाइबर",
      fat: "वसा",
      water: "पानी",

      // Nutrient Insights
      nutrientInsights: {
        calories: "कैलोरी ऊर्जा को दर्शाती है।",
        protein: "प्रोटीन मांसपेशियों के निर्माण में मदद करता है।",
        carbs: "कार्बोहाइड्रेट ऊर्जा प्रदान करते हैं।",
        fat: "वसा ऊर्जा का स्रोत है।",
        fiber: "फाइबर पाचन में मदद करता है।"
      },

      // Product Description
      productDescription1_part1: "यह उत्पाद",
productDescription1_part2: "श्रेणी से संबंधित है और इसका NOVA ग्रुप है",

productDescription2_part1: "यह लगभग",
productDescription2_part2: "कैलोरी प्रति 100 ग्राम प्रदान करता है",

productDescription3_part1: "इसमें",
productDescription3_part2: "ग्राम फाइबर है जो पाचन में मदद करता है",
productDescriptionWater_part1: "इसमें",
productDescriptionWater_part2: "ग्राम पानी है जो ताजगी और हल्की ऊर्जा को दर्शाता है।",
balancedMacros: "संतुलित पोषक तत्व",
healthTipTitle: "💡 स्वास्थ्य सुझाव",

healthTips: {
  calories: "संतुलित कैलोरी लें।",
  protein: "मांसपेशियों के लिए प्रोटीन लें।",
  fiber: "पाचन के लिए फाइबर लें।",
  fat: "स्वस्थ वसा चुनें।",
  carbs: "कार्बोहाइड्रेट ऊर्जा देते हैं।"
},

low: "कम",
medium: "मध्यम",
high: "अधिक",


      // Disclaimer
      disclaimer:
        "यह पोषण जानकारी अनुमानित है। सटीक जानकारी के लिए पैकेजिंग देखें।",
        nutritionFactsDisclaimer: "ये पोषण संबंधी जानकारी अनुमानित है और प्रति 100 ग्राम के मानक डेटा पर आधारित है। सटीक पोषण और एलर्जी से संबंधित जानकारी के लिए हमेशा उत्पाद की पैकेजिंग जांचें।"
    },
    
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("lang") || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;