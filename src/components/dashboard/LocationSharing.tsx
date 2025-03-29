
import React, { useState } from 'react';
import { MapPin, Clock, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import MapPreview from '@/components/common/MapPreview';
import StatusBadge from '@/components/common/StatusBadge';

const LocationSharing = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [sharingMode, setSharingMode] = useState<'realtime' | 'scheduled'>('realtime');
  
  return (
    <Card className="card-gradient">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-monitoro-500" />
              Compartilhamento de Localização
            </CardTitle>
            <CardDescription>
              Gerencie como sua localização é compartilhada
            </CardDescription>
          </div>
          <StatusBadge 
            status={isSharing ? 'active' : 'inactive'} 
            label={isSharing ? 'Compartilhando' : 'Desativado'}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-4">
            <Switch 
              id="location-switch" 
              checked={isSharing}
              onCheckedChange={setIsSharing}
            />
            <Label htmlFor="location-switch">
              {isSharing ? 'Compartilhamento ativado' : 'Compartilhamento desativado'}
            </Label>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="realtime"
                name="sharingMode"
                checked={sharingMode === 'realtime'}
                onChange={() => setSharingMode('realtime')}
                className="text-monitoro-500"
              />
              <label htmlFor="realtime" className="flex items-center gap-1">
                <Share2 className="h-4 w-4" />
                Tempo real
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="scheduled"
                name="sharingMode"
                checked={sharingMode === 'scheduled'}
                onChange={() => setSharingMode('scheduled')}
                className="text-monitoro-500"
              />
              <label htmlFor="scheduled" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Programado
              </label>
            </div>
          </div>
        </div>
        
        <MapPreview className="mt-4" />
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Configurações avançadas
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LocationSharing;
