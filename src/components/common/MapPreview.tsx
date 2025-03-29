
import React from 'react';
import { cn } from '@/lib/utils';

interface MapPreviewProps {
  className?: string;
}

const MapPreview = ({ className }: MapPreviewProps) => {
  return (
    <div className={cn('map-container min-h-[200px] bg-gray-100 dark:bg-gray-800', className)}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Visualização do mapa estará disponível após conexão com Mapbox
          </p>
        </div>
      </div>
      
      {/* Simulated map elements for the preview */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="h-full w-full bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-46.6388,-23.5489,12,0/800x600?access_token=pk.eyJ1IjoiZnJhbmstd2ViYmVyIiwiYSI6ImNscmhkdnhnYjA2N28ya3A3OXVpaHJnMm8ifQ.Ry9YO5UULkwxJH9uQUDyYQ')]
        bg-center bg-cover"></div>
      </div>
      
      {/* Simulated location pin */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="h-6 w-6 bg-monitoro-500 rounded-full border-2 border-white flex items-center justify-center">
          <span className="text-white text-xs">S</span>
        </div>
      </div>
    </div>
  );
};

export default MapPreview;
