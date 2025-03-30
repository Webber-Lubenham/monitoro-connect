import React from 'react';
import { MapIcon, Layers } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { MAP_STYLES } from '../utils/mapboxConfig';

interface MapLayerToggleProps {
  currentStyle: string;
  onStyleChange: (style: string) => void;
}

export const MapLayerToggle: React.FC<MapLayerToggleProps> = ({ 
  currentStyle, 
  onStyleChange 
}) => {
  const isSatellite = currentStyle === MAP_STYLES.SATELLITE;

  const handleToggle = () => {
    onStyleChange(isSatellite ? MAP_STYLES.STREETS : MAP_STYLES.SATELLITE);
  };

  return (
    <div className="absolute top-4 left-4 bg-white/90 p-2 rounded-md shadow-md z-10 flex items-center gap-2">
      <MapIcon size={18} className={!isSatellite ? "text-blue-600" : "text-gray-600"} />
      <Switch 
        checked={isSatellite}
        onCheckedChange={handleToggle}
      />
      <Layers size={18} className={isSatellite ? "text-blue-600" : "text-gray-600"} />
    </div>
  );
};
