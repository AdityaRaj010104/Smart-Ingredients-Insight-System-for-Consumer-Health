// src/components/NutritionBadge.jsx
import React from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Info } from 'lucide-react';
import { NUTRITION_INFO } from '../lib/NutritionInfo';

const NutritionBadge = ({ nutrient, value }) => {
  const nutrientInfo = NUTRITION_INFO[nutrient];
  
  if (!nutrientInfo) return null;

  const levelInfo = nutrientInfo.getLevelInfo(value);

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <div 
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 ${levelInfo.borderColor} ${levelInfo.bgColor} cursor-help transition-all hover:scale-105 hover:shadow-md`}
        >
          <span className={`font-bold ${levelInfo.textColor} text-sm`}>
            {nutrientInfo.name}
          </span>
          <span className={`${levelInfo.textColor} font-semibold text-sm`}>
            {value}{nutrientInfo.unit}
          </span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-0" align="start">
        <div className={`${levelInfo.bgColor} border-l-4 ${levelInfo.borderColor} p-4`}>
          <div className="flex items-start gap-3 mb-3">
            <div className={`${levelInfo.bgColor} border-2 ${levelInfo.borderColor} rounded-full p-2`}>
              <Info className={`w-4 h-4 ${levelInfo.textColor}`} />
            </div>
            <div className="flex-1">
              <h4 className={`font-bold ${levelInfo.textColor} mb-1`}>
                {nutrientInfo.name}
              </h4>
              <div className={`inline-block px-2 py-0.5 ${levelInfo.bgColor} border ${levelInfo.borderColor} rounded-full`}>
                <span className={`text-xs font-semibold ${levelInfo.textColor}`}>
                  {levelInfo.label}
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {nutrientInfo.description}
              </p>
            </div>
            
            <div className="bg-white/50 rounded-lg p-3 border border-gray-200">
              <h5 className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                💡 Health Tip
              </h5>
              <p className="text-xs text-gray-600 leading-relaxed">
                {nutrientInfo.healthTip}
              </p>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default NutritionBadge;