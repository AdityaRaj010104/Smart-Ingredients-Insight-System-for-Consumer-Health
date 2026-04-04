import React from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Info } from 'lucide-react';
import { NUTRITION_INFO } from '../lib/NutritionInfo';
import { useTranslation } from "react-i18next";

const NutritionBadge = ({ nutrient, value }) => {
  const { t } = useTranslation();
  const nutrientInfo = NUTRITION_INFO[nutrient];

  if (!nutrientInfo) return null;

  const levelInfo = nutrientInfo.getLevelInfo(value);

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 ${levelInfo.borderColor} ${levelInfo.bgColor}`}
        >
          <span className={`font-bold ${levelInfo.textColor} text-sm`}>
            {t(nutrientInfo.nameKey)}
          </span>

          <span className={`${levelInfo.textColor} font-semibold text-sm`}>
            {value}{nutrientInfo.unit}
          </span>
        </div>
      </HoverCardTrigger>

      <HoverCardContent className="w-80 p-0" align="start">
        <div className={`${levelInfo.bgColor} border-l-4 ${levelInfo.borderColor} p-4`}>
          <div className="flex items-start gap-3 mb-3">
            <Info className={`w-4 h-4 ${levelInfo.textColor}`} />

            <div className="flex-1">
              <h4 className={`font-bold ${levelInfo.textColor}`}>
                {t(nutrientInfo.nameKey)}
              </h4>

              <span className={`text-xs font-semibold ${levelInfo.textColor}`}>
                {t(levelInfo.labelKey)}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-700">
            {t(nutrientInfo.descKey)}
          </p>

          <div className="mt-3 bg-white/50 p-2 rounded">
            <h5 className="text-xs font-semibold">
              {t("healthTipTitle")}
            </h5>

            <p className="text-xs text-gray-600">
              {t(nutrientInfo.tipKey)}
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default NutritionBadge;