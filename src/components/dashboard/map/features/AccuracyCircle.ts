
import mapboxgl from 'mapbox-gl';

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export const addAccuracyCircle = (
  mapInstance: mapboxgl.Map, 
  loc: Location
): void => {
  const circleId = 'accuracy-circle';
  const sourceId = 'accuracy-source';
  
  // Remove existing layer and source if they exist
  if (mapInstance.getSource(sourceId)) {
    if (mapInstance.getLayer(circleId)) {
      mapInstance.removeLayer(circleId);
    }
    mapInstance.removeSource(sourceId);
  }
  
  if (!loc.accuracy) return;
  
  // Add new source and layer
  mapInstance.addSource(sourceId, {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [loc.longitude, loc.latitude]
      },
      properties: {}
    }
  });
  
  mapInstance.addLayer({
    id: circleId,
    type: 'circle',
    source: sourceId,
    paint: {
      'circle-radius': {
        stops: [
          [0, 0],
          [20, loc.accuracy / 0.5]
        ],
        base: 2
      },
      'circle-color': 'rgba(75, 192, 192, 0.2)',
      'circle-stroke-width': 1,
      'circle-stroke-color': 'rgba(75, 192, 192, 0.8)'
    }
  });
};
