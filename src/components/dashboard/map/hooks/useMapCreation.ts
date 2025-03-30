import { useState, useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import type { Map as _Map, Marker as _Marker } from 'mapbox-gl';
import { useToast } from "../../../ui/use-toast.ts";
import type { Location } from "../utils/locationUtils.ts";
import { add3DBuildings } from "../utils/mapLayerUtils.ts";
import { addAccuracyCircle } from "../features/AccuracyCircle.ts";

// Extend Mapbox types
declare module 'mapbox-gl' {
  interface Map {
    _removed: boolean;
  }

  const supported: () => boolean;
  let accessToken: string;
}

// Extend HTMLDivElement type
declare global {
  interface HTMLDivElement {
    innerHTML: string;
  }
}

interface UseMapCreationProps {
  mapContainer: React.RefObject<HTMLDivElement>;
  location: Location | null;
  mapStyle: string;
  mapboxToken: string;
  hasTokenError: boolean;
}

interface UseMapCreationReturn {
  map: mapboxgl.Map | null;
  hasMapError: boolean;
  isInitialized: boolean;
}

export const useMapCreation = ({
  mapContainer,
  location,
  mapStyle,
  mapboxToken,
  hasTokenError
}: UseMapCreationProps): UseMapCreationReturn => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [hasMapError, setHasMapError] = useState<boolean>(false);
  const [currentStyle, setCurrentStyle] = useState<string>(mapStyle);
  const isInitializedRef = useRef<boolean>(false);
  const mapLoadedRef = useRef<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const initializeMap = () => {
      try {
        if (!mapContainer.current || map || hasTokenError) return;

        // Ensure container is empty
        if (mapContainer.current.innerHTML) {
          mapContainer.current.innerHTML = '';
        }

        // Check WebGL support
        if (!mapboxgl.supported()) {
          setHasMapError(true);
          toast({
            title: "WebGL não suportado",
            description: "Seu navegador não suporta WebGL, necessário para exibir o mapa.",
            variant: "destructive",
          });
          return;
        }

        mapboxgl.accessToken = mapboxToken;

        console.log('Using Mapbox token: ', mapboxToken ? `${mapboxToken.substring(0, 8)}...` : 'null');
        
        if (!mapboxToken || mapboxToken.length < 20) {
          console.error('Invalid Mapbox token');
          setHasMapError(true);
          toast({
            title: "Erro no Mapa",
            description: "Token do Mapbox inválido. Por favor, contate o administrador.",
            variant: "destructive",
          });
          return;
        }

        const initialLocation = location || { latitude: -23.5489, longitude: -46.6388 };
        
        console.log('Iniciando mapa com localização:', initialLocation);
        
        const mapInstance = new mapboxgl.Map({
          container: mapContainer.current,
          style: mapStyle,
          center: [initialLocation.longitude, initialLocation.latitude],
          zoom: 14,
          pitch: 45,
          bearing: 0,
          antialias: true,
          transformRequest: (url, resourceType) => {
            if (resourceType === 'SpriteImage' || resourceType === 'SpriteJSON') {
              return {
                url: url,
                headers: {
                  'Cache-Control': 'max-age=86400'
                }
              };
            }
            return { url };
          }
        });

        mapInstance.on('error', (e) => {
          console.error('Mapbox error:', e);
          
          if (e.error) {
            console.error('Error details:', e.error);
          }
          
          const mapError = e.error as { status?: number };
          if (mapError && (mapError.status === 401 || mapError.status === 403)) {
            setHasMapError(true);
            toast({
              title: "Erro de Autenticação do Mapa",
              description: "Token do Mapbox inválido ou expirado. Contate o administrador do sistema.",
              variant: "destructive",
            });
          }
        });

        mapInstance.on('load', () => {
          console.log('Mapa carregado com sucesso na posição:', initialLocation);
          mapLoadedRef.current = true;
          
          if (location && location.accuracy) {
            addAccuracyCircle(mapInstance, location);
          }

          try {
            add3DBuildings(mapInstance);
          } catch (error) {
            console.error("Erro ao adicionar edifícios 3D:", error);
          }
          
          setMap(mapInstance);
          isInitializedRef.current = true;
        });
      } catch (error) {
        console.error("Erro ao inicializar o mapa:", error);
        setHasMapError(true);
        toast({
          title: "Erro no Mapa",
          description: "Não foi possível carregar o mapa. Por favor, recarregue a página.",
          variant: "destructive",
        });
      }
    };

    initializeMap();

    return () => {
      if (map) {
        try {
          if (map.getContainer()) {
            map.off('error', () => {});
            
            if (!map._removed) {
              map.remove();
            }
          }
          
          isInitializedRef.current = false;
          mapLoadedRef.current = false;
        } catch (error) {
          console.error("Erro ao limpar o mapa:", error);
        }
      }
    };
  }, [mapContainer, mapboxToken, toast, hasTokenError, location, map, mapStyle]);

  useEffect(() => {
    if (map && mapStyle !== currentStyle && mapLoadedRef.current) {
      console.log(`Changing map style from ${currentStyle} to ${mapStyle}`);
      
      const center = map.getCenter();
      const zoom = map.getZoom();
      const pitch = map.getPitch();
      const bearing = map.getBearing();
      
      try {
        map.setStyle(mapStyle);
        
        map.once('style.load', () => {
          map.setCenter(center);
          map.setZoom(zoom);
          map.setPitch(pitch);
          map.setBearing(bearing);
          
          try {
            add3DBuildings(map);
          } catch (error) {
            console.error("Error re-adding 3D buildings after style change:", error);
          }
          
          if (location && location.accuracy) {
            addAccuracyCircle(map, location);
          }
        });
        
        setCurrentStyle(mapStyle);
      } catch (error) {
        console.error("Error changing map style:", error);
        toast({
          title: "Erro de Estilo",
          description: "Não foi possível alterar o estilo do mapa.",
          variant: "destructive",
        });
      }
    }
  }, [map, mapStyle, currentStyle, location, toast]);

  return {
    map,
    hasMapError: hasMapError || hasTokenError,
    isInitialized: isInitializedRef.current
  };
};
