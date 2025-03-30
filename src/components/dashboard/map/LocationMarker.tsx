
import mapboxgl from 'mapbox-gl';
import { Location } from './utils/locationUtils';

export class LocationMarker {
  private static lastLocation: Location | null = null;
  private static lastLogTimestamp: number = 0;
  private static LOG_THROTTLE_MS = 2000; // Limite de 2 segundos entre logs

  /**
   * Adiciona um marcador de localização personalizado ao mapa
   */
  static addToMap(map: mapboxgl.Map, location: Location): mapboxgl.Marker {
    const now = Date.now();
    const isSameLocation = this.lastLocation && 
      this.lastLocation.latitude === location.latitude && 
      this.lastLocation.longitude === location.longitude;
    
    // Só loga se a localização mudou ou se passou tempo suficiente
    if (!isSameLocation || (now - this.lastLogTimestamp > this.LOG_THROTTLE_MS)) {
      console.log('Atualizando marcador para:', location);
      this.lastLogTimestamp = now;
    }
    
    // Atualiza a última localização
    this.lastLocation = { ...location };

    // Create a marker element
    const markerElement = document.createElement('div');
    markerElement.className = 'location-marker';
    markerElement.style.width = '24px';
    markerElement.style.height = '24px';
    markerElement.style.backgroundImage = 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0iIzQyODVGNCIgZmlsbC1vcGFjaXR5PSIwLjgiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI2IiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiIGZpbGw9IiM0Mjg1RjQiLz48L3N2Zz4=")';
    markerElement.style.backgroundSize = 'contain';

    // Create and add the marker
    const marker = new mapboxgl.Marker({
      element: markerElement,
      anchor: 'center',
    })
      .setLngLat([location.longitude, location.latitude])
      .addTo(map);

    return marker;
  }
}
