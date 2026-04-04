export const NUTRITION_INFO = {
  calories: {
    nameKey: "nutrients.calories",
    descKey: "nutrientDescriptions.calories",
    tipKey: "nutrientTips.calories",
    unit: "kcal",

    getLevelInfo: (value) => {
      if (value < 100) {
        return {
          labelKey: "levels.lowCalorie",
          bgColor: "bg-emerald-100",
          textColor: "text-emerald-700",
          borderColor: "border-emerald-300"
        };
      }
      if (value < 300) {
        return {
          labelKey: "levels.moderate",
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
          borderColor: "border-gray-300"
        };
      }
      return {
        labelKey: "levels.highCalorie",
        bgColor: "bg-red-100",
        textColor: "text-red-700",
        borderColor: "border-red-300"
      };
    }
  },

  protein: {
    nameKey: "nutrients.protein",
    descKey: "nutrientDescriptions.protein",
    tipKey: "nutrientTips.protein",
    unit: "g",

    getLevelInfo: (value) => {
      if (value >= 10) {
        return {
          labelKey: "levels.highProtein",
          bgColor: "bg-emerald-100",
          textColor: "text-emerald-700",
          borderColor: "border-emerald-300"
        };
      }
      if (value >= 5) {
        return {
          labelKey: "levels.moderate",
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
          borderColor: "border-gray-300"
        };
      }
      return {
        labelKey: "levels.lowProtein",
        bgColor: "bg-red-100",
        textColor: "text-red-700",
        borderColor: "border-red-300"
      };
    }
  },

  fiber: {
    nameKey: "nutrients.fiber",
    descKey: "nutrientDescriptions.fiber",
    tipKey: "nutrientTips.fiber",
    unit: "g",

    getLevelInfo: (value) => {
      if (value >= 5) {
        return {
          labelKey: "levels.highFiber",
          bgColor: "bg-emerald-100",
          textColor: "text-emerald-700",
          borderColor: "border-emerald-300"
        };
      }
      if (value >= 2) {
        return {
          labelKey: "levels.moderate",
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
          borderColor: "border-gray-300"
        };
      }
      return {
        labelKey: "levels.lowFiber",
        bgColor: "bg-red-100",
        textColor: "text-red-700",
        borderColor: "border-red-300"
      };
    }
  }
};