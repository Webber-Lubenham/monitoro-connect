
import React from 'react';

interface LocationLoadingStateProps {
  isVisible: boolean;
}

export const LocationLoadingState: React.FC<LocationLoadingStateProps> = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100/90">
      <div className="text-center p-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
        <p className="font-medium text-gray-700">Aguardando localização precisa...</p>
        <p className="text-sm text-gray-500 mt-2">Isso pode levar alguns instantes</p>
      </div>
    </div>
  );
};
