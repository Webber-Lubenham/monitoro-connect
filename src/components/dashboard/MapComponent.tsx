
import MapContainer from "./map";

interface MapComponentProps {
  location: { latitude: number; longitude: number } | null;
}

const MapComponent = ({ location }: MapComponentProps) => {
  return <MapContainer location={location} />;
};

export default MapComponent;
