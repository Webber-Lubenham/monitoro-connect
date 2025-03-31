
// Hardcoded Mapbox token instead of using environment variable
const MAPBOX_TOKEN = 'pk.eyJ1IjoidGVjaC1lZHUtbGFiIiwiYSI6ImNtN3cxaTFzNzAwdWwyanMxeHJkb3RrZjAifQ.h0g6a56viW7evC7P0c5mwQ';

if (!MAPBOX_TOKEN) {
  console.error('Mapbox token is missing in environment variables');
}

export const getMapboxToken = () => MAPBOX_TOKEN;

export const mapboxConfig = {
  style: 'mapbox://styles/mapbox/streets-v12',
  initialView: {
    center: [-46.6388, -23.5489],
    zoom: 12,
  },
};
