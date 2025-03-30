
import mapboxgl from 'mapbox-gl';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoidGVjaC1lZHUtbGFiIiwiYSI6ImNtN3cxaTFzNzAwdWwyanMxeHJkb3RrZjAifQ.h0g6a56viW7evC7P0c5mwQ';

if (!MAPBOX_TOKEN) {
  console.error('Mapbox token não encontrado no ambiente.');
}

// Configure o token de acesso do Mapbox
mapboxgl.accessToken = MAPBOX_TOKEN;

export { mapboxgl };
