
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Share2, Clock, Shield } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import StatusBadge from '@/components/common/StatusBadge';
import MapboxMap from '@/components/common/MapboxMap';

const Location = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [sharingMode, setSharingMode] = useState<'realtime' | 'scheduled'>('realtime');
  const [coordinates, setCoordinates] = useState<[number, number]>([-46.6388, -23.5489]); // São Paulo default
  
  // Get current location when sharing is activated
  useEffect(() => {
    if (isSharing && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates([position.coords.longitude, position.coords.latitude]);
          console.log('Location updated:', position.coords.longitude, position.coords.latitude);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [isSharing]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Compartilhamento de Localização</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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
              
              {/* Replace MapPreview with Mapbox map */}
              <MapboxMap coordinates={coordinates} isSharing={isSharing} className="h-[400px] mt-4 rounded-lg overflow-hidden" />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-monitoro-500" />
                Configurações de Privacidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Precisão da Localização</p>
                    <p className="text-sm text-gray-500">Alta precisão consome mais bateria</p>
                  </div>
                  <Switch id="precision-switch" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Compartilhar apenas em áreas seguras</p>
                    <p className="text-sm text-gray-500">Definidas pelos responsáveis</p>
                  </div>
                  <Switch id="safe-areas-switch" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notificar ao compartilhar</p>
                    <p className="text-sm text-gray-500">Enviar notificação ao iniciar compartilhamento</p>
                  </div>
                  <Switch id="notify-switch" defaultChecked />
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                Configurações avançadas
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Histórico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="border-b pb-2">
                  <p className="font-medium">Último compartilhamento</p>
                  <p className="text-sm text-gray-500">Hoje, 15:30 - 16:45</p>
                </div>
                <div className="border-b pb-2">
                  <p className="font-medium">Duração total hoje</p>
                  <p className="text-sm text-gray-500">1h 15min</p>
                </div>
                <div>
                  <p className="font-medium">Responsáveis notificados</p>
                  <p className="text-sm text-gray-500">3 responsáveis</p>
                </div>
              </div>
              
              <Button variant="link" className="w-full mt-2 px-0">
                Ver histórico completo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Location;
