import React from 'react';
import { getAccuracyLevel } from '../utils/locationUtils';

interface LocationAccuracyInfoProps {
  accuracy?: number;
}

export const LocationAccuracyInfo: React.FC<LocationAccuracyInfoProps> = ({ accuracy }) => {
  if (!accuracy) return null;
  
  const { level, color } = getAccuracyLevel(accuracy);
  
  return (
    <div className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-md shadow-md text-sm z-10">
      <p>Precisão: <span className={color}>{level}</span></p>
      <p className="text-xs text-gray-600">{Math.round(accuracy)} metros</p>
    </div>
  );
};
