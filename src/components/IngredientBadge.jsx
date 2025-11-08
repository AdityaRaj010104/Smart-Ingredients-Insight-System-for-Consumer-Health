// src/components/IngredientBadge.jsx
import React from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getIngredientInfo } from '../lib/NutritionInfo';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

const IngredientBadge = ({ ingredient }) => {
  const info = getIngredientInfo(ingredient);
  
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      border: 'border-emerald-300',
      hover: 'hover:bg-emerald-200',
      icon: CheckCircle
    },
    gray: {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-300',
      hover: 'hover:bg-gray-200',
      icon: AlertCircle
    },
    red: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-300',
      hover: 'hover:bg-red-200',
      icon: AlertTriangle
    }
  };

  const colors = colorMap[info.color];
  const Icon = colors.icon;

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <span 
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border ${colors.border} ${colors.bg} ${colors.text} text-xs font-medium cursor-help transition-all ${colors.hover} hover:scale-105`}
        >
          <Icon className="w-3 h-3" />
          {ingredient}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-72 p-0" align="start">
        <div className={`${colors.bg} border-l-4 ${colors.border} p-4`}>
          <div className="flex items-start gap-2 mb-2">
            <Icon className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />
            <div className="flex-1">
              <h4 className={`font-bold ${colors.text} mb-1`}>
                {ingredient}
              </h4>
              <span className={`inline-block px-2 py-0.5 ${colors.bg} border ${colors.border} rounded-full`}>
                <span className={`text-xs font-semibold ${colors.text} capitalize`}>
                  {info.type === 'positive' ? '✓ Good' : info.type === 'negative' ? '⚠ Caution' : '○ Neutral'}
                </span>
              </span>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 leading-relaxed">
            {info.description}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default IngredientBadge;