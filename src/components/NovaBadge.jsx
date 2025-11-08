// src/components/NovaBadge.jsx
import React from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import { NOVA_GROUPS } from '../lib/NutritionInfo';

const NovaBadge = ({ novaGroup, size = 'default' }) => {
  const novaInfo = NOVA_GROUPS[novaGroup];
  
  if (!novaInfo) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    default: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <Badge 
          className={`${novaInfo.color} text-white hover:opacity-90 cursor-help ${sizeClasses[size]} font-semibold border-0 transition-all hover:scale-105`}
        >
          NOVA {novaGroup}
        </Badge>
      </HoverCardTrigger>
      <HoverCardContent className="w-96 p-0" align="start">
        <div className={`${novaInfo.bgLight} border-l-4 ${novaInfo.borderColor} p-5`}>
          <div className="flex items-start gap-3 mb-3">
            <div className={`${novaInfo.color} rounded-full p-2`}>
              <Info className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className={`font-bold ${novaInfo.textColor} mb-1`}>
                {novaInfo.title}
              </h4>
              <p className="text-xs text-gray-600 font-medium">
                {novaInfo.shortLabel}
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <h5 className="text-xs font-semibold text-gray-700 mb-1 uppercase">Description</h5>
              <p className="text-sm text-gray-600 leading-relaxed">
                {novaInfo.description}
              </p>
            </div>
            
            <div>
              <h5 className="text-xs font-semibold text-gray-700 mb-1 uppercase">Examples</h5>
              <p className="text-sm text-gray-600 leading-relaxed">
                {novaInfo.examples}
              </p>
            </div>
            
            <div className={`${novaInfo.bgLight} border ${novaInfo.borderColor} rounded-lg p-3`}>
              <h5 className="text-xs font-semibold text-gray-700 mb-1 uppercase flex items-center gap-1">
                <span>Health Impact</span>
              </h5>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                {novaInfo.healthImpact}
              </p>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default NovaBadge;