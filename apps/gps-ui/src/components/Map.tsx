import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GpsPoint } from '@/types';
import { useEffect } from 'react';

// Fix for default marker icon in Leaflet + React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapProps {
    points: Record<string, GpsPoint>;
    selectedCar: string | null;
}

function RecenterMap({ position }: { position: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(position);
    }, [position, map]);
    return null;
}

export function Map({ points, selectedCar }: MapProps) {
    const selectedPoint = selectedCar ? points[selectedCar] : null;
    const center: [number, number] = selectedPoint
        ? [selectedPoint.lat, selectedPoint.lng]
        : [10.762622, 106.660172]; // Default to HCM city

    return (
        <div className="w-full h-full relative">
            <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {Object.values(points).map((point) => (
                    <Marker
                        key={point.licenseNumber}
                        position={[point.lat, point.lng]}
                    >
                        <Popup>
                            <div className="font-semibold">{point.licenseNumber}</div>
                            <div className="text-xs">Lat: {point.lat.toFixed(6)}</div>
                            <div className="text-xs">Lng: {point.lng.toFixed(6)}</div>
                        </Popup>
                    </Marker>
                ))}
                {selectedPoint && <RecenterMap position={[selectedPoint.lat, selectedPoint.lng]} />}
            </MapContainer>
        </div>
    );
}
